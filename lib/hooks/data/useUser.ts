import { useEffect, useState } from "react"
import { Role } from "../../helpers"
import { LocalPreferences, getValue } from "../../localStorage"

export default function useUser() {
  const [uuid, setUUID] = useState<string | null>(null)
  const [role, setRole] = useState(0)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    setUUID(getValue(LocalPreferences.UserUUID))
    setRole(getValue(LocalPreferences.Roles))
    const expires = getValue(LocalPreferences.Expires)
    if (isNaN(expires)) {
      setLoggedIn(null)
    } else {
      setLoggedIn(expires > Date.now())
    }
  }, [])

  const anonymous = loggedIn && !!uuid
  const isAdmin = !!uuid && role >= Role.Admin

  return {
    loggedIn,
    anonymous,
    uuid,
    role,
    isAdmin,
  }
}
