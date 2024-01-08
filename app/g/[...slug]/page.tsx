import { Metadata } from "next"
import GalleryPage from "./gallery"

export const metadata: Metadata = {
  title: "Mangatsu | gallery",
  description: "Gallery",
}

export default function Page() {
  return <GalleryPage />
}
