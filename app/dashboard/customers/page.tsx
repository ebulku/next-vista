import { fetchFilteredCustomers } from '@/lib/data'
import { Metadata } from 'next'
import { TypographyH2 } from '@/components/ui/typography'
import Search from '@/components/search'
import { Suspense } from 'react'
import { InvoicesTableSkeleton } from '@/components/skeletons'
import CustomersTable from '@/components/customers/table'

const title = 'Customers'
export const metadata: Metadata = {
  title,
}

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''

  const customers = await fetchFilteredCustomers(query)

  return (
    <>
      <TypographyH2 text={title} />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Customers..." />
      </div>
      <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
        <CustomersTable customers={customers} />
      </Suspense>
    </>
  )
}
