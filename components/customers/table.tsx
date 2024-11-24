import { fetchFilteredCustomers } from '@/lib/data'

import { DeleteCustomerButton } from '@/components/buttons'
import CreateCustomer from '@/components/customers/create-customer'
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

export default async function CustomersTable({ query }: { query: string }) {
  const customers = await fetchFilteredCustomers(query)
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden space-y-4">
            {customers?.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="flex flex-row items-center justify-between ">
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
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <CreateCustomer isIcon={true} customer={customer} />
                    <DeleteCustomerButton id={customer.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator />
                  <div className="flex w-full items-center justify-between py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Orders</p>
                      <p className="text-lg font-medium">
                        {customer.total_orders}
                      </p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Invoices</p>
                      <p className="text-lg font-medium">
                        {customer.total_invoices}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex w-full items-center justify-between py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Pending</p>
                      <p className="text-lg font-medium">
                        {customer.total_pending}
                      </p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Paid</p>
                      <p className="text-lg font-medium">
                        {customer.total_paid}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="pt-2">
                    <p className="text-sm font-medium">
                      Address: {customer.address}
                    </p>
                    <p className="text-sm font-medium">
                      Notes: {customer.description}
                    </p>
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
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Invoices</TableHead>
                <TableHead>Total Pending</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.description}</TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>{customer.total_invoices}</TableCell>
                  <TableCell>{customer.total_pending}</TableCell>
                  <TableCell>{customer.total_paid}</TableCell>
                  <TableCell>
                    <CreateCustomer isIcon={true} customer={customer} />
                    <DeleteCustomerButton id={customer.id} />
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
