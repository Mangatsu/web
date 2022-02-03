import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import ComicViewer from "react-comic-viewer"
import { GroupBase, OptionsOrGroups, StylesConfig } from "react-select"
import CreatableSelect from "react-select/creatable"
import useSWR from "swr"
import Button from "../../components/Button"
import Layout from "../../components/Layout"
import { fetchGallery } from "../../lib/api/library"
import { getCacheUrl, StringResponse } from "../../lib/api/other"
import getServerInfo from "../../lib/api/serverInfo"
import { fetchFavoriteGroups, updateFavoriteGroup } from "../../lib/api/user"
import { changeExtension, clamp } from "../../lib/helpers"
import { Gallery, ServerInfo, Visibility } from "../../types/api"

// Style for the react-select component (favorite selection)
const customStyles: StylesConfig = {
  input: (base) => ({ ...base, color: "#fff", maxWidth: "100px" }),
  placeholder: (base) => ({ ...base, color: "#fff" }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  menuList: (base) => ({ ...base, background: "#334155" }),
  control: (base) => ({
    ...base,
    background: "#334155",
    border: "2px solid #2563EB",
    "&:focus": {
      border: "2px solid #2563EB",
    },
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "#141921" : "#334155",
    "&:hover": {
      background: "#607ba1",
    },
  }),
}

const DEFAULT_GROUP = "Select or create a group"

interface Props {
  gallery: Gallery
  thumbnails: string[]
  page: number
  favorites: StringResponse
  serverInfo: ServerInfo
}

export default function GalleryPage({ gallery, thumbnails, page, serverInfo }: Props) {
  const { data: session } = useSession()
  const [files, setFiles] = useState<string[]>([])
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [isShift, setIsShift] = useState(false)
  const [currentFavorite, setCurrentFavorite] = useState<{ value: string; label: string }>({
    value: gallery.Meta.GalleryPref?.FavoriteGroup || "",
    label: gallery.Meta.GalleryPref?.FavoriteGroup || DEFAULT_GROUP,
  })

  const { data, mutate } = useSWR(session?.serverToken, (token: string) =>
    fetchFavoriteGroups(token, true).then((r) => (r as Response).json())
  )

  let favoriteGroups: OptionsOrGroups<unknown, GroupBase<unknown>> = []
  if (data?.Data) {
    favoriteGroups = [{ value: "", label: DEFAULT_GROUP }, ...data.Data.map((f: string) => ({ value: f, label: f }))]
  }

  useEffect(() => {
    setFiles(gallery.Files)
  }, [gallery.Files])

  const handleFavoriteChange = async (group: { value: string; label: string }, isNew: boolean) => {
    if (session?.serverToken) {
      await updateFavoriteGroup(session?.serverToken, gallery.Meta.UUID, group.value)
      if (isNew) {
        mutate()
      }
      setCurrentFavorite(group)
    }
  }

  const shiftByOne = () => {
    if (isShift) {
      setFiles(files.slice(1))
      setIsShift(false)
    } else {
      setFiles(["/1x1.png", ...files])
      setIsShift(true)
    }
  }

  const viewer =
    files.length > 0 ? (
      <div className="pb-16">
        <h2 className="text-center mb-4 font-bold">{gallery.Meta.Title}</h2>
        <ComicViewer pages={files} switchingRatio={1} initialCurrentPage={page} />
      </div>
    ) : (
      <h3 className="text-center">No pages found</h3>
    )

  return (
    <>
      <Layout outerChildren={viewer} serverInfo={serverInfo} subtitle={gallery.Meta.Title}>
        <div className="w-full mb-16 pb-96">
          <div className="gallery-actions">
            <Button onClick={() => setShowThumbnails(!showThumbnails)} className="mr-4">
              Show pages
            </Button>
            <Button onClick={() => shiftByOne()}>Shift by one</Button>

            {data && (
              <CreatableSelect
                className="mx-4 inline-block"
                styles={customStyles}
                options={favoriteGroups}
                defaultValue={currentFavorite}
                value={currentFavorite}
                onChange={(e) => handleFavoriteChange(e as { value: string; label: string }, true)}
                onCreateOption={(e) => handleFavoriteChange({ value: e, label: e }, true)}
              />
            )}
          </div>

          {showThumbnails && (
            <div className="mt-4">
              <p className="inline-block mb-1">Go to a page by clicking it.</p>
              <div className="grid gap-2 thumbnails sm:thumbnails-sm lg:thumbnails-lg">
                {thumbnails.map((thumbnail, i) => (
                  <a key={i} href={`/g/${gallery.Meta.UUID}/${i}`}>
                    <Image
                      alt={`page ${i} thumbnail`}
                      src={thumbnail}
                      loading="lazy"
                      width={200}
                      height={300}
                      objectFit="cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
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

  const slugs = context.params?.slug
  if (!slugs || slugs.length === 0) {
    return { props: { serverInfo } }
  }

  const gallery: Gallery = await fetchGallery(slugs[0], session?.serverToken || session?.passphrase)
  if (!gallery) {
    return { notFound: true }
  }

  if (!gallery.Files) {
    gallery.Files = []
  }

  const thumbnails: string[] = []
  gallery.Files.forEach((file, i) => {
    thumbnails.push(getCacheUrl(`/thumbnails/${gallery.Meta.UUID}/${changeExtension(file, ".webp")}`))
    gallery.Files[i] = getCacheUrl(`/${gallery.Meta.UUID}/${file}`)
  })

  // let favorites
  // if (session?.serverToken) {
  //   favorites = await fetchFavoriteGroups(session?.serverToken, false)
  // }
  // favorites = favorites?.Data ? favorites : { Data: [], Count: 0 }

  return {
    props: {
      serverInfo,
      gallery,
      thumbnails,
      page: slugs.length > 1 ? clamp(parseInt(slugs[1]), 0, gallery.Count) : 0,
    },
  }
}
