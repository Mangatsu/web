import useSWR from "swr"
import { fetchServerInfo } from "../../api/other"

export default function useServer() {
  const { data, error, isLoading } = useSWR("/api", () => fetchServerInfo())

  return {
    server: data,
    isLoading,
    error,
  }
}
