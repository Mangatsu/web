import Image from "next/image"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { APIPathsV1, fetchJSON } from "../../lib/api/other"
import useUser from "../../lib/hooks/data/useUser"
import gameDieIcon from "../../public/icons/game-die.svg"
import { Gallery } from "../../types/api"
import Button from "../Button"
import Spinner from "../Spinner"
import Scan from "./Scan"
import User from "./User"

const Nav = () => {
  const router = useRouter()
  const { isAdmin } = useUser()

  const handleRandom = async () => {
    const gallery: Gallery = await fetchJSON(APIPathsV1.RandomGallery)
    if (gallery) {
      router.push(`/g/${gallery.Meta.UUID}`)
    } else {
      toast.error("No galleries to load")
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
        {isAdmin && <Scan />}
        <User isAdmin={isAdmin} />
      </span>
    </nav>
  )
}

export default Nav
