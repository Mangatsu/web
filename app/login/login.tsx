"use client"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import InputError from "../../components/InputError"
import { APIPathsV1, getApiUrl } from "../../lib/api/other"
import useServer from "../../lib/hooks/data/useServer"
import { LocalPreferences, setValue } from "../../lib/localStorage"
import { anonymousLoginFormResolver, loginFormResolver } from "../../lib/validations/resolvers"
import pkg from "../../package.json"
import { LoginResponse, Visibility } from "../../types/api"

export default function Login() {
  const { isLoading, server } = useServer()

  const {
    register: privateRegister,
    handleSubmit: loginUser,
    formState: { errors: userErrors },
    setValue: setFormValue,
    reset: privateReset,
  } = useForm({ resolver: loginFormResolver })

  const {
    register: restrictedRegister,
    handleSubmit: loginAnonymous,
    formState: { errors: anonymousErrors },
    reset: anonymousReset,
  } = useForm({ resolver: anonymousLoginFormResolver })

  const loginWithCredentials = async (fieldData: FieldValues) => {
    const expiresIn = fieldData.remember * 24 * 60 * 60
    const body = {
      username: fieldData.username,
      password: fieldData.password,
      session_name: `Web v${pkg.version}`,
      expires_in: expiresIn,
    }

    const res = await fetch(getApiUrl(APIPathsV1.Login), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      const resData: LoginResponse = await res.json()
      try {
        setValue(LocalPreferences.Expires, resData.ExpiresIn * 1000 + Date.now())
        setValue(LocalPreferences.Roles, resData.Role)
        setValue(LocalPreferences.UserUUID, resData.UUID)
      } catch (e) {
        console.error("Failed to set user info to browser's locale storage.")
      }
      window.location.assign("/")
    } else {
      privateReset()
      setFormValue("username", fieldData.username)
      setFormValue("remember", fieldData.remember)
      toast.error("Incorrect username or password.")
    }
  }

  const loginWithPassphrase = async (data: FieldValues) => {
    const body = {
      passphrase: data.passphrase,
    }

    const res = await fetch(getApiUrl(APIPathsV1.Login), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      const resData: LoginResponse = await res.json()
      try {
        setValue(LocalPreferences.Expires, resData.ExpiresIn * 1000 + Date.now())
      } catch (e) {
        console.error("Failed to set expired value to browser's locale storage.")
      }
      window.location.assign("/")
    } else {
      anonymousReset()
      toast.error("Incorrect passphrase.")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-24 text-sm md:text-md text-gray-500 w-96">
        <p>夢を葬り、門をくぐれ、月灯りの葉陰に闇が蠢く。</p>
        <p> Forgo your dreams, and step beyond, where shadows hide behind the moonlit leaves.</p>
      </div>
      <div className="flex flex-col lg:flex-row justify-center lg:space-x-12">
        <div className="w-96">
          <h3>Login</h3>
          <form onSubmit={loginUser((data) => loginWithCredentials(data))}>
            <label>Username</label>
            <input {...privateRegister("username", { required: true })} />
            <InputError error={userErrors.username} />
            <label>Password</label>
            <input {...privateRegister("password", { required: true })} type="password" />
            <InputError error={userErrors.password} />
            <label>Remember</label>
            <select {...privateRegister("remember")} className="mt-2 p-1 rounded-lg">
              <option value={60 * 60 * 24}>1 day</option>
              <option value={60 * 60 * 24 * 7}>7 days</option>
              <option value={60 * 60 * 24 * 31}>31 days</option>
              <option value={60 * 60 * 24 * 365}>365 days</option>
            </select>
            <input type="submit" value="Sign in with Credentials" className="cursor-pointer mt-6" />
          </form>
          {!isLoading && server?.Visibility === Visibility.Restricted && (
            <>
              <h4>OR</h4>
              <form onSubmit={loginAnonymous((data) => loginWithPassphrase(data))}>
                <label>Passphrase</label>
                <input {...restrictedRegister("passphrase", { required: true })} type="password" />
                <InputError error={anonymousErrors.passphrase} />
                <input type="submit" value="Sign in Anonymously" className="cursor-pointer" />
              </form>
            </>
          )}
        </div>
        <div className="w-96 mb-32">
          <h3>Register</h3>
          {server ? (
            server.Registrations ? (
              <p>Registration not implemented.</p>
            ) : (
              <p>Registration is disabled.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}
