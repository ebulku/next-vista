import { fetchCustomers, fetchInvoiceById } from '@/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import EditForm from '@/components/invoices/edit-form'

export const metadata: Metadata = {
  title: 'Edit Invoice',
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

  if (!invoice) {
    notFound()
  }

  return <EditForm invoice={invoice} customers={customers} />
}
