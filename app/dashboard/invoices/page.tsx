import Pagination from '@/components/pagination'
import Search from '@/components/search'
import Table from '@/components/invoices/table'
import { CreateInvoice } from '@/components/invoices/buttons'
import { InvoicesTableSkeleton } from '@/components/skeletons'
import { Suspense } from 'react'
import { fetchInvoicesPages } from '@/lib/data'
import { Metadata } from 'next'
import { TypographyH2 } from '@/components/ui/typography'

const title = 'Invoices'
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

  const totalPages = await fetchInvoicesPages(query)

  return (
    <>
      <TypographyH2 text={title} />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
