import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getApiUrl } from "../../../lib/api/other"
import getServerInfo from "../../../lib/api/serverInfo"
import { decodeJWT } from "../../../lib/helpers"
import { Visibility } from "../../../types/api"

export default NextAuth({
  providers: [
    Credentials({
      id: "user",
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
          try {
            const payload = decodeJWT(data.Token)
            return { serverToken: data.Token, role: payload.Roles, uuid: payload.Subject }
          } catch (e) {
            return null
          }
        }

        return null
      },
    }),
    Credentials({
      id: "passphrase",
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
          body: JSON.stringify({ Passphrase: credentials.passphrase }),
          headers: { "Content-Type": "application/json" },
        })

        if (res.ok) {
          const data = await res.json()
          return { passphrase: data.Token, role: 0 }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.serverToken = user.serverToken
        token.passphrase = user.passphrase
        token.role = user.role
        token.uuid = user.uuid
      }
      return token
    },
    session: async ({ session, token }) => {
      session.serverToken = token.serverToken
      session.passphrase = token.passphrase
      session.role = token.role
      token.uuid = token.uuid
      return session
    },
  },
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
