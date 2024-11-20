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
  return (
    <main className="space-y-4">
      <TypographyH2 text={title} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="grid gap-4 lg:grid-cols-7">
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
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<LatestOrdersSkeleton />}>
              <LatestOrders />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
