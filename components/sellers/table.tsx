import Link from 'next/link'

import { fetchFilteredSellers } from '@/lib/data'
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

export default async function SellersTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const sellers = await fetchFilteredSellers(query, currentPage)

  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <Table className="table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead># Reviews</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers?.flatMap((seller) => {
                const rows = []

                // Main product row
                rows.push(
                  <TableRow
                    key={`product-${seller.id}`}
                    className="bg-primary/5 border-l-4 border-l-primary font-semibold"
                  >
                    <TableCell className="font-bold">{seller.name}</TableCell>
                    <TableCell className="font-semibold">
                      {seller.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {seller.address}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      0
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {seller._count.products}
                    </TableCell>
                    <TableCell>
                      {formatDateToLocal(seller.createdAt, 'en-US')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-3">
                        {seller.url && (
                          <Link href={seller.url} target="_blank">
                            <Link2Icon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
                return rows
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
