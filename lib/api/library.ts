import { LibraryFilters } from "../../types/api"
import { getApiUrl, RESULT_LIMIT } from "./other"

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
  const requestUrl = constructGalleryQueryString("/galleries", filters)
  requestUrl.searchParams.append("limit", RESULT_LIMIT.toString())
  requestUrl.searchParams.append("offset", offset.toString())

  return fetch(requestUrl.toString(), {
    mode: "cors",
    credentials: "include",
  })
}

/**
 * Returns the count of galleries based on the specified filters.
 *
 * @param filters
 * @returns
 */
export async function fetchLibraryCount(filters?: LibraryFilters) {
  const requestUrl = constructGalleryQueryString("/galleries/count", filters)
  const response = await fetch(requestUrl.toString(), {
    mode: "cors",
    credentials: "include",
  })

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
  const requestUrl = new URL(getApiUrl("/galleries"))
  const headers = cookie ? { cookie: cookie } : undefined

  requestUrl.searchParams.append("series", series)

  return fetch(requestUrl.toString(), {
    mode: "cors",
    credentials: "include",
    headers: headers,
  })
}

/**
 * Returns all categories and, if logged in, user's favorite groups from the API.
 *
 * @returns promise of the JSON or null
 */
export async function fetchCategories() {
  return fetch(getApiUrl("/categories"), {
    mode: "cors",
    credentials: "include",
  })
}

/**
 * Returns requested gallery from the API.
 *
 * @param uuid if undefined, returns a random gallery
 * @param cookie
 * @returns promise of the JSON or null
 */
export async function fetchGallery(uuid: string, cookie?: string) {
  const headers = cookie ? { cookie: cookie } : undefined
  const response = await fetch(getApiUrl(`/galleries/${uuid}`), {
    mode: "cors",
    credentials: "include",
    headers: headers,
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Returns a random gallery.
 *
 * @returns promise of the JSON or null
 */
export async function fetchRandomGallery() {
  const response = await fetch(getApiUrl("/galleries/random"), {
    mode: "cors",
    credentials: "include",
  })

  return await response.json()
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
    const response = await fetch(getApiUrl(`/galleries/${uuid}`), {
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
