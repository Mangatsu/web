"use client"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import useSWR from "swr"
import withAuth from "../../components/HOC/WithAuth"
import InputError from "../../components/InputError"
import OnOffSwitch from "../../components/OnOffSwitch"
import Sessions from "../../components/Sessions"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuSessionResponse, updateUser } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import useUser from "../../lib/hooks/data/useUser"
import { LocalPreferences, setValue } from "../../lib/localStorage"
import { newPasswordFormResolver } from "../../lib/validations/resolvers"

function Personal() {
  const { uuid, preferences, setPreferences } = useUser()

  const { data: response, mutate } = useSWR<MangatsuSessionResponse>(APIPathsV1.Sessions, (key: string) =>
    swrFetcher(key),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: newPasswordFormResolver })

  const handleUserUpdate = async (fieldData: FieldValues) => {
    if (!uuid) {
      return
    }

    const userForm = {
      password: fieldData.password,
    }

    const response = await updateUser(uuid, userForm)
    if (response) {
      toast.success("User updated")
    } else {
      reset()
      toast.error("Failed to update user")
    }
  }

  const handlePreferences = () => {
    setValue(LocalPreferences.NSFWPref, preferences.NSFW)
    setValue(LocalPreferences.LanguagePref, preferences.Language)
    setValue(LocalPreferences.SeriesRandomPref, preferences.SeriesRandom)
    toast.success("Preferences saved")
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <h3>Personal Settings</h3>
        <div className="h-64 grid grid-flow-col">
          <div className="p-4 rounded bg-opacity-20 bg-black mr-8">
            <h4>User</h4>
            <form onSubmit={handleSubmit((e) => handleUserUpdate(e))}>
              <label>New password</label>
              {/* Password forms should have (optionally hidden) username fields for accessibility. */}
              <input type="text" id="username" autoComplete="username" hidden />
              <input {...register("password", { required: true })} type="password" autoComplete="new-password" />
              <InputError error={errors.password} />
              <input
                type="submit"
                value="Update"
                className="text-white focus:ring-4 font-medium rounded-lg text-sm w-28 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              />
            </form>
          </div>

          <div className="flex flex-col p-4 rounded bg-opacity-20 bg-black">
            <h4>Site</h4>
            <div className="grid gap-2">
              <OnOffSwitch
                checked={preferences.NSFW}
                onChange={(e) => {
                  setPreferences({ ...preferences, NSFW: e })
                }}
                labelRight="Hide NSFW results by default"
              />
              <OnOffSwitch
                checked={preferences.Language}
                onChange={(e) => {
                  setPreferences({ ...preferences, Language: e })
                }}
                labelRight="Show native titles when available"
              />
              <OnOffSwitch
                checked={preferences.SeriesRandom}
                onChange={(e) => {
                  setPreferences({ ...preferences, SeriesRandom: e })
                }}
                labelRight="Include serialized galleries in the random selection (🎲)"
              />
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
        <div className="p-4 rounded bg-opacity-20 bg-black" style={{ marginTop: "3vh" }}>
          <h4>Sessions</h4>
          <Sessions sessions={response?.Data ?? []} mutate={mutate} currentSessionID={response?.CurrentSession ?? ""} />
        </div>
      </div>
    </>
  )
}

export default withAuth(Personal, true, Role.Viewer)
