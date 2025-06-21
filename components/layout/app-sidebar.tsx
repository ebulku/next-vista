'use client'

import { BookCopy, HomeIcon, ListCollapseIcon, Users } from 'lucide-react'

import { NavProjects } from '@/components/layout/nav-projects'
import { NavUser } from '@/components/layout/nav-user'
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
import { ModeToggle } from '@/components/layout/mode-toggle'
import { User } from 'next-auth'
import AppLogo from './app-logo'

const data = {
  links: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: HomeIcon,
      show: true,
    },
    {
      name: 'Orders',
      url: '/dashboard/orders',
      icon: ListCollapseIcon,
      show: process.env.NEXT_PUBLIC_ORDERS_PAGE_ACTIVE === 'true',
    },
    {
      name: 'Invoices',
      url: '/dashboard/invoices',
      icon: BookCopy,
      show: process.env.NEXT_PUBLIC_INVOICES_PAGE_ACTIVE === 'true',
    },
    {
      name: 'Customers',
      url: '/dashboard/customers',
      icon: Users,
      show: process.env.NEXT_PUBLIC_CUSTOMERS_PAGE_ACTIVE === 'true',
    },
    {
      name: 'Sellers',
      url: '/dashboard/sellers',
      icon: Users,
      show: process.env.NEXT_PUBLIC_PRODUCTS_PAGE_ACTIVE === 'true',
    },
    {
      name: 'Walmart',
      url: '/dashboard/walmart',
      icon: ListCollapseIcon,
      show: process.env.NEXT_PUBLIC_PRODUCTS_PAGE_ACTIVE === 'true',
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
