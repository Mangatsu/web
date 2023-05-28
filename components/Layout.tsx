import Head from "next/head"
import { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
import Nav from "./Nav"

interface LayoutProps {
  subtitle?: string
  children: ReactNode
  outerChildren?: ReactNode
}

const Layout = ({ subtitle, children, outerChildren }: LayoutProps) => {
  const title = `Mangatsu${subtitle ? ` - ${subtitle}` : ""}`
  return (
    <div>
      <Head>
        <title>{title}</title>
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
      <Nav />
      {outerChildren}
      <div className="flex flex-col mx-auto px-2 sm:px-8 justify-center max-w-7xl">{children}</div>
    </div>
  )
}

export default Layout
