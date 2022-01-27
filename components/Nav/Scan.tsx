import Image from "next/image"
import { toast } from "react-toastify"
import { initiateMetadataGen, initiateScan, initiateThumbnailGen } from "../../lib/api/task"
import ScanIcon from "../../public/icons/uk-refresh.svg"
import Button from "../Button"
import PopupSmall from "../PopupSmall"

const Scan = ({ token }: { token: string }) => {
  // TODO: More options to the UI such as covers only thumnbnail generation etc.
  const quickScanHandler = async () => {
    toast("Starting quick scan...")
    await initiateScan(token, false)
  }

  const fullScanHandler = async () => {
    toast("Starting full scan...")
    await initiateScan(token, true)
  }

  const metadataHandler = async () => {
    toast("Parsing metadata...")
    await initiateMetadataGen(token, true, true)
  }

  const thumbnailHandler = async () => {
    toast.info("Generating thumbnails...")
    await initiateThumbnailGen(token, true, true)
  }

  return (
    <PopupSmall buttonChildren={<Image width={24} height={24} alt="scan menu" src={ScanIcon} />}>
      <Button onClick={() => quickScanHandler()} className="mx-4 my-2">
        Quick scan
      </Button>
      <Button onClick={() => fullScanHandler()} className="mx-4 my-2">
        Full scan
      </Button>
      <Button onClick={() => metadataHandler()} className="mx-4 my-2">
        Generate metadata
      </Button>
      <Button onClick={() => thumbnailHandler()} className="mx-4 my-2">
        Generate thumbnails
      </Button>
    </PopupSmall>
  )
}

export default Scan
