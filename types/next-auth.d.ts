import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    serverToken?: string
    passphrase?: string
    user?: Pick<User, "id" | "serverToken" | "passphrase" | "role" | "uuid">
    expiresAt: number | null
  }

  interface User {
    id?: string
    serverToken?: string
    passphrase?: string
    role: number
    uuid: string | null
    expiresAt: number | null
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    serverToken?: string
    passphrase?: string
    user: {
      role: number
      uuid: string | null
    }
    expiresAt: number | null
  }
}
