import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { fetchRandomGallery } from "../../lib/api/library"
import { Role } from "../../lib/helpers"
import { Gallery, ServerInfo } from "../../types/api"
import Button from "../Button"
import Scan from "./Scan"
import User from "./User"

const Nav = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role ? session?.user?.role >= Role.Admin : false

  const handleRandom = async () => {
    const gallery: Gallery = await fetchRandomGallery(session?.serverToken)
    router.push(`/g/${gallery.Meta.UUID}`)
  }

  return (
    <nav className="px-8 mb-8">
      <Button href="/" className="mx-4">
        Library
      </Button>
      <Button onClick={() => handleRandom()} className="mr-2">
        Random
      </Button>
      {session?.serverToken && isAdmin && <Scan token={session?.serverToken} />}
      <User session={session} isAdmin={isAdmin} status={status} serverInfo={serverInfo} />
    </nav>
  )
}

export default Nav
