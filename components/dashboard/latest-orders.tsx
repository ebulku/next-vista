import Link from 'next/link'

import { fetchLatestOrders } from '@/lib/data'

import { UserAvatar } from '@/components/user-avatar'

export default async function LatestOrders() {
  const latestOrders = await fetchLatestOrders()
  return (
    <div className="space-y-8">
      {latestOrders.map((order) => {
        return (
          <div key={order.id} className="flex items-center">
            <UserAvatar
              imageUrl={order.customer?.imageUrl || undefined}
              name={order.customer?.name}
            />
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {order.customer?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customer?.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <Link href={`/dashboard/orders/${order.id}`} className="w-4">
                {order.title}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
