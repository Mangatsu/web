import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import useSWRInfinite from "swr/infinite"
import Filters from "../components/Filters"
import Layout from "../components/Layout"
import { fetchCategories, fetchLibrary } from "../lib/api/library"
import { getApiUrl, getCacheUrl, RESULT_LIMIT, StringResponse } from "../lib/api/other"
import getServerInfo from "../lib/api/serverInfo"
import { fetchFavoriteGroups } from "../lib/api/user"
import useDebounce from "../lib/hooks/useDebounce"
import { getValue, LocalPreferences } from "../lib/localStorage"
import placeholderCover from "../public/placeholder.png"
import { GalleryMeta, LibraryFilters, ServerInfo, Visibility } from "../types"

interface Props {
  apiURL: string
  cacheURL: string
  serverInfo: ServerInfo
  categories: StringResponse
  favorites: StringResponse
}

interface GalleriesResult {
  Data: GalleryMeta[]
  Count: number
}

const fetcher = (url: string, offset: number, query: LibraryFilters, token: string) =>
  fetchLibrary(url, offset, query, token).then((r) => r.json())

export default function LibraryIndex({ apiURL, cacheURL, serverInfo, categories, favorites }: Props) {
  const { data: session, status } = useSession()
  const [query, setQuery] = useState<LibraryFilters>({ nsfwHidden: getValue(LocalPreferences.NSFWPref) })
  const debouncedFilters = useDebounce(query, 100)

  const getKey = (pageIndex: number, previousPageData: unknown[]) => {
    if (previousPageData && previousPageData.length === 0) return null
    if (status === "loading") return null
    return [apiURL, pageIndex * RESULT_LIMIT, debouncedFilters, session?.user?.name]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetcher)

  if (serverInfo?.Visibility !== Visibility.Public && !session?.user) {
    return (
      <Layout serverInfo={serverInfo}>
        <Link href="api/auth/signin">Login</Link>
      </Layout>
    )
  }

  // This should actually be called "mightHaveMore", as in rare cases the data ends exactly on the offset (results % offset === 0)
  // in which, one extra request will be mades.
  const hasMore = data && data[data.length - 1].Count === RESULT_LIMIT

  // TODO: Grid masonry when major browsers support it (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)
  return (
    <Layout serverInfo={serverInfo}>
      <Filters query={query} setQuery={setQuery} categories={categories} favorites={favorites} />
      <div className="masonry sm:masonry-sm place-content-center">
        {data &&
          data.map((result: GalleriesResult) => {
            if (!result?.Data) {
              return null
            }

            return result.Data.map((gallery: GalleryMeta) => {
              return (
                <a
                  href={`g/${gallery.UUID}`}
                  key={gallery.UUID}
                  className="grid place-content-center mb-3 mr-3 bg-gray-800 bg-clip-padding rounded"
                >
                  <Image
                    alt="cover image"
                    src={
                      gallery.Thumbnail
                        ? `${cacheURL}/thumbnails/${gallery.UUID}/${gallery.Thumbnail}`
                        : placeholderCover
                    }
                    className="w-full rounded text-center"
                    width={200}
                    height={300}
                    objectFit="cover"
                    loading="lazy"
                  />
                </a>
              )
            })
          })}
      </div>
      {hasMore && (
        <button className="mb-8 bg-slate-600 w-1/2 mx-auto" onClick={() => setSize(size + 1)}>
          Load More
        </button>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverInfo = await getServerInfo()
  const session = await getSession(context)

  if (!session && serverInfo.Visibility !== Visibility.Public) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  let categories
  if (session?.user?.name) {
    categories = await fetchCategories(session.user.name)
  }

  let favorites
  if (session?.user?.name) {
    favorites = await fetchFavoriteGroups(session.user.name)
  }
  categories = categories?.Data ? categories : { Data: [], Count: 0 }
  favorites = favorites?.Data ? favorites : { Data: [], Count: 0 }

  return {
    props: { apiURL: getApiUrl(), cacheURL: getCacheUrl(), serverInfo, categories, favorites },
  }
}
