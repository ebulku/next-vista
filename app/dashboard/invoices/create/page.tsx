import CreateForm from '@/components/invoices/create-form'
import { fetchCustomers } from '@/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Invoice',
}
export default async function Page() {
  const customers = await fetchCustomers()
  return <CreateForm customers={customers} />
}
