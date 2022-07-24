import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { fetchRandomGallery } from "../../lib/api/library"
import { Role } from "../../lib/helpers"
import gameDieIcon from "../../public/icons/game-die.svg"
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
    <nav className="px-2 mb-8 flex flex-row justify-between">
      <Spinner />
      <span className="flex">
        <Button href="/" className="mx-2">
          Library
        </Button>
        <Button
          onClick={() => handleRandom()}
          title="Random gallery"
          className="rounded-full p-1 mx-2 border-2 border-blue-800 inline-flex bg-blue-600 hover:bg-blue-800 focus:ring-blue-800"
        >
          <Image src={gameDieIcon} alt="game die" width={28} height={24} />
        </Button>
        {session?.serverToken && isAdmin && <Scan token={session?.serverToken} />}
        <User session={session} isAdmin={isAdmin} status={status} serverInfo={serverInfo} />
      </span>
    </nav>
  )
}

export default Nav
