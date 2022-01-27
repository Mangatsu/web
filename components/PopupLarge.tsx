import { ReactNode } from "react"
import Popup from "reactjs-popup"

interface Props {
  activator?: JSX.Element | ((isOpen: boolean) => JSX.Element)
  children: ReactNode
}

const PopupLarge = ({ activator, children }: Props) => {
  return (
    <Popup trigger={activator} modal arrow={false}>
      <div className="rounded bg-slate-800 w-auto h-auto p-8 flex flex-col py-2 shadow-xl" style={{ marginTop: 6 }}>
        {children}
      </div>
    </Popup>
  )
}

export default PopupLarge
