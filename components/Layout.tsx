import Head from "next/head"
import { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
import { ServerInfo } from "../lib/types"
import Nav from "./Nav"

interface LayoutProps {
  subtitle?: string
  serverInfo: ServerInfo
  children: ReactNode
  outerChildren?: ReactNode
}

const Layout = ({ subtitle, serverInfo, children, outerChildren }: LayoutProps) => {
  return (
    <div>
      <Head>
        <title>Mangatsu{subtitle ? ` - ${subtitle}` : ""}</title>
      </Head>
      <ToastContainer
        theme="dark"
        position="top-left"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Nav serverInfo={serverInfo} />
      {outerChildren}
      <div className="flex flex-col mx-auto px-2 sm:px-8 justify-center max-w-7xl">{children}</div>
    </div>
  )
}

export default Layout
