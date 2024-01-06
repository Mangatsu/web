"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { APIPathsV1, fetchJSON } from "../../lib/api/other"
import useUser from "../../lib/hooks/data/useUser"
import gameDieIcon from "../../public/icons/game-die.svg"
import { Gallery } from "../../types/api"
import Button from "../Button"
import Scan from "./Scan"
import User from "./User"

const Nav = () => {
  const router = useRouter()
  const { isAdmin, preferences } = useUser()

  const handleRandom = async () => {
    const gallery: Gallery = await fetchJSON(
      `${APIPathsV1.RandomGallery}${preferences.SeriesRandom ? "" : "?series=false"}`,
    )
    if (gallery) {
      router.push(`/g/${gallery.Meta.UUID}`)
    } else {
      toast.error("No galleries found")
    }
  }

  return (
    <nav className="px-2 mb-12 h-14 flex flex-row justify-between">
      {/* <Spinner /> TODO: Fix spinner in Next.js 13+ */}
      <span className="flex ml-2 text-3xl text-slate-600">漫月</span>
      <span className="flex">
        <Button href="/" className="mx-2 py-2 text-base">
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
