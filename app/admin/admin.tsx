"use client"
import useSWR from "swr"
import NewUserForm from "../../components/Forms/NewUserForm"
import withAuth from "../../components/HOC/WithAuth"
import Users from "../../components/Users"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuUserResponse } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import useUser from "../../lib/hooks/data/useUser"

function Admin() {
  const { uuid } = useUser()
  const { data, mutate } = useSWR(APIPathsV1.Users, (key: string) => swrFetcher(key))

  const users = data?.Data ? (data as MangatsuUserResponse) : null

  return (
    <div className="flex flex-col justify-center ">
      <br />
      <h3>Administrative settings</h3>
      <div className="p-4 rounded bg-opacity-20 bg-black">
        <h4>New user</h4>
        <NewUserForm mutate={mutate} />
      </div>
      <div className="p-4 rounded bg-opacity-20 bg-black">
        <h4>Users</h4>
        {users && <Users users={users} userUUID={uuid} mutate={mutate} />}
      </div>
    </div>
  )
}

export default withAuth(Admin, true, Role.Admin)
