import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"
import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import ComicViewer from "react-comic-viewer"
import { GroupBase, OptionsOrGroups, StylesConfig } from "react-select"
import CreatableSelect from "react-select/creatable"
import useSWR from "swr"
import Button from "../../components/Button"
import EditGallery from "../../components/EditGallery"
import ImageFallback from "../../components/ImageFallback"
import Layout from "../../components/Layout"
import { APIPathsV1, fetchJSON, getCacheUrl, swrFetcher } from "../../lib/api/other"
import { updateFavoriteGroup } from "../../lib/api/user"
import { changeExtension, clamp } from "../../lib/helpers"
import useUser from "../../lib/hooks/data/useUser"
import { Gallery } from "../../types/api"

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
}

export default function GalleryPage({ gallery, thumbnails, page }: Props) {
  const { loggedIn, anonymous, isAdmin } = useUser()

  const [files, setFiles] = useState<string[]>([])
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [isShift, setIsShift] = useState(false)

  const [currentFavorite, setCurrentFavorite] = useState<{ value: string; label: string }>({
    value: gallery?.Meta?.GalleryPref?.FavoriteGroup || "",
    label: gallery?.Meta?.GalleryPref?.FavoriteGroup || DEFAULT_GROUP,
  })

  const { data: galleryData, mutate: mutateGallery } = useSWR(
    loggedIn ? `${APIPathsV1.Gallery}${gallery.Meta.UUID}` : null,
    (key) => swrFetcher(key),
    { fallbackData: gallery }
  )

  const { data: favoritesData, mutate: mutateFavorites } = useSWR(anonymous ? null : APIPathsV1.Favorites, (key) =>
    swrFetcher(key)
  )

  let favoriteGroups: OptionsOrGroups<unknown, GroupBase<unknown>> = []
  if (favoritesData?.Data) {
    favoriteGroups = [
      { value: "", label: DEFAULT_GROUP },
      ...favoritesData.Data.map((f: string) => ({ value: f, label: f })),
    ]
  }

  useEffect(() => {
    if (gallery) {
      setFiles(gallery.Files)
    }
  }, [gallery, gallery?.Files])

  const handleFavoriteChange = async (group: { value: string; label: string }, isNew: boolean) => {
    if (loggedIn && !anonymous) {
      await updateFavoriteGroup(gallery.Meta.UUID, group.value)
      if (isNew) {
        mutateFavorites()
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
        <h2 className="text-center mb-4 font-bold">{gallery?.Meta?.Title ?? ""}</h2>
        <ComicViewer pages={files} switchingRatio={1} initialCurrentPage={page} />
      </div>
    ) : (
      <div className="pb-16">
        <h2 className="text-center mb-4 font-bold">{gallery?.Meta?.Title ?? ""}</h2>
        <div>
          <h3 className="text-center">Loading…</h3>
        </div>
      </div>
    )

  return (
    <Layout outerChildren={viewer} subtitle={gallery?.Meta?.Title ?? ""}>
      <div className="w-full mb-16 pb-96">
        <div className="flex gap-2">
          <Button
            onClick={() => setShowThumbnails(!showThumbnails)}
            title={`${showThumbnails ? "Hide" : "Show"} thumbnails`}
          >
            {showThumbnails ? (
              <EyeIcon className="h-5 w-5 text-zinc-100" />
            ) : (
              <EyeSlashIcon className="h-5 w-5 text-zinc-100" />
            )}
          </Button>
          <Button onClick={() => shiftByOne()} title="Shift pages by one">
            {isShift ? (
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-zinc-100" />
            ) : (
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-zinc-100" />
            )}
          </Button>
          {loggedIn && isAdmin && <EditGallery gallery={galleryData?.Meta || gallery.Meta} mutate={mutateGallery} />}
          {loggedIn && !anonymous && (
            <div className="grow">
              <CreatableSelect
                className="mx-4 max-w-md"
                styles={customStyles}
                options={favoriteGroups}
                defaultValue={currentFavorite}
                value={currentFavorite}
                onChange={(e) => handleFavoriteChange(e as { value: string; label: string }, true)}
                onCreateOption={(e) => handleFavoriteChange({ value: e, label: e }, true)}
              />
            </div>
          )}
        </div>

        {showThumbnails && (
          <div className="mt-4">
            <p className="inline-block mb-1">Go to a page by clicking it.</p>
            <div className="grid gap-2 thumbnails sm:thumbnails-sm lg:thumbnails-lg">
              {thumbnails.map((thumbnail, i) => (
                <a key={i} href={`/g/${gallery.Meta.UUID}/${i}`}>
                  <ImageFallback
                    text={i + 1}
                    alt={`page ${i + 1}`}
                    src={thumbnail}
                    loading="lazy"
                    width={200}
                    height={300}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugs = context.params?.slug
  if (!slugs || slugs.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const gallery: Gallery = await fetchJSON(`${APIPathsV1.Gallery}${slugs[0]}`, context.req.headers.cookie)
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

  return {
    props: {
      gallery,
      thumbnails,
      page: slugs.length > 1 ? clamp(parseInt(slugs[1]), 0, gallery.Count) : 0,
    },
  }
}
