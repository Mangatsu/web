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
  const { access, expired } = useUser()

  useEffect(() => {
    // checking access against null or undefined would cause an infinite loop.
    if (expired === true && access === false) {
      initiateLogout()
      setValue(LocalPreferences.Expires, undefined)
      setValue(LocalPreferences.Roles, undefined)
      setValue(LocalPreferences.UserUUID, undefined)

      if (pathname === "/" || pathname === "/login") {
        window.location.reload()
      } else {
        window.location.assign("/")
      }
    }
  }, [access, expired, pathname, router])

  return null
}

export default ExpiredLogin
