import { Dispatch, SetStateAction } from "react"
import { FilterProps } from "."
import OnOffSwitch from "../OnOffSwitch"

interface Props extends FilterProps {
  grouped: boolean
  setGrouped: Dispatch<SetStateAction<boolean>>
}

const GroupSeriesSwitch = ({ query, setQuery, grouped, setGrouped }: Props) => {
  const handleChange = () => {
    setGrouped(!grouped)
    setQuery({ ...query, grouped: !grouped })
  }

  return (
    <span>
      <label className="text-sm font-medium text-gray-400 px-2">Group</label>
      <OnOffSwitch checked={grouped} onChange={handleChange} />
    </span>
  )
}

export default GroupSeriesSwitch
