"use client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"
import OnOffSwitch from "../../components/OnOffSwitch"
import Sessions from "../../components/Sessions"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuSessionResponse, updateUser } from "../../lib/api/user"
import { LocalPreferences, getValue, setValue } from "../../lib/localStorage"

export default function Personal() {
  const [nsfwPref, setNsfwPref] = useState(false)
  const [langPref, setLangPref] = useState(false)
  const [seriesRandomPref, setSeriesRandomPref] = useState(false)
  const [userUUID, setUserUUID] = useState<string | null>(null)

  const { data, mutate } = useSWR(APIPathsV1.Sessions, (key) => swrFetcher(key))
  const response = data as MangatsuSessionResponse

  useEffect(() => {
    setNsfwPref(getValue(LocalPreferences.NSFWPref))
    setLangPref(getValue(LocalPreferences.LanguagePref))
    setSeriesRandomPref(getValue(LocalPreferences.SeriesRandomPref))
    setUserUUID(getValue(LocalPreferences.UserUUID))
  }, [])

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, nsfwPref)
    setValue(LocalPreferences.LanguagePref, langPref)
    setValue(LocalPreferences.SeriesRandomPref, seriesRandomPref)
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
    <>
      <div className="flex flex-col justify-center">
        <h3>Personal Settings</h3>
        <div className="grid grid-flow-col h-64">
          {userUUID && (
            <div className="p-4 rounded bg-opacity-20 bg-black mr-8">
              <h4>User</h4>
              <form onSubmit={(e) => handleUserUpdate(e)}>
                <label>New password</label>
                {/* Password forms should have (optionally hidden) username fields for accessibility. */}
                <input type="text" id="username" autoComplete="username" hidden />
                <input type="password" id="password" autoComplete="new-password" />
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
              <label>
                <OnOffSwitch checked={seriesRandomPref} onChange={setSeriesRandomPref} /> Include serialized galleries
                in the random selection (🎲)
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
          <Sessions sessions={response?.Data ?? []} mutate={mutate} currentSessionID={response?.CurrentSession ?? ""} />
        </div>
      </div>
    </>
  )
}
