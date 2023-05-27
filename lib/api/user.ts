import { MangatsuSession, MangatsuUser } from "../../types/api"
import { getApiUrl } from "./other"

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
 * Creates a new user.
 *
 * @param form
 * @returns promise of the JSON or null
 */
export async function newUser(form: UserForm) {
  try {
    const response = await fetch(getApiUrl("/register"), {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(form),
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Updates user.
 *
 * @param uuid
 * @param form
 * @returns promise of the JSON or null
 */
export async function updateUser(uuid: string, form: UserForm) {
  try {
    const response = await fetch(getApiUrl(`/users/${uuid}`), {
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

/**
 * Deletes a user. Admins cannot be deleted direclty.
 *
 * @param uuid user UUID
 * @returns if action was successful
 */
export async function deleteUser(uuid: string) {
  try {
    const response = await fetch(getApiUrl(`/users/${uuid}`), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Deletes a session. Only the owner of the session can delete it.
 * @param sessionID
 * @returns if action was successful
 */
export async function deleteSession(sessionID: string) {
  try {
    const response = await fetch(getApiUrl("/users/me/sessions"), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({ SessionID: sessionID }),
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Sends logout request to the API which removes the session token from the server which in turn invalidates the JWT.
 *
 * @returns true if successful
 */
export async function initiateLogout() {
  try {
    const response = await fetch(getApiUrl("/logout"), {
      method: "POST",
      credentials: "include",
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Returns user's favorite groups from the API.
 *
 * @returns promise of the response, JSON or null
 */
export async function fetchFavoriteGroups() {
  return fetch(getApiUrl("/users/me/favorites"), {
    mode: "cors",
    credentials: "include",
  })
}

/**
 * Sets gallery's favorite group for the requesting user.
 *
 * @param galleryUUID
 * @param groupName
 * @returns was the action successful
 */
export async function updateFavoriteGroup(galleryUUID: string, groupName: string) {
  try {
    const response = await fetch(getApiUrl(`/galleries/${galleryUUID}/favorite/${groupName}`), {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
    })
    return response.ok
  } catch {
    return false
  }
}
