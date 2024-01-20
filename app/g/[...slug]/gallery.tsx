"use client"
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ComicViewer from "react-comic-viewer"
import { GroupBase, OptionsOrGroups, StylesConfig } from "react-select"
import CreatableSelect from "react-select/creatable"
import useSWR, { Fetcher } from "swr"
import Button from "../../../components/Button"
import EditGallery from "../../../components/EditGallery"
import Spinner from "../../../components/Spinner"
import Thumbnails from "../../../components/Thumbnails"
import { APIPathsV1, getCacheUrl, swrFetcher } from "../../../lib/api/other"
import { updateFavoriteGroup } from "../../../lib/api/user"
import { changeExtension } from "../../../lib/helpers"
import useUser from "../../../lib/hooks/data/useUser"
import { Gallery } from "../../../types/api"

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

const fetcher: Fetcher<Gallery, string> = (id) => swrFetcher(id)

export default function GalleryPage() {
  const params = useParams()
  let galleryUUID = null
  let page: number = 1
  if (params?.slug && Array.isArray(params.slug) && params.slug.length > 0) {
    galleryUUID = params.slug[0]
    page = params.slug.length > 1 ? (params.slug[1] as unknown as number) : page
  }

  const { loggedIn, anonymous, isAdmin } = useUser()

  const [files, setFiles] = useState<string[]>([])
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [isShift, setIsShift] = useState(false)

  const { data: gallery, mutate: mutateGallery } = useSWR(
    loggedIn ? `${APIPathsV1.Gallery}${galleryUUID}` : null,
    fetcher,
  )

  const [currentFavorite, setCurrentFavorite] = useState<{ value: string; label: string }>({
    value: gallery?.Meta?.GalleryPref?.FavoriteGroup || "",
    label: gallery?.Meta?.GalleryPref?.FavoriteGroup || DEFAULT_GROUP,
  })

  const {
    data: favoritesData,
    mutate: mutateFavorites,
    isLoading,
  } = useSWR(anonymous ? null : APIPathsV1.Favorites, (key) => swrFetcher(key))

  let favoriteGroups: OptionsOrGroups<unknown, GroupBase<unknown>> = []
  if (favoritesData?.Data) {
    favoriteGroups = [
      { value: "", label: DEFAULT_GROUP },
      ...favoritesData.Data.map((f: string) => ({ value: f, label: f })),
    ]
  }

  useEffect(() => {
    if (gallery?.Files) {
      const tmpFiles = []
      const tmpThumbnails = []
      gallery.Files.forEach((file) => {
        tmpFiles.push(getCacheUrl(`/${gallery.Meta.UUID}/${file}`))
        tmpThumbnails.push(getCacheUrl(`/thumbnails/${gallery.Meta.UUID}/${changeExtension(file, ".webp")}`))
      })
      setFiles(gallery.Files.map((file) => getCacheUrl(`/${gallery.Meta.UUID}/${file}`)))
      setThumbnails(gallery.Files.map((file) => getCacheUrl(`/${gallery.Meta.UUID}/${file}`)))
    }
  }, [gallery, gallery?.Files])

  const handleFavoriteChange = async (group: { value: string; label: string }, isNew: boolean) => {
    if (loggedIn && !anonymous && gallery) {
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

  if (isLoading || !gallery?.Meta) {
    return <Spinner />
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

  // TODO: outerChildren={viewer} subtitle={gallery?.Meta?.Title ?? ""}
  return (
    <>
      {viewer}
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
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-zinc-100" />
            ) : (
              <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-zinc-100" />
            )}
          </Button>
          {loggedIn && isAdmin && <EditGallery gallery={gallery.Meta} mutate={mutateGallery} />}
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
            <Thumbnails uuid={gallery.Meta.UUID} thumbnails={thumbnails} />
          </div>
        )}
      </div>
    </>
  )
}
