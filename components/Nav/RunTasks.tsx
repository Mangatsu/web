"use client"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-toastify"
import { statusMessage } from "../../app/status/status"
import { initiateMetadataGen, initiateScan, initiateThumbnailGen } from "../../lib/api/task"
import useProcessingStatus from "../../lib/hooks/data/useProcessingStatus"
import ScanIcon from "../../public/icons/uk-refresh.svg"
import Button from "../Button"
import NavPopup from "./NavPopup"

const RunTasks = () => {
  const [isVisible, setIsVisible] = useState(false)

  const { data } = useProcessingStatus(isVisible)

  // TODO: More options to the UI such as quick scan, covers only thumnbnail generation etc.
  // const quickScanHandler = async () => {
  //   toast("Starting quick scan...")
  //   await initiateScan(token, false)
  // }

  const fullScanHandler = async () => {
    toast("Starting full scan...")
    await initiateScan(true)
  }

  const metadataHandler = async () => {
    toast("Parsing metadata...")
    await initiateMetadataGen()
  }

  const thumbnailHandler = async () => {
    toast.info("Generating thumbnails...")
    await initiateThumbnailGen(true, true)
  }

  const onVisibilityChange = (isOpen: boolean) => {
    setIsVisible(isOpen)
  }

  if (!data) {
    return (
      <NavPopup triggerChildren={<Image width={24} height={24} alt="scan menu" src={ScanIcon} />}>
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs text-gray-300">Waiting for the status response...</div>
        </div>
        <Button disabled>Scan galleries</Button>
        <Button disabled>Generate metadata</Button>
        <Button disabled>Generate thumbnails</Button>
      </NavPopup>
    )
  }

  return (
    <NavPopup
      triggerChildren={<Image width={28} height={28} alt="scan menu" src={ScanIcon} />}
      isVisible={isVisible}
      onVisibilityChange={onVisibilityChange}
    >
      <div className="flex flex-col gap-2 m-4">
        <Button href="/status#thumbnails">View stats</Button>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-start flex-none">
            <div className="text-xs">Status</div>
            <div className="text-xs">{statusMessage(data.Scan.Running)}</div>
          </div>
          <Button onClick={() => fullScanHandler()} disabled={data.Scan.Running}>
            Scan galleries
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-start flex-none">
            <div className="text-xs">Status</div>
            <div className="text-xs">{statusMessage(data.Metadata.Running)}</div>
          </div>
          <Button onClick={() => metadataHandler()} disabled={data.Metadata.Running}>
            Generate metadata
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-start">
            <div className="text-xs">Status</div>
            <div className="text-xs">{statusMessage(data.Thumbnails.Running)}</div>
          </div>
          <Button onClick={() => thumbnailHandler()} disabled={data.Thumbnails.Running}>
            Generate thumbnails
          </Button>
        </div>
      </div>
    </NavPopup>
  )
}

export default RunTasks
