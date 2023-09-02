import ExpiredLogin from "../components/ExpiredLogin"
import Layout from "../components/Layout"

import "react-toastify/dist/ReactToastify.css"
import "../styles/globals.css"

import { Noto_Sans_JP } from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSansJP.className}>
      <body>
        <ExpiredLogin />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
