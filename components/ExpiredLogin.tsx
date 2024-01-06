"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { initiateLogout } from "../lib/api/user"
import useUser from "../lib/hooks/data/useUser"
import { LocalPreferences, setValue } from "../lib/localStorage"

const ExpiredLogin = () => {
  const router = useRouter()
  const pathname = usePathname()
  // const { routeChanging } = useRouteChange()
  const { loggedIn } = useUser()

  useEffect(() => {
    // null or undefined would cause an infinite loop.
    if (loggedIn === false) {
      initiateLogout()
      setValue(LocalPreferences.Expires, undefined)
      setValue(LocalPreferences.Roles, undefined)
      setValue(LocalPreferences.UserUUID, undefined)

      if (pathname === "/" || pathname === "/login") {
        router.refresh()
      } else {
        router.push("/")
      }
    }
  }, [loggedIn, pathname, router])

  return null
}

export default ExpiredLogin
