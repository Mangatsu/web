import { FilterProps } from "."

interface Props extends FilterProps {
  favorites: string[] | null
}

const FavoriteSelect = ({ query, setQuery, favorites }: Props) => {
  return (
    <div>
      <label htmlFor="favorites" className="text-sm font-medium text-gray-400 px-2">
        Favorite
      </label>
      <select
        id="favorites"
        className="block w-full border text-sm rounded-lg p-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setQuery({ ...query, favoriteGroup: e.currentTarget.value })}
      >
        <option></option>
        {favorites && favorites.map((favorite) => <option key={favorite}>{favorite}</option>)}
      </select>
    </div>
  )
}

export default FavoriteSelect
