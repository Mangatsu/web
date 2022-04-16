import { useState } from "react"
import { FilterProps } from "."
import OnOffSwitch from "../OnOffSwitch"

const ShuffleSwitch = ({ query, setQuery }: FilterProps) => {
  const [checked, setChecked] = useState(false)

  const handleChange = (checked: boolean) => {
    setChecked(checked)
    const seed = checked ? Math.floor(Math.random() * 2147483648) : undefined
    setQuery({ ...query, seed })
  }

  return (
    <span>
      <label className="text-sm font-medium text-gray-400 px-2">Shuffle</label>
      <OnOffSwitch checked={checked} onChange={handleChange} />
    </span>
  )
}

export default ShuffleSwitch
