import { Metadata } from "next"
import Library from "./library"

export const metadata: Metadata = {
  title: "Mangatsu",
  description: "Welcome to Mangatsu",
}

export default async function Page() {
  /*
  async function getServerInfo() {
    let serverInfo: ServerInfo = await fetchServerInfo()
    if (!serverInfo) {
      serverInfo = {
        APIVersion: 0,
        ServerVersion: "Unknown",
        Visibility: Visibility.Private,
        Registrations: false,
      }
    }

    const cookie = headers().get("headers")
    const jwtCookie = parseCookieHeader("mtsu.jwt", cookie)
    const publicAccess = serverInfo.Visibility === Visibility.Public
    if (!publicAccess && !jwtCookie) {
      // to login page
    }

    return {
      props: {},
    }
  }

   await getServerInfo()
  */
  return <Library />
}
