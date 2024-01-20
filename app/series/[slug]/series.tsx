"use client"
import { useParams } from "next/navigation"
import useSWR, { Fetcher } from "swr"
import GalleryInfoBox from "../../../components/GalleryInfoBox"
import withAuth from "../../../components/HOC/WithAuth"
import { APIPathsV1, swrFetcher } from "../../../lib/api/other"
import { Role } from "../../../lib/helpers"
import useUser from "../../../lib/hooks/data/useUser"
import { GalleryResponse } from "../../../types/api"
import NotFound from "../../not-found"

const fetcher: Fetcher<GalleryResponse, string> = (id) => swrFetcher(id)

function SeriesPage() {
  const params = useParams()
  const { access } = useUser()
  const { data: galleries } = useSWR(
    access && params?.slug ? `${APIPathsV1.Galleries}?series=${params.slug}` : null,
    fetcher,
  )

  if (!galleries || !galleries.Data || galleries.Data.length === 0) {
    return <NotFound />
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

export default withAuth(SeriesPage, true, Role.NoRole)
