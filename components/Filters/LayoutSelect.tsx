export enum LibraryLayout {
  Thumbnail = "Thumbnail",
  Detailed = "Detailed",
  Minimal = "Minimal", //  TODO: Add minimal list layout
}

interface Props {
  setLayout: (layout: LibraryLayout) => void
}

const LayoutSelect = ({ setLayout }: Props) => {
  return (
    <div>
      <label htmlFor="categories" className="w-1/3 text-sm font-medium text-gray-400 px-2">
        Layout
      </label>
      <select
        id="categories"
        className="block w-full border text-sm rounded-lg p-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setLayout(e.currentTarget.value as unknown as LibraryLayout)}
      >
        <option>Thumbnail</option>
        <option>Detailed</option>
        {/* <option>Minimal</option> */}
      </select>
    </div>
  )
}

export default LayoutSelect
