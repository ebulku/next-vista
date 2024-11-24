import { auth } from '@/auth'
import { AppSidebar } from '@/components/layout/app-sidebar'
import BreadcrumbNav from '@/components/layout/breadcrumb-nav'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const info = await auth()
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar user={info?.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-2 overflow-scroll">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
