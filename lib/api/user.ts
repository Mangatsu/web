import { getApiUrl, StringResponse } from "./other"

export interface UserForm {
  username?: string
  password?: string
  role?: number
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
 * @returns promise of the JSON or null
 */
export async function fetchFavoriteGroups(token: string): Promise<StringResponse | null> {
  const response = await fetch(getApiUrl("/users/me/favorites"), {
    mode: "cors",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as StringResponse
}