import fs from "fs"
import path from "path"
import { ServerInfo, Visibility } from "../../types/api"
import { fetchServerInfo } from "./other"

const SERVER_INFO_CACHE_PATH = path.resolve(".server-info.json")

export default async function getServerInfo(refresh?: boolean): Promise<ServerInfo> {
  let cachedData: ServerInfo | null = null

  try {
    if (fs.existsSync(SERVER_INFO_CACHE_PATH)) {
      cachedData = JSON.parse(fs.readFileSync(SERVER_INFO_CACHE_PATH, "utf8"))
    }
  } catch (error) {
    console.log("Server info cache not initialized", error)
  }

  if (!cachedData?.ServerVersion || refresh || cachedData.ServerVersion === "unknown") {
    let data
    try {
      data = await fetchServerInfo()
    } catch {
      console.log("Failed to fetch server info. Is the server offline?")
    }

    if (data) {
      try {
        fs.writeFileSync(SERVER_INFO_CACHE_PATH, JSON.stringify(data), "utf8")
      } catch (error) {
        console.log("Error writing to .server-info.json: ", error)
      }

      cachedData = data
    }
  }

  if (!cachedData) {
    cachedData = { APIVersion: 0, ServerVersion: "unknown", Visibility: Visibility.Private }
    try {
      fs.writeFileSync(SERVER_INFO_CACHE_PATH, JSON.stringify(cachedData), "utf8")
    } catch (error) {
      console.log("Error writing to .server-info.json: ", error)
    }
  }

  return cachedData
}
