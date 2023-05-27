import { FilterProps } from "."

interface Props extends FilterProps {
  categories: string[] | null
}

const CategorySelect = ({ query, setQuery, categories }: Props) => {
  return (
    <div>
      <label htmlFor="categories" className="w-1/3 text-sm font-medium text-gray-400 px-2">
        Category
      </label>
      <select
        id="categories"
        className="block w-full border text-sm rounded-lg p-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setQuery({ ...query, category: e.currentTarget.value })}
      >
        <option></option>
        {categories && categories.map((category) => <option key={category}>{category}</option>)}
      </select>
    </div>
  )
}

export default CategorySelect
