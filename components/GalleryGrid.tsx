import Image from "next/image"
import Link from "next/link"
import { getCacheUrl } from "../lib/api/other"
import { Base64Placeholder } from "../lib/helpers"
import placeholderCover from "../public/placeholder-fade.png"
import { GalleryMeta, OrderedMap } from "../types/api"
import { LibraryLayout } from "./Filters/LayoutSelect"

export interface GalleriesResult {
  Data: GalleryMeta[] | OrderedMap<GalleryMeta>
  Count: number
  TotalCount: number
}

interface GalleryProps {
  galleries: GalleriesResult[]
  layout: LibraryLayout
  nativeTitles: boolean
}

const GalleryGrid = ({ galleries, layout, nativeTitles }: GalleryProps) => {
  return (
    <div className="masonry sm:masonry-sm place-content-center">
      {galleries.map((result) => {
        if (!result?.Data) {
          return null
        }

        if (Array.isArray(result.Data)) {
          return (result.Data as GalleryMeta[]).map((gallery: GalleryMeta) => (
            <div key={gallery.UUID} className="relative mr-3 bg-cyan-700 rounded mb-3">
              {layout === LibraryLayout.Detailed && (
                <div className="table w-full text-white text-sm p-1 h-12">
                  <div
                    style={{
                      verticalAlign: "middle",
                      display: "table-cell",
                      textAlign: "center",
                    }}
                  >
                    {(nativeTitles ? gallery.TitleNative : gallery.TitleTranslated) || gallery.Title}
                  </div>
                </div>
              )}
              <Link
                href={`g/${gallery.UUID}`}
                className="grid place-content-center bg-gray-800 bg-clip-padding rounded"
              >
                <Image
                  alt="cover image"
                  src={
                    gallery.Thumbnail
                      ? getCacheUrl(`/thumbnails/${gallery.UUID}/${gallery.Thumbnail}`)
                      : placeholderCover
                  }
                  className="w-full text-center rounded"
                  width={200}
                  height={300}
                  loading="lazy"
                />
              </Link>
            </div>
          ))
        }

        const galleryOrderedMap = result.Data
        return galleryOrderedMap.Keys.map((k, i) => {
          const g = galleryOrderedMap.Map[k]
          const subGalleryCount = g.SubGalleryCount ?? 0
          return (
            <div key={i} className="relative">
              <Link
                href={subGalleryCount > 0 ? `series/${g.Series}` : `g/${g.UUID}`}
                key={g.UUID}
                className="grid place-content-center mb-3 mr-3 bg-gray-800 bg-clip-padding rounded"
              >
                <Image
                  alt="cover image"
                  src={g.Thumbnail ? getCacheUrl(`/thumbnails/${g.UUID}/${g.Thumbnail}`) : placeholderCover}
                  className="w-full rounded text-center"
                  width={200}
                  height={300}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={Base64Placeholder}
                />
              </Link>
              {subGalleryCount > 0 && (
                <div
                  style={{ margin: "-50px 0 0 15px" }}
                  className="absolute bg-slate-900 opacity-75 text-white text-center p-2 leading-3 rounded-full"
                >
                  {subGalleryCount}
                </div>
              )}
            </div>
          )
        })
      })}
    </div>
  )
}

export default GalleryGrid
