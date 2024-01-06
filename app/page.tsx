import { Metadata } from "next"
import { headers } from "next/headers"
import { fetchServerInfo } from "../lib/api/other"
import { parseCookieHeader } from "../lib/helpers"
import { ServerInfo, Visibility } from "../types/api"
import Library from "./library"

export const metadata: Metadata = {
  title: "Mangatsu",
  description: "Welcome to Mangatsu",
}

export async function getServerInfo() {
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
  console.log("cookie: ", cookie)
  if (!publicAccess && !jwtCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default async function Page() {
  await getServerInfo()
  return <Library />
}
