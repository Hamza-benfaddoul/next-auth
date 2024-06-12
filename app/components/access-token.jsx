import { useSession, signIn, signOut } from "next-auth/react"
import { userId } from "next-auth/react"

export default function AccessToken() {
  const { data } = useSession();

  if(!data)
    return <div>Not signed in</div>
  const { accessToken } = data;

  return<> <div>Access Token: {accessToken}</div>
    <hr/>
    <div> Data: {JSON.stringify(data)}</div>
    <hr/>
    <div> userId: {userId} </div>
    </>
}
