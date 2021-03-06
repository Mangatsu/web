import { ReactNode } from "react"
import Popup from "reactjs-popup"

interface Props {
  buttonChildren: ReactNode
  children: ReactNode
}

const NavPopup = ({ buttonChildren, children }: Props) => {
  return (
    <Popup
      trigger={
        <button
          type="button"
          style={{ minWidth: 35 }}
          className="rounded-full p-1 mx-2 border-2 border-blue-800 inline-flex bg-blue-600 hover:bg-blue-800 focus:ring-blue-800"
        >
          {buttonChildren}
        </button>
      }
      position="bottom right"
      arrow={false}
    >
      <div className="rounded bg-slate-700 w-auto h-auto flex flex-col py-2" style={{ marginTop: 6 }}>
        {children}
      </div>
    </Popup>
  )
}

export default NavPopup
