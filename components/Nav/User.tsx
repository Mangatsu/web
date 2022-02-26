import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import UserIcon from "../../public/icons/uk-user.svg"
import { ServerInfo } from "../../types/api"
import Button from "../Button"
import Lock from "../Lock"
import NavPopup from "./NavPopup"

interface Props {
  session: Session | null
  isAdmin: boolean
  status: string
  serverInfo: ServerInfo
}

const User = ({ session, isAdmin, status, serverInfo }: Props) => {
  return (
    <NavPopup buttonChildren={<Image width={24} height={24} alt="user menu" src={UserIcon} />}>
      <Lock session={session} status={status} />
      {session?.serverToken && (
        <Button href="/personal" className="mt-3 mx-4">
          Personal
        </Button>
      )}
      {session?.serverToken && isAdmin && (
        <Button href="/admin" className="mt-3 mx-4">
          Administration
        </Button>
      )}
      <div className="my-4 mx-4">
        {session?.passphrase && <p className="text-sky-400">Anonymous access</p>}
        <Link href="https://github.com/Mangatsu">
          <a target="_blank" rel="noopener noreferrer" className="text-sky-400">
            Mangatsu 🌕
          </a>
        </Link>
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
    </NavPopup>
  )
}

export default User
