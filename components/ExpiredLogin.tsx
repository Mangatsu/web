import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import useRouteChange from "../lib/hooks/useRouteChange"

const ExpiredLogin = () => {
  const { routeChanging } = useRouteChange()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.expiresAt) {
      if (session.expiresAt < Date.now()) {
        signOut()
      }
    }
  }, [routeChanging, session, status])

  return null
}

export default ExpiredLogin
