import { Metadata } from 'next'
import { Suspense } from 'react'

import CardWrapper from '@/components/dashboard/dashboard-cards'
import LatestOrders from '@/components/dashboard/latest-orders'
import RevenueChart from '@/components/dashboard/revenue-chart'
import {
  CardsSkeleton,
  LatestOrdersSkeleton,
  RevenueChartSkeleton,
} from '@/components/skeletons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH2 } from '@/components/ui/typography'

const title = 'Dashboard'

export const metadata: Metadata = {
  title: title,
}

export default async function Page() {
  const isInvoicesPageActive = process.env.NEXT_PUBLIC_INVOICES_PAGE_ACTIVE
  const isOrdersPageActive = process.env.NEXT_PUBLIC_ORDERS_PAGE_ACTIVE

  return (
    <main className="space-y-4">
      <TypographyH2 text={title} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="grid gap-4 lg:grid-cols-7">
        {isInvoicesPageActive && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Revenue (demo)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pt-4">
              <Suspense fallback={<RevenueChartSkeleton />}>
                <RevenueChart />
              </Suspense>
            </CardContent>
          </Card>
        )}
        {isOrdersPageActive && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Latest Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Suspense fallback={<LatestOrdersSkeleton />}>
                <LatestOrders />
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
