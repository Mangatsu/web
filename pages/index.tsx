import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import useSWRInfinite from "swr/infinite"
import Filters from "../components/Filters"
import Layout from "../components/Layout"
import { fetchCategories, fetchLibrary } from "../lib/api/library"
import { getCacheUrl, RESULT_LIMIT, StringResponse } from "../lib/api/other"
import getServerInfo from "../lib/api/serverInfo"
import { fetchFavoriteGroups } from "../lib/api/user"
import useDebounce from "../lib/hooks/useDebounce"
import { getValue, LocalPreferences } from "../lib/localStorage"
import placeholderCover from "../public/placeholder.png"
import { GalleryMeta, LibraryFilters, ServerInfo, Visibility } from "../types/api"

interface Props {
  serverInfo: ServerInfo
  categories: StringResponse
  favorites: StringResponse
}

interface GalleriesResult {
  Data: GalleryMeta[] | Record<string, GalleryMeta[]>
  Count: number
}

const fetcher = (offset: number, query: LibraryFilters, token: string) =>
  fetchLibrary(offset, query, token).then((r) => r.json())

export default function LibraryIndex({ serverInfo, categories, favorites }: Props) {
  const { data: session, status } = useSession()
  const [query, setQuery] = useState<LibraryFilters>({ nsfwHidden: getValue(LocalPreferences.NSFWPref) })
  const [grouped, setGrouped] = useState(false)
  const debouncedFilters = useDebounce(query, 100)

  const getKey = (pageIndex: number, previousPageData: unknown[]) => {
    if (previousPageData && previousPageData.length === 0) return null
    if (status === "loading") return null
    return [pageIndex * RESULT_LIMIT, debouncedFilters, session?.serverToken || session?.passphrase]
  }

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

  // This should actually be called "mightHaveMore", as in rare cases the data ends exactly on the offset (results % offset === 0)
  // which results one extra request being made.
  const hasMore = data && data[data.length - 1].Count === RESULT_LIMIT

  // TODO: Grid masonry when major browsers support it (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)
  return (
    <Layout serverInfo={serverInfo}>
      <Filters
        query={query}
        setQuery={setQuery}
        grouped={grouped}
        setGrouped={setGrouped}
        categories={categories}
        favorites={favorites}
      />
      <div className="masonry sm:masonry-sm place-content-center">
        {data &&
          data.map((result: GalleriesResult) => {
            if (!result?.Data) {
              return null
            }

            if (Array.isArray(result.Data)) {
              return (result.Data as GalleryMeta[]).map((gallery: GalleryMeta) => (
                <Link href={`g/${gallery.UUID}`} key={gallery.UUID}>
                  <a className="grid place-content-center mb-3 mr-3 bg-gray-800 bg-clip-padding rounded">
                    <Image
                      alt="cover image"
                      src={
                        gallery.Thumbnail
                          ? getCacheUrl(`/thumbnails/${gallery.UUID}/${gallery.Thumbnail}`)
                          : placeholderCover
                      }
                      className="w-full rounded text-center"
                      width={200}
                      height={300}
                      objectFit="cover"
                      loading="lazy"
                    />
                  </a>
                </Link>
              ))
            }

            const galleryMap = result.Data as Record<string, GalleryMeta[]>
            return Object.keys(galleryMap).map((k, i) => {
              const g = galleryMap[k]
              return (
                <div key={i} className="relative">
                  <Link href={g.length > 1 ? `series/${g[0].Series}` : `g/${g[0].UUID}`} key={g[0].UUID}>
                    <a className="grid place-content-center mb-3 mr-3 bg-gray-800 bg-clip-padding rounded">
                      <Image
                        alt="cover image"
                        src={
                          g[0].Thumbnail ? getCacheUrl(`/thumbnails/${g[0].UUID}/${g[0].Thumbnail}`) : placeholderCover
                        }
                        className="w-full rounded text-center"
                        width={200}
                        height={300}
                        objectFit="cover"
                        loading="lazy"
                      />
                    </a>
                  </Link>
                  {g.length > 1 && (
                    <div
                      style={{ margin: "-50px 0 0 15px" }}
                      className="absolute bg-slate-900 opacity-75 text-white text-center p-2 leading-3 rounded-full"
                    >
                      {g.length}
                    </div>
                  )}
                </div>
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

  const publicAccess = serverInfo.Visibility === Visibility.Public
  const privateAccess = session?.serverToken
  const restrictedAccess = serverInfo.Visibility === Visibility.Restricted && session?.passphrase
  if (!publicAccess && !privateAccess && !restrictedAccess) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  let categories
  let favorites
  if (session?.serverToken) {
    try {
      categories = await fetchCategories(session?.serverToken)
      favorites = await fetchFavoriteGroups(session?.serverToken)
    } catch {
      console.error("Failed to fetch categories and favorites. Is the backend offline?")
    }
  }

  categories = categories?.Data ? categories : { Data: [], Count: 0 }
  favorites = favorites?.Data ? favorites : { Data: [], Count: 0 }

  return {
    props: { serverInfo, categories, favorites },
  }
}
