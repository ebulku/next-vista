import Link from 'next/link'

import { fetchFilteredProducts } from '@/lib/data'
import { formatDateToLocal } from '@/lib/utils'

// import {
//   DeleteOrderButton,
//   UpdateOrderButton,
//   ViewOrderButton,
// } from '@/components/buttons'
// import InvoiceStatus from '@/components/status-badge'
// import StatusBadge from '@/components/status-badge'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { UserAvatar } from '@/components/user-avatar'
import { Link2Icon } from 'lucide-react'

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const products = await fetchFilteredProducts(query, currentPage)

  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {/* {orders?.map((order) => (
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
            ))} */}
          </div>
          <Table className="table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.flatMap((product) => {
                const rows = []

                // Main product row
                rows.push(
                  <TableRow
                    key={`product-${product.id}`}
                    className="bg-primary/5 border-l-4 border-l-primary font-semibold"
                  >
                    <TableCell className="font-bold">{product.name}</TableCell>
                    <TableCell className="font-semibold">
                      {product.price}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm"></TableCell>
                    <TableCell className="text-muted-foreground text-sm"></TableCell>
                    <TableCell>
                      {formatDateToLocal(product.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-3">
                        {product.url && (
                          <Link href={product.url} target="_blank">
                            <Link2Icon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )

                // Seller rows
                product.sellers.forEach((seller) => {
                  rows.push(
                    <TableRow
                      key={`seller-${product.id}-${seller.seller_id}`}
                      className="bg-muted/20 border-l-4 border-l-muted"
                    >
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>↪</span>
                          <span className="font-medium text-foreground">
                            {seller.seller.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm"></TableCell>
                      <TableCell>
                        {seller.seller.phone || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {seller.seller.address ? (
                          <span className="text-sm">
                            {seller.seller.address}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm"></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-3">
                          {seller.seller.url && (
                            <Link href={seller.seller.url} target="_blank">
                              <Link2Icon className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })

                return rows
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
