'use client'

import { BookCopy, HomeIcon, ListCollapseIcon, Users } from 'lucide-react'

import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { User } from 'next-auth'
import AppLogo from './app-logo'

const data = {
  links: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Orders',
      url: '/dashboard/orders',
      icon: ListCollapseIcon,
    },
    {
      name: 'Invoices',
      url: '/dashboard/invoices',
      icon: BookCopy,
    },
    {
      name: 'Customers',
      url: '/dashboard/customers',
      icon: Users,
    },
  ],
}

export function AppSidebar({ user }: { user: User | undefined }) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2">
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <AppLogo />
                </Link>
              </SidebarMenuButton>
              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects links={data.links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
