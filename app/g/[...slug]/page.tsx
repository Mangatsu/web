import { Metadata } from "next"
import { APIPathsV1, fetchJSON, getCacheUrl } from "../../../lib/api/other"
import { changeExtension, clamp } from "../../../lib/helpers"
import { Gallery } from "../../../types/api"
import GalleryPage from "./gallery"

export const getGallery = async (slug: string) => {
  const slugs = slug
  if (!slugs || slugs.length === 0) {
    return null
  }

  const gallery: Gallery = await fetchJSON(`${APIPathsV1.Gallery}${slugs[0]}`)
  if (!gallery) {
    return null
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
    gallery,
    thumbnails,
    page: slugs.length > 1 ? clamp(parseInt(slugs[1]), 0, gallery.Count) : 0,
  }
}

export const metadata: Metadata = {
  title: "Mangatsu | gallery",
  description: "Gallery",
}

export default async function Page() {
  return <GalleryPage />
}
