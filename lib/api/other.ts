export interface StringResponse {
  Data: string[]
  Count: number
}

export const RESULT_LIMIT = 50

/**
 * Returns the API URL with specified path.
 *
 * @param path
 * @returns API URL as string
 */
export function getApiUrl(path = "") {
  return `${process.env.NEXT_PUBLIC_MANGATSU_API_URL || "http://localhost:5050"}/api/v1${path}`
}

/**
 * Returns the cache URL with specified path.
 *
 * @param path
 * @returns API URL as string
 */
export function getCacheUrl(path = "") {
  return `${process.env.NEXT_PUBLIC_MANGATSU_API_URL || "http://localhost:5050"}/cache${path}`
}

/**
 * Helper to make GET requests to the API
 *
 * @param path
 * @returns data response as json
 */
export async function fetchApi(path: string) {
  const response = await fetch(getApiUrl(path))
  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Returns information about server such as version, visibility, API version.
 *
 * @returns JSON promise
 */
export async function fetchServerInfo() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MANGATSU_API_URL || "http://localhost:5050"}/api`)
  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * SWR fetch function.
 *
 * @param path
 * @param token
 * @returns Response
 */
export async function swrFetch(path: string, token?: string) {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  const response = await fetch(getApiUrl(path), {
    mode: "cors",
    headers: { ...authHeader },
  })

  return await response.json()
}
