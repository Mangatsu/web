import { GetServerSideProps } from "next"
import GalleryInfoBox from "../../components/GalleryInfoBox"
import Layout from "../../components/Layout"
import { fetchSeries } from "../../lib/api/library"
import { GalleryResponse } from "../../types/api"

interface Props {
  galleries: GalleryResponse
}

export default function SeriesPage({ galleries }: Props) {
  const series = galleries.Data[0].Series
  return (
    <Layout subtitle={series}>
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
  if (!context.params?.slug) {
    return { notFound: true }
  }

  if (typeof context.params.slug !== "string") {
    context.params.slug = context.params.slug[0]
  }

  const galleries = await fetchSeries(context.params.slug, context.req.headers.cookie)
  if (!galleries) {
    return { notFound: true }
  }

  return {
    props: { galleries },
  }
}
