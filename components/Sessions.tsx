import Link from "next/link"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { deleteSession } from "../lib/api/user"
import { MangatsuSession } from "../types/api"

interface Props {
  sessions: MangatsuSession[]
  currentSessionID: string
  token: string
  mutate: KeyedMutator<unknown>
}

const Sessions = ({ sessions, currentSessionID, token, mutate }: Props) => {
  const handleDelete = async (sessionID: string) => {
    const response = await deleteSession(token, sessionID)
    if (response) {
      mutate()
      toast.success("Session deleted")
    } else {
      toast.error("Session could not be deleted")
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
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Expires At</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.ID} className="border-b bg-gray-800 border-gray-700">
                    <td>{session.ID}</td>
                    <td className="whitespace-nowrap">{session.Name}</td>
                    <td className="whitespace-nowrap">{session.ExpiresAt}</td>
                    <td className="p-4 text-sm font-medium text-right whitespace-nowrap">
                      {currentSessionID === session.ID ? (
                        <Link href="/api/auth/signout">
                          <a className=" hover:text-blue-900 text-blue-500 hover:underline">Logout</a>
                        </Link>
                      ) : (
                        <a
                          onClick={() => handleDelete(session.ID)}
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

export default Sessions
