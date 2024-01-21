import { ReactNode, useEffect, useState } from "react"
import Popup from "reactjs-popup"

interface Props {
  activator?: JSX.Element | ((isOpen: boolean) => JSX.Element)
  children: ReactNode
}

const PopupLarge = ({ activator, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0]

    if (isOpen) {
      html.classList.add("lock-scroll")
    } else {
      html.classList.remove("lock-scroll")
    }

    return (): void => {
      html.classList.remove("lock-scroll")
    }
  }, [isOpen])

  return (
    <Popup trigger={activator} modal arrow={false} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
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
