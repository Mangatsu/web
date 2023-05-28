import type { AppProps } from "next/app"
import "react-toastify/dist/ReactToastify.css"
import ExpiredLogin from "../components/ExpiredLogin"
import "../styles/globals.css"

function Mangatsu({ Component, pageProps }: AppProps) {
  return (
    <>
      <ExpiredLogin />
      <Component {...pageProps} />
    </>
  )
}

export default Mangatsu
