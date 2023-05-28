import Image from "next/image"
import MangatsuLogo from "../public/logo-small.png"

const Custom404 = () => {
  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      <div className="mx-auto mt-48 mb-12">
        <Image src={MangatsuLogo} alt="Mangatsu logo" />
      </div>
      <div className="error-card">
        <h1>404 - not found</h1>
      </div>
    </div>
  )
}

export default Custom404
