import Link from 'next/link'

import { fetchFilteredProducts } from '@/lib/data'
import { formatDateToLocal } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateToLocal(seller.createdAt)}
                      </TableCell>
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
