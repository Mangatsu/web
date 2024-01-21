import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { updateUser } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import { newUserFormResolver } from "../../lib/validations/resolvers"
import { MangatsuUser } from "../../types/api"
import InputError from "../InputError"

interface Props {
  user: MangatsuUser
  mutate?: KeyedMutator<unknown>
}

const UpdateUserForm = ({ user, mutate }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: newUserFormResolver })

  const updateUserHandler = async (fieldData: FieldValues) => {
    const userForm = {
      username: fieldData.username,
      password: fieldData.password,
      role: fieldData.role,
    }

    const response = await updateUser(user.UUID, userForm)
    if (response) {
      if (mutate) {
        mutate()
      }
      toast.success("User updated")
    } else {
      toast.error("Failed to update user")
    }
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit((e) => {
        console.log("Form submitted")
        updateUserHandler(e)
      })}
    >
      <input
        {...register("username", { required: true })}
        defaultValue={user.Username}
        type="text"
        autoComplete="username"
      />
      <label>New password</label>
      <input {...register("password", { required: true })} type="password" autoComplete="new-password" />
      <InputError error={errors.password} />
      <label>Role</label>
      <select
        {...register("role", { required: true })}
        className="shadow-sm border text-sm rounded-lg block w-full p-2 mb-4   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
      >
        <option selected={user.Role === Role.Viewer} value={Role.Viewer}>
          Viewer
        </option>
        <option selected={user.Role === Role.Member} value={Role.Member}>
          Member
        </option>
        <option selected={user.Role === Role.Admin} value={Role.Admin}>
          Admin
        </option>
      </select>
      <InputError error={errors.role} />
      <input
        type="submit"
        value="Update"
        className="text-white focus:ring-4 font-medium rounded-lg text-sm w-32 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      />
    </form>
  )
}

export default UpdateUserForm
