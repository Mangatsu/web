import Image from "next/image"
import Link from "next/link"
import { RefObject, useRef } from "react"
import { PopupActions } from "reactjs-popup/dist/types"
import useServer from "../../lib/hooks/data/useServer"
import { LocalPreferences, getValue } from "../../lib/localStorage"
import UserIcon from "../../public/icons/uk-user.svg"
import Button from "../Button"
import Lock from "../Lock"
import NavPopup from "./NavPopup"

interface Props {
  isAdmin: boolean
}

const User = ({ isAdmin }: Props) => {
  const { server, isLoading, error } = useServer()

  const menuRef = useRef<PopupActions>() as RefObject<PopupActions>
  const closeUserMenu = () => {
    if (menuRef.current) {
      menuRef.current.close()
    }
  }

  return (
    <NavPopup menuRef={menuRef} triggerChildren={<Image width={24} height={24} alt="user menu" src={UserIcon} />}>
      <Lock />
      {getValue(LocalPreferences.UserUUID) && (
        <Button href="/personal" onClick={() => closeUserMenu()} className="mt-3 mx-4">
          Personal
        </Button>
      )}
      {isAdmin && (
        <Button href="/admin" onClick={() => closeUserMenu()} className="mt-3 mx-4">
          Administration
        </Button>
      )}
      <div className="my-4 mx-4">
        {false && <p className="text-sky-400">Anonymous access</p>}
        <Link href="https://github.com/Mangatsu" target="_blank" rel="noopener noreferrer" className="text-sky-400">
          github.com/Mangatsu
        </Link>
        {error ? (
          <p>Error loading server info.</p>
        ) : (
          <>
            <p>
              Visibility: <span className="font-bold">{isLoading ? "..." : server?.Visibility ?? "-"}</span>
            </p>
            <p>
              Server: <span className="font-bold">{isLoading ? "..." : server?.ServerVersion ?? "-"}</span>
            </p>
            <p>
              API <span className="font-bold">V{isLoading ? "..." : server?.APIVersion ?? "-"}</span>
            </p>
          </>
        )}
      </div>
    </NavPopup>
  )
}

export default User
