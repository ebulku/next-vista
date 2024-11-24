import AppLogo from '@/components/layout/app-logo'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { GithubIcon } from 'lucide-react'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <AppLogo />
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lgpx-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl md:text-3xl md:leading-normal`}>
            <strong>Welcome to Next.js Dashboard.</strong> This is the example
            for the{' '}
            <a className="underline" href="https://nextjs.org/learn/">
              Next.js Learn Course
            </a>{' '}
            configured with{' '}
            <a className="underline" href="https://prisma.io/">
              Prisma
            </a>{' '}
            and{' '}
            <a className="underline" href="https://ui.shadcn.com/">
              Shadcn/Ui
            </a>
          </p>
          <div className="flex gap-2">
            <ModeToggle />
            <Button size="icon" asChild>
              <a
                href="https://github.com/ebulku/next-vista"
                target="_blank"
              >
                <GithubIcon />
              </a>
            </Button>
            <Button asChild>
              <Link href="/login" className="w-32">
                Log in
                <ArrowRightIcon className="w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <Image
            src="/dark-preview.png"
            width={1080}
            height={694}
            className="hidden dark:block"
            alt="Screenshot of the dashboard project showing Dark Mode"
          />
          <Image
            src="/light-preview.png"
            width={1080}
            height={694}
            className="block dark:hidden"
            alt="Screenshot of the dashboard project showing Light Mode"
          />
        </div>
      </div>
    </main>
  )
}
