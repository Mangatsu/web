"use client"
import { notFound } from "next/navigation"
import { useEffect } from "react"
import useSWR from "swr"
import NewUser from "../../components/NewUser"
import Users from "../../components/Users"
import { APIPathsV1, swrFetcher } from "../../lib/api/other"
import { MangatsuUserResponse } from "../../lib/api/user"
import useUser from "../../lib/hooks/data/useUser"

export default function Admin() {
  const { loading, isAdmin, isUser, uuid } = useUser()
  const { data, mutate } = useSWR(APIPathsV1.Users, (key: string) => swrFetcher(key))

  useEffect(() => {
    if (!loading && !isAdmin) {
      notFound()
    }
  }, [loading, isAdmin])

  if (loading || !isUser) {
    return null
  }

  const users = data?.Data ? (data as MangatsuUserResponse) : null

  return (
    <div className="flex flex-col justify-center ">
      <br />
      <h3>Administrative settings</h3>
      <div className="p-4 rounded bg-opacity-20 bg-black">
        <h4>New user</h4>
        <NewUser mutate={mutate} />
      </div>
      <div className="p-4 rounded bg-opacity-20 bg-black">
        <h4>Users</h4>
        {users && <Users users={users} userUUID={uuid} mutate={mutate} />}
      </div>
    </div>
  )
}
