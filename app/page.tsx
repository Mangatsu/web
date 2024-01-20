import { Metadata } from "next"
import Library from "./library"

export const metadata: Metadata = {
  title: "Mangatsu",
  description: "Welcome to Mangatsu",
}

export default async function Page() {
  return <Library />
}
