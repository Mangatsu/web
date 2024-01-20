"use client"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { APIPathsV1, getApiUrl } from "../../lib/api/other"
import useServer from "../../lib/hooks/data/useServer"
import { LocalPreferences, setValue } from "../../lib/localStorage"
import pkg from "../../package.json"
import { LoginResponse, Visibility } from "../../types/api"

export default function Login() {
  const { isLoading, server } = useServer()

  const {
    register: privateRegister,
    handleSubmit: loginUser,
    formState: { errors: userErrors },
    reset: privateReset,
  } = useForm()

  const {
    register: restrictedRegister,
    handleSubmit: loginAnonymous,
    formState: { errors: anonymousErrors },
    reset: anonymousReset,
  } = useForm()

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
    <div className="flex flex-col items-center space-x-12">
      <div className="h-24 text-lg text-gray-500">
        <p>夢を葬り、門をくぐれ、月灯りの葉陰に闇が蠢く。</p>
        <p> Forgo your dreams, and step beyond, where shadows hide behind the moonlit leaves.</p>
      </div>
      <div className="flex flex-row justify-center space-x-12">
        <div className="w-96">
          <h3>Login</h3>
          <form onSubmit={loginUser((data) => loginWithCredentials(data))}>
            <label>Username</label>
            <input {...privateRegister("username", { required: true })} />
            {userErrors.username && <p>Username is required.</p>}
            <label>Password</label>
            <input {...privateRegister("password", { required: true })} type="password" />
            {userErrors.password && <p>Password is required.</p>}
            <label>Remember</label>
            <select {...privateRegister("remember")} className="mt-2 p-1 rounded-lg">
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={31}>31 days</option>
              <option value={365}>365 days</option>
            </select>
            <input type="submit" value="Sign in with Credentials" className="mt-6" />
          </form>
          {!isLoading && server?.Visibility === Visibility.Restricted && (
            <>
              <h4>OR</h4>
              <form onSubmit={loginAnonymous((data) => loginWithPassphrase(data))}>
                <label>Passphrase</label>
                <input {...restrictedRegister("passphrase", { required: true })} type="password" />
                {anonymousErrors.passphrase && <p>Passphrase is required.</p>}
                <input type="submit" value="Sign in Anonymously" />
              </form>
            </>
          )}
        </div>
        <div className="w-96">
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
