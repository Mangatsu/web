import { SyntheticEvent } from "react"
import Switch from "react-switch"

interface Props {
  checked: boolean
  onChange: (
    checked: boolean,
    event: MouseEvent | SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id: string
  ) => void
}

const OnOffSwitch = ({ checked, onChange }: Props) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="h-5"
      offColor="#234371"
      onColor="#234371"
      offHandleColor="#fff"
      onHandleColor="#fff"
      uncheckedIcon={<></>}
      checkedIcon={<></>}
      checkedHandleIcon={<div className="flex justify-center align-middle h-full text-green-600">✔</div>}
      uncheckedHandleIcon={<div className="flex justify-center align-middle h-full text-red-600">✖</div>}
    />
  )
}

export default OnOffSwitch
