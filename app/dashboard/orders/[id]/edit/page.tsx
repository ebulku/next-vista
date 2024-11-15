import { fetchCustomers, fetchInvoiceById, fetchOrderById } from '@/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import EditForm from '@/components/orders/edit-form'

export const metadata: Metadata = {
  title: 'Edit Invoice',
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const [order, customers] = await Promise.all([
    fetchOrderById(id),
    fetchCustomers(),
  ])

  if (!order) {
    notFound()
  }

  return <EditForm order={order} customers={customers} />
}
