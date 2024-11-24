import Link from 'next/link'

import { fetchFilteredOrders } from '@/lib/data'
import { formatCurrency, formatDateToLocal } from '@/lib/utils'

import {
  DeleteOrderButton,
  UpdateOrderButton,
  ViewOrderButton,
} from '@/components/buttons'
import InvoiceStatus from '@/components/status-badge'
import StatusBadge from '@/components/status-badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserAvatar } from '@/components/user-avatar'

export default async function OrdersTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const orders = await fetchFilteredOrders(query, currentPage)

  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {orders?.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar
                      imageUrl={order.customer?.imageUrl || undefined}
                      name={order.customer?.name}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {order.customer?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.email}
                      </p>
                    </div>
                  </div>
                  <InvoiceStatus status={order.status} />
                </CardHeader>
                <CardContent>
                  <Separator />
                  <div className="text-xl font-bold py-2">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      {order.title}
                    </Link>
                  </div>
                  <Separator />
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(order.amount || 0)}
                      </div>
                      <p className="text-muted-foreground">
                        {formatDateToLocal(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ViewOrderButton id={order.id} />
                      <UpdateOrderButton id={order.id} />
                      <DeleteOrderButton id={order.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Note</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      {order.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.customer && (
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          imageUrl={order.customer?.imageUrl || undefined}
                          name={order.customer?.name}
                        />
                        <p>{order.customer?.name}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(order.amount || 0)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs">
                    {order.notes[0]?.body.substring(0, 50)}...
                  </TableCell>
                  <TableCell>{formatDateToLocal(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <ViewOrderButton id={order.id} />
                      <UpdateOrderButton id={order.id} />
                      <DeleteOrderButton id={order.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
