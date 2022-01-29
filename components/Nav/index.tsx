import { useSession } from "next-auth/react"
import { Role } from "../../lib/helpers"
import { ServerInfo } from "../../types/api"
import Button from "../Button"
import Scan from "./Scan"
import User from "./User"

const Nav = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role ? session?.user?.role >= Role.Admin : false

  return (
    <nav className="px-8 mb-8">
      <Button href="/" className="mx-4">
        Library
      </Button>
      {session?.serverToken && isAdmin && <Scan token={session?.serverToken} />}
      <User session={session} isAdmin={isAdmin} status={status} serverInfo={serverInfo} />
    </nav>
  )
}

export default Nav
