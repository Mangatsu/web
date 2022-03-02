import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import Layout from "../../components/Layout"
import { fetchSeries } from "../../lib/api/library"
import { getCacheUrl } from "../../lib/api/other"
import getServerInfo from "../../lib/api/serverInfo"
import placeholderCover from "../../public/placeholder.png"
import { GalleryResponse, ServerInfo, Visibility } from "../../types/api"

interface Props {
  galleries: GalleryResponse
  serverInfo: ServerInfo
}
export default function SeriesPage({ galleries, serverInfo }: Props) {
  const series = galleries.Data[0].Series
  return (
    <Layout serverInfo={serverInfo} subtitle={series}>
      <h2 className="mb-4 font-bold">
        {series} ({galleries.Count} entries)
      </h2>
      <div className="grid lg:grid-cols-2">
        {galleries.Data.map((gallery) => (
          <div
            key={gallery.UUID}
            className="grid grid-flow-col place-content-start mb-3 mr-3 bg-gray-800 bg-clip-padding rounded"
          >
            <Link href={`/g/${gallery.UUID}`} key={gallery.UUID}>
              <a>
                <Image
                  alt="cover image"
                  src={
                    gallery.Thumbnail
                      ? getCacheUrl(`/thumbnails/${gallery.UUID}/${gallery.Thumbnail}`)
                      : placeholderCover
                  }
                  className="w-full rounded text-center"
                  width={166}
                  height={250}
                  objectFit="cover"
                  loading="lazy"
                />
              </a>
            </Link>
            <div className="grid place-content-start m-4">
              <p>
                <b>Title: </b>
                {gallery.Title}
              </p>
              <p>
                <b>Tags: </b>
                {Object.keys(gallery.Tags).map((namespace, i) => (
                  <span key={i}>
                    {namespace}: {gallery.Tags[namespace].map((name) => `${name}, `)}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverInfo = await getServerInfo()
  const session = await getSession(context)

  const publicAccess = serverInfo.Visibility === Visibility.Public
  const privateAccess = session?.serverToken
  const restrictedAccess = serverInfo.Visibility === Visibility.Restricted && session?.passphrase
  if (!publicAccess && !privateAccess && !restrictedAccess) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  if (!context.params?.slug) {
    return { props: { serverInfo } }
  }

  if (typeof context.params.slug !== "string") {
    context.params.slug = context.params.slug[0]
  }

  const galleries: GalleryResponse = await fetchSeries(context.params.slug, session?.serverToken || session?.passphrase)
  if (!galleries) {
    return { notFound: true }
  }

  if (galleries.Count === 0) {
    galleries.Data = []
  }

  console.log(galleries.Data[0].Tags)

  return {
    props: {
      serverInfo,
      galleries,
    },
  }
}
