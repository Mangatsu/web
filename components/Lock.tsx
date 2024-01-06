import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { initiateLogout } from "../lib/api/user"
import useUser from "../lib/hooks/data/useUser"
import { LocalPreferences, setValue } from "../lib/localStorage"
import Button from "./Button"

const Lock = () => {
  const router = useRouter()
  const pathname = usePathname()
  const logoutHandler = () => {
    initiateLogout()
    setValue(LocalPreferences.Expires, undefined)
    setValue(LocalPreferences.Roles, undefined)
    setValue(LocalPreferences.UserUUID, undefined)

    if (pathname === "/") {
      router.refresh()
    } else {
      router.push("/")
    }
  }

  const { loggedIn } = useUser()
  return (
    <>
      {false ? (
        <Link href="#" passHref>
          <button disabled className="m-4 bg-blue-600 text-white opacity-50 cursor-not-allowed">
            Loading…
          </button>
        </Link>
      ) : loggedIn ? (
        <Button onClick={() => logoutHandler()} className="mt-3 mx-4">
          Logout
        </Button>
      ) : (
        <Button href="/login" className="mt-3 mx-4">
          Login
        </Button>
      )}
    </>
  )
}

export default Lock
