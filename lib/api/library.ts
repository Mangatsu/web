import { LibraryFilters } from "../../types/api"
import { APIPathsV1, fetchJSON, fetchResponse, getApiUrl, RESULT_LIMIT } from "./other"

export interface GalleryForm {
  title?: string
}

/**
 * Constructs the query string from the filters.
 *
 * @param url
 * @param filters
 * @returns URL query string
 */
function constructGalleryQueryString(url: string, filters?: LibraryFilters) {
  const requestUrl = new URL(getApiUrl(url))
  if (!filters) {
    return requestUrl
  }

  if (filters.searchTerm) requestUrl.searchParams.append("search", filters.searchTerm)
  if (filters.nsfwHidden) requestUrl.searchParams.append("nsfw", "false")
  if (filters.order) requestUrl.searchParams.append("order", filters.order)
  if (filters.sortBy) requestUrl.searchParams.append("sortby", filters.sortBy)
  if (filters.category) requestUrl.searchParams.append("category", filters.category)
  if (filters.favoriteGroup) requestUrl.searchParams.append("favorite", filters.favoriteGroup)
  if (filters.grouped) requestUrl.searchParams.append("grouped", "true")
  if (filters.seed) requestUrl.searchParams.append("seed", filters.seed.toString())

  return requestUrl
}

/**
 * Returns the library (50 galleries per request) based on the specified filters and offset. Used with SWR.
 *
 * @param offset offset to start the request at
 * @param filters
 * @returns promise of the response
 */
export async function fetchLibrary(offset: number, filters?: LibraryFilters) {
  const requestUrl = constructGalleryQueryString(APIPathsV1.Galleries, filters)
  requestUrl.searchParams.append("limit", RESULT_LIMIT.toString())
  requestUrl.searchParams.append("offset", offset.toString())

  return fetchJSON(requestUrl.toString(), undefined, false)
}

/**
 * Returns the count of galleries based on the specified filters.
 *
 * @param filters
 * @returns
 */
export async function fetchLibraryCount(filters?: LibraryFilters) {
  const requestUrl = constructGalleryQueryString(APIPathsV1.GalleriesCount, filters)
  const response = await fetchResponse(requestUrl.toString())

  if (!response.ok) {
    return 0
  }

  const data = await response.json()
  return data.Count
}

/**
 * Returns galleries in the specified series.
 *
 * @param series
 * @returns promise of the response
 */
export async function fetchSeries(series: string, cookie?: string) {
  const requestUrl = new URL(getApiUrl(APIPathsV1.Galleries))
  requestUrl.searchParams.append("series", series)

  return fetchJSON(requestUrl.toString(), cookie, false)
}

/**
 * Updates gallery metadata and/or tags.
 *
 * @param uuid
 * @param form
 * @returns promise of the JSON or null
 */
export async function updateGallery(uuid: string, form: GalleryForm) {
  try {
    const response = await fetch(getApiUrl(`${APIPathsV1.Gallery}${uuid}`), {
      method: "PUT",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(form),
    })
    return response.ok
  } catch {
    return false
  }
}
