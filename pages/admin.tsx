import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import useSWR from "swr"
import Layout from "../components/Layout"
import NewUser from "../components/NewUser"
import Users from "../components/Users"
import { getApiUrl } from "../lib/api/other"
import getServerInfo from "../lib/api/serverInfo"
import { fetchUsers } from "../lib/api/user"
import { decodeJWT, Role } from "../lib/helpers"
import { ServerInfo } from "../types"

interface Props {
  url: string
  serverInfo: ServerInfo
  token: string
}

export default function Settings({ url, serverInfo, token }: Props) {
  const { data: users, mutate } = useSWR(token, (token: string) => fetchUsers(url, token).then((r) => r.json()))

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
          {users && <Users users={users} token={token} mutate={mutate} />}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.user?.name) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  const payload = decodeJWT(session.user.name)
  if (payload.Roles < Role.Admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const serverInfo = await getServerInfo()
  return {
    props: { url: getApiUrl(), serverInfo, token: session.user.name },
  }
}
