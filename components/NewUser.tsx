import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { newUser } from "../lib/api/user"
import { Role } from "../lib/helpers"

interface Props {
  mutate: KeyedMutator<unknown>
}

const NewUser = ({ mutate }: Props) => {
  const newUserHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
      role: { value: number }
    }
    const registerForm = {
      username: target.username.value,
      password: target.password.value,
      role: target.role.value,
    }
    const response = await newUser(registerForm)
    if (response) {
      mutate()
      toast.success("User created successfully")
    } else {
      toast.error("User creation failed. Is the username already in use?")
    }
  }

  return (
    <form onSubmit={(e) => newUserHandler(e)}>
      <div className="grid grid-flow-col gap-8 mb-6">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium  text-gray-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            minLength={2}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            minLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-2 text-sm font-medium  text-gray-300">
            Role
          </label>
          <select
            id="role"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            required
          >
            <option value={Role.Viewer}>Viewer</option>
            <option value={Role.Member}>Member</option>
            <option value={Role.Admin}>Admin</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      >
        Create
      </button>
    </form>
  )
}

export default NewUser
