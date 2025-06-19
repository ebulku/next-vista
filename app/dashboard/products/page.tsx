import { Metadata } from 'next'
import { Suspense } from 'react'

import { fetchProductPages } from '@/lib/data'

import Pagination from '@/components/pagination'
import Search from '@/components/search'
import { OrdersTableSkeleton } from '@/components/skeletons'
import { TypographyH2 } from '@/components/ui/typography'
import { notFound } from 'next/navigation'
import ProductsTable from '@/components/products/table'

const title = 'Products'
export const metadata: Metadata = {
  title: title,
}
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const isProductsPageActive = process.env.NEXT_PUBLIC_PRODUCTS_PAGE_ACTIVE

  if (!isProductsPageActive) {
    notFound()
  }

  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchProductPages(query)

  return (
    <>
      <TypographyH2 text={title} />
      <div className="flex items-center justify-between gap-2 mt-2">
        <Search placeholder="Search Products..." />
        {/* <CreateOrderButton /> */}
      </div>
      <Suspense key={query + currentPage} fallback={<OrdersTableSkeleton />}>
        <ProductsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
