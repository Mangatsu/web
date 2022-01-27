import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import "react-toastify/dist/ReactToastify.css"
import "../styles/globals.css"

function Mangatsu({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default Mangatsu
