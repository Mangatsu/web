import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { deleteUser, MangatsuUserResponse, updateUser } from "../lib/api/user"
import { getRole, Role } from "../lib/helpers"
import PopupLarge from "./PopupLarge"

interface Props {
  users: MangatsuUserResponse
  token: string
  userUUID: string | null
  mutate: KeyedMutator<unknown>
}

const Users = ({ users, token, userUUID, mutate }: Props) => {
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, uuid: string) => {
    e.preventDefault()
    const target = e.target as typeof e.target & { password: { value: string }; role: { value: number } }
    const userForm = { password: target.password.value, role: target.role.value }

    const response = await updateUser(token, uuid, userForm)
    if (response) {
      mutate()
      toast.success("User updated")
    } else {
      toast.error("Failed to update user")
    }
  }

  const handleDelete = async (uuid: string) => {
    const response = await deleteUser(token, uuid)
    if (response) {
      mutate()
      toast.success("User deleted")
    } else {
      toast.error("User could not be deleted")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col">UUID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Role</th>
                  <th scope="col" className="relative py-3 px-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.Data.map((user) => (
                  <tr key={user.UUID} className="border-b bg-gray-800 border-gray-700">
                    <td>{user.UUID}</td>
                    <td className="whitespace-nowrap">{user.Username}</td>
                    <td className="whitespace-nowrap">{getRole(user.Role)}</td>
                    <td className="p-4 text-sm font-medium text-right whitespace-nowrap">
                      <PopupLarge
                        activator={
                          <button type="button" className="hover:text-blue-900 text-blue-500 hover:underline">
                            Edit
                          </button>
                        }
                      >
                        <p>
                          Editing <span className="font-bold">{user.Username}</span>
                        </p>
                        <form className="max-w-xs" onSubmit={(e) => handleUpdate(e, user.UUID)}>
                          <label>New password</label>
                          <input type="password" id="password" />
                          <label>Role</label>
                          <select
                            id="role"
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
                          <button
                            type="submit"
                            className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                          >
                            Update
                          </button>
                        </form>
                      </PopupLarge>
                      {" - "}
                      {user.Role >= Role.Admin || user.UUID === userUUID ? (
                        <span className="text-gray-600">Delete</span>
                      ) : (
                        <a
                          onClick={() => handleDelete(user.UUID)}
                          className=" hover:text-blue-900 text-blue-500 hover:underline"
                        >
                          Delete
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
