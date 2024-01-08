"use client"
import { useParams } from "next/navigation"
import useSWR, { Fetcher } from "swr"
import GalleryInfoBox from "../../../components/GalleryInfoBox"
import Layout from "../../../components/Layout"
import { APIPathsV1, swrFetcher } from "../../../lib/api/other"
import useUser from "../../../lib/hooks/data/useUser"
import { GalleryResponse } from "../../../types/api"

const fetcher: Fetcher<GalleryResponse, string> = (id) => swrFetcher(id)

export default function SeriesPage() {
  const params = useParams()
  const { loggedIn } = useUser()
  const { data: galleries } = useSWR(
    loggedIn && params?.slug ? `${APIPathsV1.Galleries}?series=${params.slug}` : null,
    fetcher,
  )

  if (!galleries || !galleries.Data || galleries.Data.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center">-</div>
      </Layout>
    )
  }

  const series = galleries?.Data ? galleries.Data[0].Series : ""
  return (
    <div>
      <h2 className="mb-4 font-bold">
        {series} ({galleries.Count})
      </h2>
      <div className="grid lg:grid-cols-2">
        {galleries.Data.map((gallery) => (
          <GalleryInfoBox key={gallery.UUID} gallery={gallery} />
        ))}
      </div>
    </div>
  )
}
