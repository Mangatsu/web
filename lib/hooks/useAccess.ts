import { useSession } from "next-auth/react"
import getServerInfo from "../api/serverInfo"
import { Visibility } from "../types"

export default async function useAccess(privatePage?: boolean) {
  let allowed = false

  const serverInfo = await getServerInfo()
  const { data: session } = useSession()

  if (serverInfo.Visibility === Visibility.Public && !privatePage) {
    allowed = true
  }

  if (session?.user?.name) {
    allowed = true
  }

  return { allowed, session }
}
