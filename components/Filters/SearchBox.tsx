import { FilterProps } from "."

const SearchBox = ({ query, setQuery }: FilterProps) => {
  return (
    <input
      className="rounded w-full h-12 p-4 text-xl bg-slate-700 text-white shadow-xl focus:outline-none"
      type="text"
      id="search"
      name="search"
      minLength={2}
      placeholder="Search..."
      onChange={(e) => setQuery({ ...query, searchTerm: e.target.value })}
    />
  )
}

export default SearchBox
