import { Metadata } from "next"
import Login from "./login"

export const metadata: Metadata = {
  title: "Mangatsu | login",
  description: "Login to Mangatsu",
}

export default async function Page() {
  return <Login />
}
