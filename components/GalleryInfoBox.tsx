import Image from "next/image"
import Link from "next/link"
import { getCacheUrl } from "../lib/api/other"
import placeholderCover from "../public/placeholder-opaque.png"
import { GalleryMeta } from "../types/api"

interface Props {
  gallery: GalleryMeta
}

const GalleryInfoBox = ({ gallery }: Props) => {
  return (
    <div
      key={gallery.UUID}
      className="grid grid-flow-col place-content-between mb-3 mr-3 bg-gray-800 bg-clip-padding rounded"
    >
      <div className="grid grid-flow-col place-content-start">
        <Link href={`/g/${gallery.UUID}`} key={gallery.UUID}>
          <Image
            alt="cover image"
            src={gallery.Thumbnail ? getCacheUrl(`/thumbnails/${gallery.UUID}/${gallery.Thumbnail}`) : placeholderCover}
            className="rounded"
            width={166}
            height={250}
            loading="lazy"
          />
        </Link>
        <div className="place-content-start m-4 w-full">
          <p>
            <b>Title: </b>
            {gallery.Title}
          </p>
          <p>
            <b>Native: </b>
            {gallery.TitleNative}
          </p>
          <p>
            <b>Translated: </b>
            {gallery.TitleTranslated}
          </p>
          <p>
            <b>Release: </b>
            {gallery.Released}
          </p>
          <b>Tags</b>
          <div className="pl-4 whitespace-pre-line">
            {Object.keys(gallery.Tags).map((namespace, i) => (
              <div key={i} className="mb-1">
                <span className="mr-2">{namespace}</span>
                {gallery.Tags[namespace].map((name, j) => (
                  <span key={j} className="name-tag">
                    {name}
                  </span>
                ))}
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex mt-2">
        <div className="badge" title="Category">
          {gallery.Category}
        </div>
        {!gallery.Nsfw && (
          <div className="badge bg-pink-700 text-pink-200 font" title="NSFW">
            H
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryInfoBox
