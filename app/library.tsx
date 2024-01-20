"use client"
import { useState } from "react"
import useSWRInfinite from "swr/infinite"
import Filters from "../components/Filters"
import { LibraryLayout } from "../components/Filters/LayoutSelect"
import GalleryGrid, { GalleriesResult } from "../components/GalleryGrid"
import withAuth from "../components/HOC/WithAuth"
import { fetchLibrary } from "../lib/api/library"
import { RESULT_LIMIT } from "../lib/api/other"
import { Role } from "../lib/helpers"
import useCategories from "../lib/hooks/data/useCategories"
import useFavorites from "../lib/hooks/data/useFavorites"
import useDebounce from "../lib/hooks/useDebounce"
import { LocalPreferences, getValue } from "../lib/localStorage"
import { LibraryFilters } from "../types/api"

type FetcherKey = [number, LibraryFilters] // offset, query
const gFetcher = (key: FetcherKey) => fetchLibrary(...key)

function Library() {
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
  } = useSWRInfinite<GalleriesResult>(getGKey, gFetcher, {
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
      {gData && gData.length > 0 && gData[0].Count > 0 ? (
        <GalleryGrid galleries={gData} layout={layout} nativeTitles={nativeTitles} />
      ) : (
        <div className="flex items-center justify-center text-2xl text-slate-200">No galleries found</div>
      )}
      {hasMoreGalleries && (
        <button className="mb-8 bg-slate-600 w-1/2 mx-auto" onClick={() => setGSize(gSize + 1)}>
          Load More
        </button>
      )}
    </>
  )
}

export default withAuth(Library, false, Role.NoRole)
