"use client"
import { toast } from "react-toastify"
import useSWR from "swr"
import withAuth from "../../components/HOC/WithAuth"
import OnOffSwitch from "../../components/OnOffSwitch"
import Sessions from "../../components/Sessions"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuSessionResponse, updateUser } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import useUser from "../../lib/hooks/data/useUser"
import { LocalPreferences, setValue } from "../../lib/localStorage"

function Personal() {
  const { uuid, preferences, setPreferences } = useUser()

  const { data: response, mutate } = useSWR<MangatsuSessionResponse>(APIPathsV1.Sessions, (key: string) =>
    swrFetcher(key),
  )

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, preferences.NSFW)
    setValue(LocalPreferences.LanguagePref, preferences.Language)
    setValue(LocalPreferences.SeriesRandomPref, preferences.SeriesRandom)
    toast.success("Preferences saved")
  }

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!uuid) {
      return
    }

    const target = e.target as typeof e.target & { password: { value: string }; role: { value: number } }
    const userForm = { password: target.password.value }

    const response = await updateUser(uuid, userForm)
    if (response) {
      toast.success("User updated")
    } else {
      toast.error("Failed to update user")
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <h3>Personal Settings</h3>
        <div className="grid grid-flow-col h-64">
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

          <div className="flex flex-col p-4 rounded bg-opacity-20 bg-black">
            <h4>Site</h4>
            <div className="grid gap-2">
              <label>
                <OnOffSwitch
                  checked={preferences.NSFW}
                  onChange={(e) => {
                    setPreferences({ ...preferences, NSFW: e })
                  }}
                />
                Hide NSFW results by default
              </label>
              <label>
                <OnOffSwitch
                  checked={preferences.Language}
                  onChange={(e) => {
                    setPreferences({ ...preferences, Language: e })
                  }}
                />
                Show native titles when available
              </label>
              <label>
                <OnOffSwitch
                  checked={preferences.SeriesRandom}
                  onChange={(e) => {
                    setPreferences({ ...preferences, SeriesRandom: e })
                  }}
                />
                Include serialized galleries in the random selection (🎲)
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

export default withAuth(Personal, true, Role.Viewer)
