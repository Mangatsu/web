import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { Base64Placeholder } from "../lib/helpers"
import placeholderImage from "../public/placeholder-opaque.png"

interface Props extends ImageProps {
  text?: string | number
}

const ImageFallback = ({ text, ...props }: Props) => {
  const [src, setSrc] = useState(props.src)

  const image = (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...props}
      src={src}
      onError={() => setSrc(placeholderImage)}
      placeholder="blur"
      blurDataURL={Base64Placeholder}
    />
  )

  if (!text) {
    return image
  }

  return (
    <div className="grid place-items-center">
      <p className="text-7xl text-white" style={{ gridColumn: 1, gridRow: 1 }}>
        {text}
      </p>
      <div style={{ gridColumn: 1, gridRow: 1 }}>{image}</div>
    </div>
  )
}

export default ImageFallback
