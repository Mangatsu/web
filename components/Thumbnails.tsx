import ImageFallback from "./ImageFallback"

interface GalleryProps {
  uuid: string
  thumbnails: string[]
}

const Thumbnails = ({ uuid, thumbnails }: GalleryProps) => {
  return (
    <div className="grid gap-2 thumbnails sm:thumbnails-sm lg:thumbnails-lg">
      {thumbnails.map((thumbnail, i) => (
        <a key={i} href={`/g/${uuid}/${i}`}>
          <ImageFallback text={i + 1} alt={`page ${i + 1}`} src={thumbnail} loading="lazy" width={200} height={300} />
        </a>
      ))}
    </div>
  )
}

export default Thumbnails
