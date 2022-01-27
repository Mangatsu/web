import { Session } from "next-auth"
import Image from "next/image"
import UserIcon from "../../public/icons/uk-user.svg"
import { ServerInfo } from "../../types"
import Button from "../Button"
import Lock from "../Lock"
import PopupSmall from "../PopupSmall"

interface Props {
  session: Session | null
  isAdmin: boolean
  status: string
  serverInfo: ServerInfo
}

const User = ({ session, isAdmin, status, serverInfo }: Props) => {
  return (
    <PopupSmall buttonChildren={<Image width={24} height={24} alt="user menu" src={UserIcon} />}>
      <Lock session={session} status={status} />
      {session?.user && (
        <Button href="/personal" className="mt-3 mx-4">
          Personal
        </Button>
      )}
      {session?.user && isAdmin && (
        <Button href="/admin" className="mt-3 mx-4">
          Administration
        </Button>
      )}
      <div className="my-4 mx-4">
        <p className="font-bold">Mangatsu 🌕</p>
        <p>
          Visibility: <span className="font-bold">{serverInfo.Visibility}</span>
        </p>
        <p>
          Server: <span className="font-bold">{serverInfo.ServerVersion}</span>
        </p>
        <p>
          API <span className="font-bold">V{serverInfo.APIVersion}</span>
        </p>
      </div>
    </PopupSmall>
  )
}

export default User
