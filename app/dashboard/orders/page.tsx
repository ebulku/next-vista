import Search from '@/components/search'
import { InvoicesTableSkeleton } from '@/components/skeletons'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { TypographyH2 } from '@/components/ui/typography'
import Pagination from '@/components/pagination'
import { fetchOrdersPages } from '@/lib/data'
import OrdersTable from '@/components/orders/table'
import { CreateOrder } from '@/components/orders/buttons'

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
        <CreateOrder />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <OrdersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
