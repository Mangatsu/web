import { Session } from "next-auth"
import Link from "next/link"
import { initiateLogout } from "../lib/api/user"
import Button from "./Button"

interface Props {
  session: Session | null
  status: string
}

const Lock = ({ session, status }: Props) => {
  const logoutHandler = (token?: string | null) => {
    if (token) {
      initiateLogout(token)
    }
  }

  const token = session?.serverToken || session?.passphrase
  return (
    <>
      {status === "loading" ? (
        <Link href="#" passHref>
          <button disabled className="m-4 bg-blue-600 text-white opacity-50 cursor-not-allowed">
            Loading…
          </button>
        </Link>
      ) : token ? (
        <Button href="/api/auth/signout" onClick={() => logoutHandler(token)} className="mt-3 mx-4">
          Logout
        </Button>
      ) : (
        <Button href="/api/auth/signin" className="mt-3 mx-4">
          Login
        </Button>
      )}
    </>
  )
}

export default Lock
