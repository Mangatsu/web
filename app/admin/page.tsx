import { Metadata } from "next"
import Admin from "./admin"

export const metadata: Metadata = {
  title: "Mangatsu | admin dashboard",
  description: "Admin configuration",
}

export default function Page() {
  return <Admin />
}
