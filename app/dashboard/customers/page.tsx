import { Metadata } from 'next'
import { Suspense } from 'react'

import CreateCustomer from '@/components/customers/create-customer'
import CustomersTable from '@/components/customers/table'
import Search from '@/components/search'
import { CustomerTableSkeleton } from '@/components/skeletons'
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

  return (
    <>
      <TypographyH2 text={title} />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Customers..." />
        <CreateCustomer />
      </div>
      <Suspense key={query} fallback={<CustomerTableSkeleton />}>
        <CustomersTable query={query} />
      </Suspense>
    </>
  )
}
