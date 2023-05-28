export enum APIPathsV1 {
  Register = "register",
  Login = "login",
  Logout = "logout",
  Statistics = "statistics",
  Galleries = "galleries",
  Gallery = "galleries/",
  RandomGallery = "galleries/random",
  GalleriesCount = "galleries/count",
  Categories = "categories",
  Series = "series",
  Tags = "tags",
  Users = "users",
  User = "user/",
  Favorites = "users/me/favorites",
  Sessions = "users/me/sessions",
  Scan = "scan",
  Thumbnails = "thumbnails",
  Meta = "meta",
}

const API_VERSION = 1
const CACHE_PATH = "/cache" as const
export const RESULT_LIMIT = 50

const API_URL = process.env.NEXT_PUBLIC_MANGATSU_API_URL || "http://localhost:5050"

/**
 * Returns the API URL with specified path.
 *
 * @param path
 * @returns API URL as string
 */
export function getApiUrl(path: APIPathsV1 | string) {
  return `${API_URL}/api/v${API_VERSION}/${path}`
}

/**
 * Returns the cache URL with specified path.
 *
 * @param path
 * @returns API URL as string
 */
export function getCacheUrl(path = "") {
  return `${API_URL}${CACHE_PATH}${path}`
}

/**
 * Returns server info as JSON or null on error.
 *
 * @returns promise of the JSON or null
 */
export async function fetchServerInfo() {
  const response = await fetch(`${API_URL}/api`, { mode: "cors" })
  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Fetches response from the API.
 *
 * @param path API
 * @param cookie JWT
 * @returns promise of the JSON or null
 */
export function fetchResponse(path: string, cookie?: string, constructURL = true) {
  const init: RequestInit = cookie
    ? {
        mode: "cors",
        credentials: "include",
        headers: { cookie: cookie },
      }
    : {
        mode: "cors",
        credentials: "include",
      }

  if (constructURL) {
    return fetch(getApiUrl(path), init)
  }

  return fetch(path, init)
}

/**
 * Returns JSON body of the response, or null if response is not ok.
 * @param path API
 * @param cookie JWT
 * @returns promise of the JSON or null
 */
export async function fetchJSON(path: string, cookie?: string) {
  const response = await fetchResponse(path, cookie)
  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Returns JSON body of the response. For SWR use.
 *
 * @param path API
 * @param cookie JWT
 * @returns promise of the JSON or null
 */
export async function swrFetcher(path: string, cookie?: string) {
  const response = await fetchResponse(path, cookie)
  return await response.json()
}
