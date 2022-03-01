import { getApiUrl } from "./other"

/**
 * Initiates a new gallery scan.
 *
 * @param token JWT
 * @param full full scan
 * @returns promise of the JSON or null
 */
export async function initiateScan(token: string, full: boolean) {
  const requestUrl = new URL(getApiUrl("/scan"))
  if (full) {
    requestUrl.searchParams.append("full", "true")
  }

  const response = await fetch(requestUrl.toString(), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Initiates a new task to generate metadata for every gallery.
 *
 * @param token JWT
 * @param x parse X formatted JSON files
 * @param title parse titles
 * @returns promise of the JSON or null
 */
export async function initiateMetadataGen(token: string) {
  const requestUrl = new URL(getApiUrl("/meta"))
  requestUrl.searchParams.append("title", "true")
  requestUrl.searchParams.append("x", "true")
  requestUrl.searchParams.append("hath", "true")
  requestUrl.searchParams.append("ehdl", "true")

  const response = await fetch(requestUrl.toString(), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    return null
  }

  return await response.json()
}

/**
 * Initiates a new task to generate thumbnails.
 *
 * @param token JWT
 * @param force rewrite already existing thumbnails
 * @param pages also generate thumbnails for pages, not only covers
 * @returns promise of the JSON or null
 */
export async function initiateThumbnailGen(token: string, force: boolean, pages: boolean) {
  const requestUrl = new URL(getApiUrl("/thumbnails"))
  if (force) requestUrl.searchParams.append("force", "true")
  if (pages) requestUrl.searchParams.append("pages", "true")

  const response = await fetch(requestUrl.toString(), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}
