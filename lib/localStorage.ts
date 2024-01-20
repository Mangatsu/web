export enum LocalPreferences {
  ServerVisibility = "mtsu_server_visibility",
  Roles = "mtsu_roles",
  Expires = "mtsu_expires",
  UserUUID = "mtsu_user_uuid",
  NSFWPref = "mtsu_nsfw_pref",
  LanguagePref = "mtsu_language_pref",
  SeriesRandomPref = "mtsu_series_random_pref",
}

export function getValue(key: LocalPreferences) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch {
    return undefined
  }
}

export function setValue(key: LocalPreferences, value: unknown) {
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (e) {
    console.error(e)
  }
}
