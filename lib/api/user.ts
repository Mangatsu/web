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
 * Creates a new user.
 *
 * @param token JWT
 * @param form
 * @returns promise of the JSON or null
 */
export async function newUser(token: string, form: UserForm) {
  try {
    const response = await fetch(getApiUrl("/register"), {
      method: "POST",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
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
 * @param token JWT
 * @param uuid
 * @param form
 * @returns promise of the JSON or null
 */
export async function updateUser(token: string, uuid: string, form: UserForm) {
  try {
    const response = await fetch(getApiUrl(`/users/${uuid}`), {
      method: "PUT",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
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
 * @param token JWT
 * @param uuid user UUID
 * @returns if action was successful
 */
export async function deleteUser(token: string, uuid: string) {
  try {
    const response = await fetch(getApiUrl(`/users/${uuid}`), {
      method: "DELETE",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Deletes a session. Only the owner of the session can delete it.
 * @param token JWT
 * @param sessionID
 * @returns if action was successful
 */
export async function deleteSession(token: string, sessionID: string) {
  try {
    const response = await fetch(getApiUrl("/users/me/sessions"), {
      method: "DELETE",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
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
 * @param token JWT
 * @returns true if successful
 */
export async function initiateLogout(token: string) {
  try {
    const response = await fetch(getApiUrl("/logout"), {
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Returns all favorite groups of the user from the API.
 *
 * @param token JWT
 * @returns promise of the response, JSON or null
 */
export async function fetchFavoriteGroups(token: string) {
  try {
    const response = await fetch(getApiUrl("/users/me/favorites"), {
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as StringResponse
  } catch {
    return null
  }
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
  try {
    const response = await fetch(getApiUrl(`/galleries/${galleryUUID}/favorite/${groupName}`), {
      method: "PATCH",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.ok
  } catch {
    return false
  }
}
