"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import useSWRInfinite from "swr/infinite"
import Filters from "../components/Filters"
import { LibraryLayout } from "../components/Filters/LayoutSelect"
import { fetchLibrary } from "../lib/api/library"
import { RESULT_LIMIT, getCacheUrl } from "../lib/api/other"
import { Base64Placeholder } from "../lib/helpers"
import useCategories from "../lib/hooks/data/useCategories"
import useFavorites from "../lib/hooks/data/useFavorites"
import useDebounce from "../lib/hooks/useDebounce"
import { LocalPreferences, getValue } from "../lib/localStorage"
import placeholderCover from "../public/placeholder-fade.png"
import { GalleryMeta, LibraryFilters } from "../types/api"

interface GalleriesResult {
  Data: GalleryMeta[] | Record<string, GalleryMeta[]>
  Count: number
}

type FetcherKey = [number, LibraryFilters] // offset, query
const gFetcher = (key: FetcherKey) => fetchLibrary(...key)

export default function Library() {
  const [query, setQuery] = useState<LibraryFilters>({ nsfwHidden: getValue(LocalPreferences.NSFWPref) })
  const [grouped, setGrouped] = useState(false)
  const debouncedFilters = useDebounce(query, 100)

  const [layout, setLayout] = useState(LibraryLayout.Thumbnail)
  const nativeTitles = getValue(LocalPreferences.LanguagePref)

  const { categories } = useCategories()
  const { favorites } = useFavorites()

  const getGKey = (pageIndex: number, previousPageData: unknown[]) => {
    if (previousPageData && previousPageData.length === 0) return null
    return [pageIndex * RESULT_LIMIT, debouncedFilters]
  }

  const {
    data: gData,
    size: gSize,
    setSize: setGSize,
  } = useSWRInfinite(getGKey, gFetcher, {
    keepPreviousData: true,
  })

  // This should actually be called "mightHaveMore", as in rare cases the data ends exactly on the offset
  // which results one extra request being made. (results % offset === 0)
  const hasMoreGalleries = gData && gData[gData.length - 1]?.Count === RESULT_LIMIT

  // TODO: Grid masonry when major browsers support it (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)
  return (
    <>
      <Filters
        query={query}
        setQuery={setQuery}
        grouped={grouped}
        setGrouped={setGrouped}
        categories={categories}
        favorites={favorites}
        setLayout={setLayout}
      />

      <div className="masonry sm:masonry-sm place-content-center">
        {gData &&
          gData.map((result: GalleriesResult) => {
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
                    href={`g?id=${gallery.UUID}`}
                    as={`g/${gallery.UUID}`}
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

            const galleryMap = result.Data as Record<string, GalleryMeta[]>
            return Object.keys(galleryMap).map((k, i) => {
              const g = galleryMap[k]
              return (
                <div key={i} className="relative">
                  <Link
                    href={g.length > 1 ? `series/${g[0].Series}` : `g/${g[0].UUID}`}
                    key={g[0].UUID}
                    className="grid place-content-center mb-3 mr-3 bg-gray-800 bg-clip-padding rounded"
                  >
                    <Image
                      alt="cover image"
                      src={
                        g[0].Thumbnail ? getCacheUrl(`/thumbnails/${g[0].UUID}/${g[0].Thumbnail}`) : placeholderCover
                      }
                      className="w-full rounded text-center"
                      width={200}
                      height={300}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={Base64Placeholder}
                    />
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
      {hasMoreGalleries && (
        <button className="mb-8 bg-slate-600 w-1/2 mx-auto" onClick={() => setGSize(gSize + 1)}>
          Load More
        </button>
      )}
    </>
  )
}
