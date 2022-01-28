import { GalleryMeta } from "../lib/types"

interface GalleryProps {
  galleries: GalleryMeta[]
}

const Galleries = ({ galleries }: GalleryProps) => {
  return (
    <div>
      <div>
        <div>
          {galleries.map((gallery) => {
            return <p key={gallery.UUID}>{gallery.Title}</p>
          })}
        </div>
      </div>
    </div>
  )
}

export default Galleries
