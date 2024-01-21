import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { newUser } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import { newUserFormResolver } from "../../lib/validations/resolvers"
import InputError from "../InputError"

interface Props {
  mutate: KeyedMutator<unknown>
}

const NewUserForm = ({ mutate }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: newUserFormResolver })

  const newUserHandler = async (fieldData: FieldValues) => {
    const registerForm = {
      username: fieldData.username,
      password: fieldData.password,
      role: fieldData.role,
    }

    const response = await newUser(registerForm)
    if (response) {
      mutate()
      toast.success("User created successfully")
      reset()
    } else {
      reset()
      toast.error("User creation failed. Is the username already in use?")
    }
  }

  return (
    <form onSubmit={handleSubmit((e) => newUserHandler(e))}>
      <div className="grid grid-flow-col gap-8 mb-6">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium  text-gray-300">
            Username
          </label>
          <input
            {...register("username", { required: true })}
            type="text"
            autoComplete="username"
            minLength={2}
            maxLength={32}
            required
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
          />
          <InputError error={errors.username} />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={512}
            required
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
          />
          <InputError error={errors.password} />
        </div>
        <div>
          <label htmlFor="role" className="block mb-2 text-sm font-medium  text-gray-300">
            Role
          </label>
          <select
            {...register("role", { required: true })}
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
          >
            <option value={Role.Viewer}>Viewer</option>
            <option value={Role.Member}>Member</option>
            <option value={Role.Admin}>Admin</option>
          </select>
          <InputError error={errors.role} />
        </div>
      </div>
      <input
        type="submit"
        value="Create"
        className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      />
    </form>
  )
}

export default NewUserForm
