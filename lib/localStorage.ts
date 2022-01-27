export enum LocalPreferences {
  NSFWPref = "mtsu_nsfw_pref",
}

export function getValue(key: string) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch {
    return undefined
  }
}

export function setValue(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(e)
  }
}
