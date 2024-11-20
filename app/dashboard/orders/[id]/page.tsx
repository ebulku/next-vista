// Redirect to the edit invoice page
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { fetchOrderById } from '@/lib/data'
import { formatCurrency, formatDateToLocal } from '@/lib/utils'

import { DeleteOrderButton, UpdateOrderButton } from '@/components/buttons'
import AddFile from '@/components/orders/add-file'
import AddNote from '@/components/orders/add-note'
import OrderTimeline from '@/components/orders/order-timeline'
import { OrderTimelineSkeleton } from '@/components/skeletons'
import StatusBadge from '@/components/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
  const order = await fetchOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-7 items-start">
      <Card className="lg:col-span-3 space-y-4 sticky top-0">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold">{order.title}</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex">
              <UpdateOrderButton id={id} />
              <DeleteOrderButton id={id} />
            </div>
          </div>
          <div className="flex items-center">
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
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-bold">
              {formatCurrency(order.amount || 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Created At: {formatDateToLocal(order.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-4 h-full sticky top-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Notes:{' '}
            <div className="flex items-center gap-2">
              <AddFile orderId={id} />
              <AddNote orderId={id} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <ScrollArea className="">
            <Suspense fallback={<OrderTimelineSkeleton />}>
              <OrderTimeline orderId={id} />
            </Suspense>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
