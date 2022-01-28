import { Dispatch, SetStateAction } from "react"
import { StringResponse } from "../../lib/api/other"
import { LibraryFilters } from "../../lib/types"
import CategorySelect from "./CategorySelect"
import FavoriteSelect from "./FavoriteSelect"
import NSFWSwitch from "./NSFWSwitch"
import OrderSwitch from "./OrderSwitch"
import SearchBox from "./SearchBox"
import SortBySelect from "./SortBySelect"

export interface FilterProps {
  query: LibraryFilters
  setQuery: Dispatch<SetStateAction<LibraryFilters>>
}

interface Props extends FilterProps {
  categories: StringResponse
  favorites: StringResponse
}

const Filters = ({ query, setQuery, categories, favorites }: Props) => {
  return (
    <div className="flex flex-row mb-12 mx-16">
      <div className="w-full grid grid-flow-row">
        <SearchBox query={query} setQuery={setQuery} />
        <div className="filter-grid mt-2">
          <div className="grid grid-flow-col">
            <NSFWSwitch query={query} setQuery={setQuery} />
            <OrderSwitch query={query} setQuery={setQuery} />
          </div>
          <SortBySelect query={query} setQuery={setQuery} />
          <CategorySelect query={query} setQuery={setQuery} categories={categories} />
          <FavoriteSelect query={query} setQuery={setQuery} favorites={favorites} />
        </div>
      </div>

      <div className="grid grid-rows-2 grid-cols-3"></div>
    </div>
  )
}

export default Filters
