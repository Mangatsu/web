import useSWR from "swr"
import { APIPathsV1, swrFetcher } from "../../api/other"

export default function useFavorites() {
  const { data, error, isLoading } = useSWR(APIPathsV1.Favorites, (key) => swrFetcher(key))

  let favorites = null
  let favoritesCount = 0
  if (data) {
    favorites = data.Data
    favoritesCount = data.Count
  }

  return {
    favorites,
    favoritesCount,
    isLoading,
    error,
  }
}
