import { useEffect, useState } from "react"
import { Visibility } from "../../../types/api"
import { Role } from "../../helpers"
import { LocalPreferences, getValue } from "../../localStorage"

export interface UserPreferences {
  NSFW: boolean
  Language: boolean
  SeriesRandom: boolean
}

export default function useUser() {
  const [loading, setLoading] = useState(true)

  const [access, setAccess] = useState(false)
  const [expired, setExpired] = useState<boolean | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [uuid, setUUID] = useState<string | null>(null)
  const [role, setRole] = useState(0)

  const [preferences, setPreferences] = useState({
    NSFW: false,
    Language: false,
    SeriesRandom: false,
  })

  useEffect(() => {
    const visibilityOrNull = getValue(LocalPreferences.ServerVisibility)
    let visibility = Visibility.Private
    if (visibilityOrNull && [Visibility.Public, Visibility.Private, Visibility.Restricted].includes(visibilityOrNull)) {
      visibility = visibilityOrNull
    }

    const uuidLocal = getValue(LocalPreferences.UserUUID)
    setUUID(uuidLocal)

    const roleLocal = getValue(LocalPreferences.Roles)
    setRole(roleLocal)

    let expiredLocal: boolean
    const expires = getValue(LocalPreferences.Expires)
    if (isNaN(expires)) {
      expiredLocal = true
      setExpired(null)
    } else {
      expiredLocal = expires < Date.now()
      setExpired(expiredLocal)
    }

    setPreferences({
      NSFW: getValue(LocalPreferences.NSFWPref),
      Language: getValue(LocalPreferences.LanguagePref),
      SeriesRandom: getValue(LocalPreferences.SeriesRandomPref),
    })

    if (!loading) {
      return
    }

    if (expiredLocal) {
      setAccess(visibility === Visibility.Public) // if public, allow basic access
      setIsUser(false)
      setIsAdmin(false)
      setLoading(false)
      return
    }

    if (uuidLocal) {
      setAccess(true)
      setIsUser(true)

      if (roleLocal >= Role.Admin) {
        setIsAdmin(true)
      }
    } else if (visibility === Visibility.Restricted) {
      setAccess(true)
      setIsAnonymous(true)
    } else {
      setAccess(false)
    }

    setLoading(false)
  }, [expired, loading, role, uuid])

  return {
    loading,
    expired,
    access,
    uuid,
    role,
    isAnonymous,
    isUser,
    isAdmin,
    preferences,
    setPreferences,
  }
}
