import { FormattedCustomersTable } from '@/types'
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
import { UserAvatar } from '@/components/user-avatar'

export default async function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[]
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {customers?.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar
                      imageUrl={customer.imageUrl || undefined}
                      name={customer.name}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator />
                  <div className="flex w-full items-center justify-between py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Pending</p>
                      <p className="font-medium">{customer.total_pending}</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Paid</p>
                      <p className="font-medium">{customer.total_paid}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="pt-4 text-sm">
                    <p>{customer.total_invoices} invoices</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Invoices</TableHead>
                <TableHead>Total Pending</TableHead>
                <TableHead>Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        imageUrl={customer.imageUrl || undefined}
                        name={customer.name}
                      />
                      <p>{customer.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.total_invoices}</TableCell>
                  <TableCell>{customer.total_pending}</TableCell>
                  <TableCell>{customer.total_paid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
