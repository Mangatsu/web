import { useRouter } from "next/router"
import { useEffect } from "react"
import { initiateLogout } from "../lib/api/user"
import useUser from "../lib/hooks/data/useUser"
import useRouteChange from "../lib/hooks/useRouteChange"
import { LocalPreferences, setValue } from "../lib/localStorage"

const ExpiredLogin = () => {
  const router = useRouter()
  const { routeChanging } = useRouteChange()
  const { loggedIn } = useUser()

  useEffect(() => {
    // null or undefined would cause an infinite loop.
    if (loggedIn === false) {
      initiateLogout()
      setValue(LocalPreferences.Expires, undefined)
      setValue(LocalPreferences.Roles, undefined)
      setValue(LocalPreferences.UserUUID, undefined)

      if (router.pathname === "/" || router.pathname === "/login") {
        router.reload()
      } else {
        router.push("/")
      }
    }
  }, [loggedIn, routeChanging, router])

  return null
}

export default ExpiredLogin
