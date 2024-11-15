import { formatDateToLocal, formatCurrency } from '@/lib/utils'

import { UpdateInvoice, DeleteInvoice } from '@/components/invoices/buttons'
import InvoiceStatus from '@/components/status-badge'
import { fetchFilteredInvoices } from '@/lib/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import StatusBadge from '@/components/status-badge'
import { UserAvatar } from '@/components/user-avatar'

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {invoices?.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar
                      imageUrl={invoice.customer.imageUrl || undefined}
                      name={invoice.customer.name}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {invoice.customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer.email}
                      </p>
                    </div>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </CardHeader>
                <CardContent>
                  <Separator />
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(invoice.amount)}
                      </div>
                      <p className="text-muted-foreground">
                        {formatDateToLocal(invoice.date)}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        imageUrl={invoice.customer.imageUrl || undefined}
                        name={invoice.customer.name}
                      />
                      <p>{invoice.customer.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.customer.email}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{formatDateToLocal(invoice.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
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
