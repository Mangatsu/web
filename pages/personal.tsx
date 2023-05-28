import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"
import Layout from "../components/Layout"
import OnOffSwitch from "../components/OnOffSwitch"
import Sessions from "../components/Sessions"
import { APIPathsV1, swrFetcher } from "../lib/api/other"
import { MangatsuSessionResponse, updateUser } from "../lib/api/user"
import { decodeJWT, parseCookieHeader } from "../lib/helpers"
import { LocalPreferences, getValue, setValue } from "../lib/localStorage"

interface Props {
  currentSessionID: string
  userUUID: string
}

export default function Personal({ currentSessionID, userUUID }: Props) {
  const [nsfwPref, setNsfwPref] = useState(false)
  const [langPref, setLangPref] = useState(false)

  const { data, mutate } = useSWR(APIPathsV1.Sessions, (key) => swrFetcher(key))
  const response = data as MangatsuSessionResponse

  useEffect(() => {
    setNsfwPref(getValue(LocalPreferences.NSFWPref))
    setLangPref(getValue(LocalPreferences.LanguagePref))
  }, [])

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, nsfwPref)
    setValue(LocalPreferences.LanguagePref, langPref)
    toast.success("Preferences saved")
  }

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userUUID) {
      return
    }

    const target = e.target as typeof e.target & { password: { value: string }; role: { value: number } }
    const userForm = { password: target.password.value }

    const response = await updateUser(userUUID, userForm)
    if (response) {
      toast.success("User updated")
    } else {
      toast.error("Failes to update user")
    }
  }

  return (
    <Layout subtitle="Personal">
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
            <div className="grid gap-2">
              <label>
                <OnOffSwitch checked={nsfwPref} onChange={setNsfwPref} /> Hide NSFW results by default
              </label>
              <label>
                <OnOffSwitch checked={langPref} onChange={setLangPref} /> Show native titles when available
              </label>
            </div>
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
          <Sessions sessions={response?.Data ?? []} mutate={mutate} currentSessionID={currentSessionID} />
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwtCookie = parseCookieHeader("mtsu.jwt", context.req.headers.cookie)
  if (!jwtCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const decodedJWT = decodeJWT(jwtCookie)

  return {
    props: {
      currentSessionID: decodedJWT.ID,
      userUUID: decodedJWT.Subject,
    },
  }
}
