import { useState } from "react"
import Switch from "react-switch"
import { FilterProps } from "."

const OrderSwitch = ({ query, setQuery }: FilterProps) => {
  const [checked, setChecked] = useState(false)
  const handleChange = (nextChecked: boolean) => {
    setChecked(nextChecked)
    setQuery({ ...query, order: checked ? "asc" : "desc" })
  }

  return (
    <span>
      <label className="text-sm font-medium text-gray-400 px-2">Order</label>
      <Switch
        checked={checked}
        onChange={handleChange}
        className="h-5"
        offColor="#234371"
        onColor="#234371"
        offHandleColor="#fff"
        onHandleColor="#fff"
        uncheckedIcon={<></>}
        checkedIcon={<></>}
        uncheckedHandleIcon={<div className="flex justify-center align-middle h-full text-blue-600">⬆</div>}
        checkedHandleIcon={<div className="flex justify-center align-middle h-full text-blue-600">⬇</div>}
      />
    </span>
  )
}

export default OrderSwitch
