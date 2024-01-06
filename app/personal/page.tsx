import { Metadata } from "next"
import Personal from "./personal"

export const metadata: Metadata = {
  title: "Mangatsu | personal settings",
  description: "Customize your personal settings of Mangatsu",
}

export default function Page() {
  return <Personal />
}
