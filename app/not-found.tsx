import Image from "next/image"
import MangatsuLogo from "../public/logo-small.png"

const NotFound = () => {
  return (
    <div className="flex flex-col">
      <div className="mx-auto mt-48 mb-12">
        <Image src={MangatsuLogo} alt="Mangatsu logo" />
      </div>
      <div className="error-card">
        <h1>404 - not found</h1>
      </div>
    </div>
  )
}

export default NotFound
