import Image from "next/image"
import Link from "next/link"
import { RefObject, useRef } from "react"
import { PopupActions } from "reactjs-popup/dist/types"
import useServer from "../../lib/hooks/data/useServer"
import UserIcon from "../../public/icons/uk-user.svg"
import Button from "../Button"
import Lock from "../Lock"
import NavPopup from "./NavPopup"

import useUser from "../../lib/hooks/data/useUser"
import packageJson from "../../package.json"
const { version } = packageJson

interface Props {
  isAdmin: boolean
}

const User = ({ isAdmin }: Props) => {
  const { server, isLoading, error } = useServer()
  const { isUser, isAnonymous } = useUser()

  const menuRef = useRef<PopupActions>() as RefObject<PopupActions>
  const closeUserMenu = () => {
    if (menuRef.current) {
      menuRef.current.close()
    }
  }

  function personalButton() {
    if (isUser) {
      return (
        <Button href="/personal" onClick={() => closeUserMenu()}>
          Personal
        </Button>
      )
    } else if (isAnonymous) {
      return <Button disabled>Logged in anonymously</Button>
    } else {
      return null
    }
  }

  return (
    <NavPopup menuRef={menuRef} triggerChildren={<Image width={28} height={28} alt="user menu" src={UserIcon} />}>
      <div className="flex flex-col m-3 gap-3">
        <Lock />
        {personalButton()}
        {isAdmin && (
          <Button href="/admin" onClick={() => closeUserMenu()}>
            Administration
          </Button>
        )}
        <div className="mx-3">
          <span>
            <Link href="https://github.com/Mangatsu" target="_blank" rel="noopener noreferrer" className="text-sky-400">
              github.com/Mangatsu
            </Link>
          </span>
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
                API: <span className="font-bold">V{isLoading ? "..." : server?.APIVersion ?? "-"}</span>
              </p>
            </>
          )}
          <p>
            Web: <span className="font-bold">{version}</span>
          </p>
        </div>
      </div>
    </NavPopup>
  )
}

export default User
