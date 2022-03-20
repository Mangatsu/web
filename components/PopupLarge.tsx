import { ReactNode } from "react"
import Popup from "reactjs-popup"

interface Props {
  activator?: JSX.Element | ((isOpen: boolean) => JSX.Element)
  children: ReactNode
}

const PopupLarge = ({ activator, children }: Props) => {
  return (
      <div
        className="popup-content rounded-xl bg-slate-800 w-auto h-auto m-4 px-5 py-4 flex flex-col shadow-xl overflow-y-auto"
        style={{ marginTop: 6, maxHeight: "calc(100vh - 50px)" }}
      >
        {children}
      </div>
    </Popup>
  )
}

export default PopupLarge
