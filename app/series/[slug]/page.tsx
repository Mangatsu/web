import { Metadata } from "next"
import SeriesPage from "./series"

export const metadata: Metadata = {
  title: "Mangatsu | gallery",
  description: "Gallery",
}

export default function Page() {
  return <SeriesPage />
}
