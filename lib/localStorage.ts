export enum LocalPreferences {
  LoggedIn = "mtsu_logged_in",
  Roles = "mtsu_roles",
  UserUUID = "mtsu_user_uuid",
  NSFWPref = "mtsu_nsfw_pref",
  LanguagePref = "mtsu_language_pref",
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
