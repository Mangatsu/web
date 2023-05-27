import useSWR from "swr"
import { swrFetch } from "../../api/other"

export default function useFavorites() {
  const { data, error, isLoading } = useSWR("/users/me/favorites", (key) => swrFetch(key).then((r) => r.json()))

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
