import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Layout from "../components/Layout"
import OnOffSwitch from "../components/OnOffSwitch"
import getServerInfo from "../lib/api/serverInfo"
import { updateUser } from "../lib/api/user"
import { Role } from "../lib/helpers"
import { getValue, LocalPreferences, setValue } from "../lib/localStorage"
import { ServerInfo } from "../types/api"

interface Props {
  serverInfo: ServerInfo
  token: string
  role: number
  userUUID: string
}

export default function Personal({ serverInfo, token, role, userUUID }: Props) {
  const isAdmin = role >= Role.Admin
  const [nsfwPref, setNsfwPref] = useState(false)

  useEffect(() => {
    setNsfwPref(getValue(LocalPreferences.NSFWPref))
  }, [])

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, nsfwPref)
    toast.success("Preferences saved")
  }

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & { password: { value: string }; role: { value: number } }
    const userForm = { password: target.password.value, role: target.role.value }

    const response = await updateUser(token, userUUID, userForm)
    if (response) {
      toast.success("User updated")
    } else {
      toast.error("Failes to update user")
    }
  }

  return (
    <Layout serverInfo={serverInfo} subtitle="Personal">
      <h3>Personal Settings</h3>
      <div className="flex">
        <div className="inline-block p-4 rounded bg-opacity-20 bg-black">
          <h4>User</h4>
          <form className="max-w-xs" onSubmit={(e) => handleUserUpdate(e)}>
            <label>New password</label>
            <input type="password" id="password" />
            <label>Role</label>
            <select
              id="role"
              className="shadow-sm border text-sm rounded-lg block w-full p-2 mb-4   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
              disabled={!isAdmin}
            >
              <option selected={role === Role.Viewer} value={Role.Viewer}>
                Viewer
              </option>
              <option selected={role === Role.Member} value={Role.Member}>
                Member
              </option>
              <option selected={role === Role.Admin} value={Role.Admin}>
                Admin
              </option>
            </select>
            <button
              type="submit"
              className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              Update
            </button>
          </form>
        </div>
        <div className="inline-block p-4 h-64 rounded bg-opacity-20 bg-black">
          <h4>Site</h4>
          <label>Hide NSFW results by default?</label>
          <br />
          <OnOffSwitch checked={nsfwPref} onChange={setNsfwPref} />
          <br />
          <button
            onClick={() => handlePreferences()}
            type="submit"
            className="mt-4 text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.serverToken) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  const serverInfo = await getServerInfo()
  return {
    props: { serverInfo, token: session.serverToken, role: session?.user?.role || 0, userUUID: session?.user?.uuid },
  }
}
