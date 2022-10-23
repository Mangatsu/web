import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import "react-toastify/dist/ReactToastify.css"
import ExpiredLogin from "../components/ExpiredLogin"
import "../styles/globals.css"

function Mangatsu({ Component, pageProps }: AppProps<{ session: Session; }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <ExpiredLogin />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default Mangatsu
