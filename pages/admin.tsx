import { GetServerSideProps } from "next"
import useSWR from "swr"
import Layout from "../components/Layout"
import NewUser from "../components/NewUser"
import Users from "../components/Users"
import { swrFetch } from "../lib/api/other"
import { MangatsuUserResponse } from "../lib/api/user"
import { Role, decodeJWT, parseCookieHeader } from "../lib/helpers"

interface Props {
  userUUID: string | null
}

export default function Admin({ userUUID }: Props) {
  const { data, mutate } = useSWR("/users", (key: string) => swrFetch(key))

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwtCookie = parseCookieHeader("mtsu.jwt", context.req.headers.cookie)
  if (!jwtCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const decodedJWT = decodeJWT(jwtCookie)

  if (decodedJWT.Roles < Role.Admin) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      currentSessionID: decodedJWT.ID,
      userUUID: decodedJWT.Subject,
    },
  }
}
