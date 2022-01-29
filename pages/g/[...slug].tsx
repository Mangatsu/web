import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import ComicViewer from "react-comic-viewer"
import Button from "../../components/Button"
import Layout from "../../components/Layout"
import { fetchGallery } from "../../lib/api/library"
import { getCacheUrl } from "../../lib/api/other"
import getServerInfo from "../../lib/api/serverInfo"
import { changeExtension, clamp } from "../../lib/helpers"
import { Gallery, ServerInfo, Visibility } from "../../types/api"

interface Props {
  gallery: Gallery
  thumbnails: string[]
  page: number
  serverInfo: ServerInfo
}

export default function GalleryPage({ gallery, thumbnails, page, serverInfo }: Props) {
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [files, setFiles] = useState(gallery.Files)
  const [isShift, setIsShift] = useState(false)

  const shiftByOne = () => {
    if (isShift) {
      setFiles(files.slice(1))
      setIsShift(false)
    } else {
      setFiles(["/1x1.png", ...files])
      setIsShift(true)
    }
  }

  const viewer =
    files.length > 0 ? (
      <div className="pb-16">
        <h2 className="text-center mb-4 font-bold">{gallery.Meta.Title}</h2>
        <ComicViewer pages={files} switchingRatio={1} initialCurrentPage={page} />
      </div>
    ) : (
      <h3 className="text-center">No pages found</h3>
    )

  return (
    <>
      <Layout outerChildren={viewer} serverInfo={serverInfo} subtitle={gallery.Meta.Title}>
        <div className="w-full mb-16">
          <Button onClick={() => setShowThumbnails(!showThumbnails)} className="mr-4">
            Thumbnails
          </Button>
          <Button onClick={() => shiftByOne()}>Shift pages by one</Button>

          {showThumbnails && (
            <div className="mt-4">
              <p className="inline-block mb-1">Go to a page by clicking it.</p>
              <div className="grid gap-2 thumbnails sm:thumbnails-sm lg:thumbnails-lg">
                {thumbnails.map((thumbnail, i) => (
                  <a key={i} href={`/g/${gallery.Meta.UUID}/${i}`}>
                    <Image
                      alt={`page ${i} thumbnail`}
                      src={thumbnail}
                      loading="lazy"
                      width={200}
                      height={300}
                      objectFit="cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context?.params) {
    return { props: {} }
  }

  const serverInfo = await getServerInfo()
  const session = await getSession(context)
  const privateAccess = serverInfo.Visibility === Visibility.Private && session?.serverToken
  const restrictedAccess = serverInfo.Visibility === Visibility.Restricted && session?.passphrase
  if (!privateAccess && !restrictedAccess) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  const slugs = context.params?.slug

  if (!slugs || slugs.length === 0) {
    return { props: {} }
  }

  const gallery: Gallery = await fetchGallery(slugs[0], session?.serverToken || session?.passphrase)
  const thumbnails: string[] = []

  if (!gallery.Files) {
    gallery.Files = []
  }

  gallery.Files.forEach((file, i) => {
    thumbnails.push(getCacheUrl(`/thumbnails/${gallery.Meta.UUID}/${changeExtension(file, ".webp")}`))
    gallery.Files[i] = getCacheUrl(`/${gallery.Meta.UUID}/${file}`)
  })

  return {
    props: {
      serverInfo,
      gallery,
      thumbnails,
      page: slugs.length > 1 ? clamp(parseInt(slugs[1]), 0, gallery.Count) : 0,
    },
  }
}
