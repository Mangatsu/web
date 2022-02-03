import { MangatsuSession, MangatsuUser } from "../../types/api"
import { getApiUrl, StringResponse } from "./other"

export interface UserForm {
  username?: string
  password?: string
  role?: number
}

export interface MangatsuUserResponse {
  Data: MangatsuUser[]
  Count: number
}

export interface MangatsuSessionResponse {
  Data: MangatsuSession[]
  Count: number
}

/**
 * Returns users from the API. Used with SWR.
 *
 * @param token JWT
 * @returns promise of the response
 */
export async function fetchUsers(token: string) {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  return await fetch(getApiUrl("/users"), {
    mode: "cors",
    headers: { ...authHeader },
  })
}

/**
 * Creates a new user.
 *
 * @param token JWT
 * @param form
 * @returns promise of the JSON or null
 */
export async function newUser(token: string, form: UserForm) {
  const response = await fetch(getApiUrl("/register"), {
    method: "POST",
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(form),
  })

  return response.ok
}

/**
 * Updates a new user.
 *
 * @param token JWT
 * @param form
 * @returns promise of the JSON or null
 */
export async function updateUser(token: string, uuid: string, form: UserForm) {
  const response = await fetch(getApiUrl(`/users/${uuid}`), {
    method: "PUT",
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(form),
  })

  return response.ok
}

/**
 * Deletes a user. Admins cannot be deleted direclty.
 *
 * @param token JWT
 * @param uuid user UUID
 * @returns if action was successful
 */
export async function deleteUser(token: string, uuid: string) {
  const response = await fetch(getApiUrl(`/users/${uuid}`), {
    method: "DELETE",
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.ok
}

/**
 * Returns user's sessions from the API. Used with SWR.
 *
 * @param token JWT
 * @returns promise of the response
 */
export async function fetchSessions(token: string) {
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined
  return await fetch(getApiUrl("/users/me/sessions"), {
    mode: "cors",
    headers: { ...authHeader },
  })
}

/**
 * Deletes a session. Only the owner of the session can delete it.
 * @param token JWT
 * @param sessionID
 * @returns if action was successful
 */
export async function deleteSession(token: string, sessionID: string) {
  const response = await fetch(getApiUrl("/users/me/sessions"), {
    method: "DELETE",
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ SessionID: sessionID }),
  })

  return response.ok
}

/**
 * Sends logout request to the API which removes the session token from the server which in turn invalidates the JWT.
 *
 * @param token JWT
 * @returns true if successful
 */
export async function initiateLogout(token: string) {
  const response = await fetch(getApiUrl("/logout"), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.ok
}

/**
 * Returns all favorite groups of the user from the API.
 *
 * @param token JWT
 * @param swr if true, returns the whole response for SWR
 * @returns promise of the response, JSON or null
 */
export async function fetchFavoriteGroups(token: string, swr: boolean) {
  const response = await fetch(getApiUrl("/users/me/favorites"), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (swr) {
    return response
  }

  if (!response.ok) {
    return null
  }

  return (await response.json()) as StringResponse
}

/**
 * Sets gallery's favorite group for the requesting user.
 *
 * @param token JWT
 * @param galleryUUID
 * @param groupName
 * @returns was the action successful
 */
export async function updateFavoriteGroup(token: string, galleryUUID: string, groupName: string) {
  const response = await fetch(getApiUrl(`/galleries/${galleryUUID}/favorite/${groupName}`), {
    method: "PATCH",
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.ok
}
