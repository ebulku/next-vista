import {
  BanknoteIcon,
  BookCopyIcon,
  Clock2Icon,
  InboxIcon,
  UsersIcon,
} from 'lucide-react'

import {
  fetchCardData,
  fetchProductTotalCount,
  fetchProductWithSellersCount,
  fetchSellersProductsCount,
  fetchSellersTotalCount,
} from '@/lib/data'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const iconMap = {
  orders: BookCopyIcon,
  collected: BanknoteIcon,
  pending: Clock2Icon,
  invoices: InboxIcon,
  customers: UsersIcon,
}

export default async function CardWrapper() {
  const {
    numberOfOrders,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData()

  const totalProducts = await fetchProductTotalCount()
  const totalProductsWithSellers = await fetchProductWithSellersCount()
  const totalSellers = await fetchSellersTotalCount()
  const totalSellersProducts = await fetchSellersProductsCount()

  return (
    <>
      <CardObject title="Orders" value={numberOfOrders} type="orders" />
      <CardObject
        title="Collected"
        value={totalPaidInvoices}
        type="collected"
      />
      <CardObject title="Pending" value={totalPendingInvoices} type="pending" />
      <CardObject
        title="Total Invoices"
        value={numberOfInvoices}
        type="invoices"
      />
      <CardObject title="Total Products" value={totalProducts} type="orders" />
      <CardObject
        title="Products with Sellers"
        value={totalProductsWithSellers}
        type="orders"
      />
      <CardObject title="Total Sellers" value={totalSellers} type="customers" />
      <CardObject title="Leads" value={totalSellersProducts} type="customers" />
    </>
  )
}

export function CardObject({
  title,
  value,
  type,
}: {
  title: string
  value: number | string
  type: 'invoices' | 'customers' | 'pending' | 'collected' | 'orders'
}) {
  const Icon = iconMap[type]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  )
}
