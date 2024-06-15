import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'

const SettingsPage = async () => {
  const router = useRouter();
  const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'
          await signOut()
          router.push('/')
        }}
      >
        <Button type='submit'>Sign Out</Button>
      </form>
    </div>
  )
}

export default SettingsPage
