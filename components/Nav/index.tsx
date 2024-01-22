"use client"
import { BookOpenIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { APIPathsV1, fetchJSON } from "../../lib/api/other"
import useUser from "../../lib/hooks/data/useUser"
import gameDieIcon from "../../public/icons/game-die.svg"
import { Gallery } from "../../types/api"
import Button from "../Button"
import RunTasks from "./RunTasks"
import User from "./User"

const Nav = () => {
  const router = useRouter()
  const { access, isAdmin, preferences } = useUser()

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
    <div className="flex justify-center">
      <nav className="px-2 mb-12 h-14 flex flex-row justify-between rounded-b-xl w-full max-w-screen-xl">
        {/* <Spinner /> TODO: Fix spinner in Next.js 13+ */}
        <Link href="/">
          <span className="flex ml-2 text-3xl text-slate-600">漫月</span>
        </Link>
        <span className="flex space-x-1 sm:space-x-3 md:space-x-5">
          {access && (
            <>
              <Button
                href="/"
                className="rounded-full p-1 border-blue-800 bg-blue-600 hover:bg-blue-800 focus:ring-blue-800"
              >
                <BookOpenIcon className="h-7 w-7 text-zinc-100" title="Library" />
              </Button>

              <Button
                onClick={() => handleRandom()}
                title="Random gallery"
                className="rounded-full p-1 border-blue-800 bg-blue-600 hover:bg-blue-800 focus:ring-blue-800"
              >
                <Image src={gameDieIcon} alt="game die" width={28} height={24} />
              </Button>
            </>
          )}
          {isAdmin && <RunTasks />}
          <User isAdmin={isAdmin} />
        </span>
      </nav>
    </div>
  )
}

export default Nav
