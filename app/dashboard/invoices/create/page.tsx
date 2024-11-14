import Form from '@/app/ui/invoices/create-form'
import { fetchCustomers } from '@/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Invoice',
}
export default async function Page() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Form customers={customers} />
    </main>
  )
}
