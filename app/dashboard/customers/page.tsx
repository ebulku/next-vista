import { Metadata } from 'next'
import { Suspense } from 'react'

import { fetchFilteredCustomers } from '@/lib/data'

import CreateCustomer from '@/components/create-customer'
import CustomersTable from '@/components/customers/table'
import Search from '@/components/search'
import { InvoicesTableSkeleton } from '@/components/skeletons'
import { TypographyH2 } from '@/components/ui/typography'

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
        <CreateCustomer />
      </div>
      <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
        <CustomersTable customers={customers} />
      </Suspense>
    </>
  )
}
