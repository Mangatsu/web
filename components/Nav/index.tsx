import { useSession } from "next-auth/react"
import { decodeJWT, Role } from "../../lib/helpers"
import { ServerInfo } from "../../types"
import Button from "../Button"
import Scan from "./Scan"
import User from "./User"

const Nav = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  const { data: session, status } = useSession()
  const role = session?.user?.name ? decodeJWT(session?.user?.name)?.Roles : 0
  const isAdmin = role >= Role.Admin

  return (
    <nav className="px-8 mb-8">
      <Button href="/" className="mx-4">
        Library
      </Button>
      {session?.user?.name && isAdmin && <Scan token={session.user.name} />}
      <User session={session} isAdmin={isAdmin} status={status} serverInfo={serverInfo} />
    </nav>
  )
}

export default Nav
