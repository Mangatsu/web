import { GetStaticProps } from "next"
import Image from "next/image"
import getServerInfo from "../lib/api/serverInfo"
import MangatsuLogo from "../public/logo-small.png"
import { ServerInfo } from "../types"

const Custom404 = ({ serverInfo }: { serverInfo: ServerInfo }) => {
  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      <div className="mx-auto mt-48 mb-12">
        <Image src={MangatsuLogo} alt="Mangatsu logo" />
      </div>
      <div className="error-card">
        <h1>404 - not found</h1>
        Server {serverInfo.ServerVersion} | API v{serverInfo.APIVersion}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const serverInfo = await getServerInfo(true)

  return {
    props: { serverInfo },
    revalidate: 3600,
  }
}

export default Custom404
