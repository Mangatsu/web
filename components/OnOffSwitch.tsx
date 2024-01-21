import { SyntheticEvent } from "react"
import Switch from "react-switch"

interface Props {
  checked: boolean
  labelRight?: string
  onChange: (
    checked: boolean,
    event: MouseEvent | SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id: string,
  ) => void
}

const OnOffSwitch = ({ checked, onChange, labelRight }: Props) => {
  const switchComponent = () => {
    return (
      <Switch
        checked={checked === undefined ? false : checked}
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

  if (labelRight)
    return (
      <div className="flex flex-row space-x-2">
        {switchComponent()}
        <label className="">{labelRight}</label>
      </div>
    )

  return <>{switchComponent}</>
}

export default OnOffSwitch
