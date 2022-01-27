import { LibraryFilters } from "../../types"
import { getApiUrl, RESULT_LIMIT, StringResponse } from "./other"

/**
 * Returns the library (50 galleries per request) based on the specified filters and offset. Used with SWR.
 *
 * @param path
 * @param offset offset to start the request at
 * @param params
 * @param token JWT
 * @returns promise of the response
 */
export async function fetchLibrary(url: string, offset: number, filters?: LibraryFilters, token?: string) {
  const requestUrl = new URL(`${url}/galleries`)
  requestUrl.searchParams.append("limit", RESULT_LIMIT.toString())
  requestUrl.searchParams.append("offset", offset.toString())

  if (filters?.searchTerm) requestUrl.searchParams.append("search", filters.searchTerm)
  if (filters?.nsfwHidden) requestUrl.searchParams.append("nsfw", "false")
  if (filters?.order) requestUrl.searchParams.append("order", filters.order)
  if (filters?.sortBy) requestUrl.searchParams.append("sortby", filters.sortBy)
  if (filters?.category) requestUrl.searchParams.append("category", filters.category)
  if (filters?.favoriteGroup) requestUrl.searchParams.append("favorite", filters.favoriteGroup)

  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  return fetch(requestUrl.toString(), {
    mode: "cors",
    headers: { ...authHeader },
  })
}

/**
 * Returns all categories from the API.  Returns all categories and, if logged in, user's favorite groups fron the API.
 *
 * @param token JWT
 * @returns promise of the JSON or null
 */
export async function fetchCategories(token?: string): Promise<StringResponse | null> {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  const response = await fetch(getApiUrl("/categories"), {
    mode: "cors",
    headers: { ...authHeader },
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as StringResponse
}

/**
 * Returns requested gallery from the API.
 *
 * @param token JWT
 * @returns promise of the JSON or null
 */
export async function fetchGallery(uuid: string, token?: string | null) {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  const response = await fetch(getApiUrl(`/galleries/${uuid}`), {
    mode: "cors",
    headers: { ...authHeader },
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}
