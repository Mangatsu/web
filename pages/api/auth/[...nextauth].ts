import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getApiUrl } from "../../../lib/api/other"
import getServerInfo from "../../../lib/api/serverInfo"
import { Visibility } from "../../../lib/types"

export default NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember for 30 days", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const body = {
          username: credentials.username,
          password: credentials.password,
          session_name: "next-auth-session",
          expires_in: credentials.remember ? 30 * 24 * 60 * 60 : 900,
        }

        const res = await fetch(getApiUrl("/login"), {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })

        if (res.ok) {
          const data = await res.json()
          return { name: data.Token }
        }

        return null
      },
    }),
    Credentials({
      name: "Passphrase",
      credentials: {
        passphrase: { label: "Passphrase", type: "password" },
      },
      async authorize(credentials) {
        const serverInfo = await getServerInfo()
        // If restricted mode is not enabled, return null immediately.
        if (!credentials || serverInfo.Visibility !== Visibility.Restricted) {
          return null
        }

        const res = await fetch(getApiUrl("/login"), {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })

        if (res.ok) {
          const passphrase = await res.json()
          return { passphrase: passphrase }
        }

        return null
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#4B76D9",
    logo: "/logo-small.png",
  },
})
