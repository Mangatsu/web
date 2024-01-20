"use client"
import { notFound, useRouter } from "next/navigation"
import { ComponentType, JSX, useEffect } from "react"
import { Role } from "../../lib/helpers"
import useUser from "../../lib/hooks/data/useUser"

export default function withAuth(Component: ComponentType, hidden: boolean, role: Role) {
  return function AuthenticatedComponent(props: JSX.IntrinsicAttributes) {
    const { loading, access, isUser, isAdmin } = useUser()
    const router = useRouter()

    useEffect(() => {
      if (loading) {
        return
      }

      if (!access || (role > Role.NoRole && !isUser) || (role >= Role.Admin && !isAdmin)) {
        if (hidden) {
          notFound()
        } else {
          router.push("/login")
        }
      }
    }, [access, isAdmin, isUser, loading, router])

    if (loading || !access || (role > Role.NoRole && !isUser) || (role >= Role.Admin && !isAdmin)) {
      return null
    }

    return <Component {...props} />
  }
}
