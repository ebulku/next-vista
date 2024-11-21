import CreateForm from '@/components/orders/create-form'
import { fetchCustomers } from '@/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Order',
}
export default async function Page() {
  const customers = await fetchCustomers()
  return <CreateForm customers={customers} />
}
