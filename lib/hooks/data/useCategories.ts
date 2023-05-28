import useSWR from "swr"
import { APIPathsV1, swrFetcher } from "../../api/other"

export default function useCategories() {
  const { data, error, isLoading } = useSWR(APIPathsV1.Categories, (key) => swrFetcher(key))

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
