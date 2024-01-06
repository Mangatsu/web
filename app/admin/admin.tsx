"use client"
import { notFound } from "next/navigation"
import useSWR from "swr"
import Layout from "../../components/Layout"
import NewUser from "../../components/NewUser"
import Users from "../../components/Users"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuUserResponse } from "../../lib/api/user"
import { Role } from "../../lib/helpers"
import { LocalPreferences, getValue } from "../../lib/localStorage"

export default function Admin() {
  const { data, mutate } = useSWR(APIPathsV1.Users, (key: string) => swrFetcher(key))

  const role = getValue(LocalPreferences.Roles)
  if (role < Role.Admin) {
    notFound()
  }

  const userUUID = getValue(LocalPreferences.UserUUID)

  const users = data?.Data ? (data as MangatsuUserResponse) : null
  return (
    <Layout subtitle="Administrative">
      <div className="flex flex-col justify-center ">
        <br />
        <h3>Administrative settings</h3>
        <div className="p-4 rounded bg-opacity-20 bg-black">
          <h4>New user</h4>
          <NewUser mutate={mutate} />
        </div>
        <div className="p-4 rounded bg-opacity-20 bg-black">
          <h4>Users</h4>
          {users && <Users users={users} userUUID={userUUID} mutate={mutate} />}
        </div>
      </div>
    </Layout>
  )
}
