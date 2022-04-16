import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import GalleryInfoBox from "../../components/GalleryInfoBox"
import Layout from "../../components/Layout"
import { fetchSeries } from "../../lib/api/library"
import getServerInfo from "../../lib/api/serverInfo"
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
        {series} ({galleries.Count})
      </h2>
      <div className="grid lg:grid-cols-2">
        {galleries.Data.map((gallery) => (
          <GalleryInfoBox key={gallery.UUID} gallery={gallery} />
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
