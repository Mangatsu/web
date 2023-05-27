import useSWR from "swr"
import { swrFetch } from "../../api/other"

export default function useCategories() {
  const { data, error, isLoading } = useSWR("/categories", (key) => swrFetch(key).then((r) => r.json()))

  let categories = null
  let categoriesCount = 0
  if (data) {
    categories = data.Data
    categoriesCount = data.Count
  }

  return {
    categories,
    categoriesCount,
    isLoading,
    error,
  }
}
