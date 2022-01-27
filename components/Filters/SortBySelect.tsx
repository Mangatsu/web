import { FilterProps } from "."

const SortBySelect = ({ query, setQuery }: FilterProps) => {
  return (
    <div>
      <label htmlFor="sortby" className="text-sm font-medium text-gray-400 px-2">
        Sortby
      </label>
      <select
        id="sortby"
        className="block w-full border text-sm rounded-lg p-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setQuery({ ...query, sortBy: e.currentTarget.value })}
      >
        <option value="title">Title</option>
        <option value="native">Native title</option>
      </select>
    </div>
  )
}

export default SortBySelect
