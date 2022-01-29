import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import useSWR from "swr"
import Layout from "../components/Layout"
import NewUser from "../components/NewUser"
import Users from "../components/Users"
import getServerInfo from "../lib/api/serverInfo"
import { fetchUsers, MangatsuUserResponse } from "../lib/api/user"
import { Role } from "../lib/helpers"
import { ServerInfo } from "../types/api"

interface Props {
  serverInfo: ServerInfo
  token: string
  userUUID: string | null
}

export default function Admin({ serverInfo, token, userUUID }: Props) {
  const { data, mutate } = useSWR(token, (token: string) => fetchUsers(token).then((r) => r.json()))
  const users = data as MangatsuUserResponse

  return (
    <Layout serverInfo={serverInfo} subtitle="Administrative">
      <div className="flex flex-col justify-center ">
        <br />
        <h3>Administrative settings</h3>
        <div className="p-4 rounded bg-opacity-20 bg-black">
          <h4 className="pb-4">New user</h4>
          <NewUser token={token} mutate={mutate} />
        </div>
        <div className="p-4 rounded bg-opacity-20 bg-black">
          <h4>Users</h4>
          {users && <Users users={users} token={token} userUUID={userUUID} mutate={mutate} />}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.serverToken) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  if (session?.user?.role && session.user.role < Role.Admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const serverInfo = await getServerInfo()
  return {
    props: { serverInfo, token: session.serverToken, userUUID: session?.user?.uuid || null },
  }
}
