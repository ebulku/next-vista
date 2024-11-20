import { Metadata } from 'next'
import { Suspense } from 'react'

import { fetchOrdersPages } from '@/lib/data'

import { CreateOrderButton } from '@/components/buttons'
import OrdersTable from '@/components/orders/table'
import Pagination from '@/components/pagination'
import Search from '@/components/search'
import { OrdersTableSkeleton } from '@/components/skeletons'
import { TypographyH2 } from '@/components/ui/typography'

const title = 'Orders'
export const metadata: Metadata = {
  title: title,
}
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchOrdersPages(query)

  return (
    <>
      <TypographyH2 text={title} />
      <div className="flex items-center justify-between gap-2 mt-2">
        <Search placeholder="Search Orders..." />
        <CreateOrderButton />
      </div>
      <Suspense key={query + currentPage} fallback={<OrdersTableSkeleton />}>
        <OrdersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
