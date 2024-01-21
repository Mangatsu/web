import { useState } from "react"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { MangatsuUserResponse, deleteUser } from "../lib/api/user"
import { Role, getRole } from "../lib/helpers"
import UpdateUserForm from "./Forms/UpdateUserForm"
import OnOffSwitch from "./OnOffSwitch"
import PopupLarge from "./PopupLarge"

interface Props {
  users: MangatsuUserResponse
  userUUID: string | null
  mutate: KeyedMutator<unknown>
}

const Users = ({ users, userUUID, mutate }: Props) => {
  const [overrideAdminDelete, setOverrideAdminDelete] = useState(false)

  const handleDelete = async (uuid: string) => {
    const response = await deleteUser(uuid)
    if (response) {
      mutate()
      toast.success("User deleted")
    } else {
      toast.error("User could not be deleted")
    }
  }

  return (
    <div className="flex flex-col">
      <OnOffSwitch
        checked={overrideAdminDelete}
        onChange={(e) => setOverrideAdminDelete(e)}
        labelRight="Allow deletion of admin users"
      />

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
                        <UpdateUserForm user={user} mutate={mutate} />
                      </PopupLarge>
                      {" - "}
                      {(!overrideAdminDelete && user.Role >= Role.Admin) || user.UUID === userUUID ? (
                        <span className="text-gray-600">Delete</span>
                      ) : (
                        <a
                          onClick={() => handleDelete(user.UUID)}
                          className=" hover:text-blue-900 text-blue-500 hover:underline cursor-pointer"
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
