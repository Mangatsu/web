"use client"
import { useRouter } from "next/navigation"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { APIPathsV1, getApiUrl } from "../../lib/api/other"
import { LocalPreferences, setValue } from "../../lib/localStorage"
import pkg from "../../package.json"
import { LoginResponse } from "../../types/api"

export default function Login() {
  const {
    register: privateRegister,
    handleSubmit: loginUser,
    formState: { errors: userErrors },
    reset: privateReset,
  } = useForm()

  const router = useRouter()

  const {
    register: restrictedRegister,
    handleSubmit: loginAnonymous,
    formState: { errors: anonymousErrors },
    reset: anonymousReset,
  } = useForm()

  const loginWithCredentials = async (data: FieldValues) => {
    const expiresIn = data.remember * 24 * 60 * 60
    const body = {
      username: data.username,
      password: data.password,
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
      const data: LoginResponse = await res.json()
      try {
        setValue(LocalPreferences.Expires, data.ExpiresIn * 1000 + Date.now())
        setValue(LocalPreferences.Roles, data.Role)
        setValue(LocalPreferences.UserUUID, data.UUID)
      } catch (e) {
        console.error("Failed to set user info to browser's locale storage.")
      }
      router.push("/")
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
      router.push("/")
    } else {
      anonymousReset()
      toast.error("Incorrect passphrase.")
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={loginUser((data) => loginWithCredentials(data))}>
        <label>Username</label>
        <input {...privateRegister("username", { required: true })} />
        {userErrors.username && <p>Username is required.</p>}
        <label>Password</label>
        <input {...privateRegister("password", { required: true })} type="password" />
        {userErrors.password && <p>Password is required.</p>}
        <label>Remember</label>
        <select {...privateRegister("remember")}>
          <option value={1}>A day</option>
          <option value={7}>A week</option>
          <option value={31}>A month</option>
          <option value={365}>An year</option>
        </select>
        <input type="submit" value="Sign in with Credentials" />
      </form>
      <h4>OR</h4>
      <form onSubmit={loginAnonymous((data) => loginWithPassphrase(data))}>
        <label>Passphrase</label>
        <input {...restrictedRegister("passphrase", { required: true })} type="password" />
        {anonymousErrors.passphrase && <p>Passphrase is required.</p>}
        <input type="submit" value="Sign in Anonymously" />
      </form>
    </>
  )
}
