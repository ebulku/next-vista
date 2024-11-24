import AppLogo from '@/components/app-logo'
import { LoginForm } from '@/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg border border-black dark:border-blue-400  p-3 md:h-36">
          <AppLogo />
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
