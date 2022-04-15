import { HeartIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { fetchRandomGallery } from "../../lib/api/library"
import { Role } from "../../lib/helpers"
import { Gallery, ServerInfo } from "../../types/api"
import Button from "../Button"
import Spinner from "../Spinner"
import Scan from "./Scan"
import User from "./User"

const Nav = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role ? session?.user?.role >= Role.Admin : false

  const handleRandom = async () => {
    const gallery: Gallery = await fetchRandomGallery(session?.serverToken)
    if (gallery) {
      router.push(`/g/${gallery.Meta.UUID}`)
    } else {
      toast.error("No galleries.")
    }
  }

  return (
    <nav className="px-8 mb-8 flex flex-row justify-between">
      <Spinner />
      <span className="flex">
        <Button href="/" className="mx-4">
          Library
        </Button>
          <HeartIcon className="h-6 w-6" />
        </Button>
        {session?.serverToken && isAdmin && <Scan token={session?.serverToken} />}
        <User session={session} isAdmin={isAdmin} status={status} serverInfo={serverInfo} />
      </span>
    </nav>
  )
}

export default Nav
