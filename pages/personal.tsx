import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"
import Layout from "../components/Layout"
import OnOffSwitch from "../components/OnOffSwitch"
import Sessions from "../components/Sessions"
import getServerInfo from "../lib/api/serverInfo"
import { fetchSessions, MangatsuSessionResponse, updateUser } from "../lib/api/user"
import { decodeJWT } from "../lib/helpers"
import { getValue, LocalPreferences, setValue } from "../lib/localStorage"
import { ServerInfo } from "../types/api"

interface Props {
  serverInfo: ServerInfo
  currentSessionID: string
  token: string
  userUUID: string | null
}

export default function Personal({ serverInfo, currentSessionID, token, userUUID }: Props) {
  const [nsfwPref, setNsfwPref] = useState(false)
  const { data, mutate } = useSWR(token, (token: string) => fetchSessions(token).then((r) => r.json()))
  const sessions = data as MangatsuSessionResponse

  useEffect(() => {
    setNsfwPref(getValue(LocalPreferences.NSFWPref))
  }, [])

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, nsfwPref)
    toast.success("Preferences saved")
  }

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userUUID) {
      return
    }

    const target = e.target as typeof e.target & { password: { value: string }; role: { value: number } }
    const userForm = { password: target.password.value }

    const response = await updateUser(token, userUUID, userForm)
    if (response) {
      toast.success("User updated")
    } else {
      toast.error("Failes to update user")
    }
  }

  return (
    <Layout serverInfo={serverInfo} subtitle="Personal">
      <div className="flex flex-col justify-center">
        <h3>Personal Settings</h3>
        <div className="grid grid-flow-col h-64">
          {userUUID && (
            <div className="p-4 rounded bg-opacity-20 bg-black mr-8">
              <h4>User</h4>
              <form onSubmit={(e) => handleUserUpdate(e)}>
                <label>New password</label>
                <input type="password" id="password" />
                <button
                  type="submit"
                  className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                >
                  Update
                </button>
              </form>
            </div>
          )}
          <div className="flex flex-col p-4 rounded bg-opacity-20 bg-black">
            <h4>Site</h4>
            <label>
              Hide NSFW results by default? <OnOffSwitch checked={nsfwPref} onChange={setNsfwPref} />
            </label>
            <button
              onClick={() => handlePreferences()}
              type="submit"
              className="mt-4 w-24 text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              Save
            </button>
          </div>
        </div>
        <br />
        <div className="p-4 rounded bg-opacity-20 bg-black">
          <h4>Sessions</h4>
          <Sessions sessions={sessions} mutate={mutate} token={token} currentSessionID={currentSessionID} />
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

  const currentSessionID = decodeJWT(session.serverToken).ID

  const serverInfo = await getServerInfo()
  return {
    props: {
      serverInfo,
      currentSessionID,
      token: session.serverToken,
      userUUID: session?.user?.uuid || null,
    },
  }
}
