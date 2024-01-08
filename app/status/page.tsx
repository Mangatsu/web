import { Metadata } from "next"
import StatusPage from "./status"

export enum ProcessingStatus {
  ScanGalleries,
  GenerateMetadata,
  GenerateThumbnails,
}

export const metadata: Metadata = {
  title: "Mangatsu | status",
  description: "Processing status",
}

export default function Page() {
  return <StatusPage />
}
