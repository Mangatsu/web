import { useEffect } from "react"
import useSWR from "swr"
import { fetchServerInfo } from "../../api/other"
import { LocalPreferences, setValue } from "../../localStorage"

export default function useServer() {
  const { data, error, isLoading } = useSWR("/api", () => fetchServerInfo())

  useEffect(() => {
    if (data?.Visibility) {
      setValue(LocalPreferences.ServerVisibility, data.Visibility)
    }
  }, [data])

  return {
    server: data,
    isLoading,
    error,
  }
}
