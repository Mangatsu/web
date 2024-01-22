import { usePathname } from "next/navigation"
import { initiateLogout } from "../lib/api/user"
import useUser from "../lib/hooks/data/useUser"
import { LocalPreferences, setValue } from "../lib/localStorage"
import Button from "./Button"

const Lock = () => {
  const pathname = usePathname()
  const { loading, access, isUser, isAnonymous } = useUser()

  const logoutHandler = () => {
    initiateLogout()
    setValue(LocalPreferences.Expires, undefined)
    setValue(LocalPreferences.Roles, undefined)
    setValue(LocalPreferences.UserUUID, undefined)

    if (pathname === "/") {
      window.location.reload()
    } else {
      window.location.assign("/")
    }
  }

  if (loading) {
    return (
      <Button disabled className="bg-blue-600 text-white opacity-50 cursor-not-allowed">
        Loading…
      </Button>
    )
  }

  return (
    <>
      {access && (isUser || isAnonymous) ? (
        <Button onClick={() => logoutHandler()}>Logout</Button>
      ) : (
        <Button href="/login">Login</Button>
      )}
    </>
  )
}

export default Lock
