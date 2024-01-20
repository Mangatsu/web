import { ReactNode, RefObject } from "react"
import Popup from "reactjs-popup"
import { PopupActions } from "reactjs-popup/dist/types"

interface Props {
  triggerChildren: ReactNode
  children: ReactNode
  menuRef?: RefObject<PopupActions>
  isLink?: boolean
  isVisible?: boolean
  onVisibilityChange?: (isOpen: boolean) => void
}

const NavPopup = ({ triggerChildren, children, menuRef, isLink, isVisible, onVisibilityChange }: Props) => {
  return (
    <Popup
      trigger={
        isLink ? (
          <a className="cursor-pointer">{triggerChildren}</a>
        ) : (
          <button
            type="button"
            style={{ minWidth: 35 }}
            className="rounded-full p-1 mx-2 border-2 border-blue-800 inline-flex bg-blue-600 hover:bg-blue-800 focus:ring-blue-800"
          >
            {triggerChildren}
          </button>
        )
      }
      position="bottom right"
      arrow={false}
      ref={menuRef}
      open={isVisible}
      onOpen={onVisibilityChange ? () => onVisibilityChange(true) : () => {}}
      onClose={onVisibilityChange ? () => onVisibilityChange(false) : () => {}}
    >
      <div
        className="rounded bg-slate-700 w-auto h-auto min-w-64 flex flex-col py-2"
        style={{ marginTop: 4, boxShadow: "0 10px 10px 5px rgba(0,0,0,0.5)" }}
      >
        {children}
      </div>
    </Popup>
  )
}

export default NavPopup
