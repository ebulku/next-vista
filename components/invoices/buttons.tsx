import { deleteInvoice } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { PencilLineIcon, PlusCircle, TrashIcon } from 'lucide-react'
import Link from 'next/link'

export function CreateInvoice() {
  return (
    <Button asChild>
      <Link href="/dashboard/invoices/create">
        <PlusCircle />
        Create Invoice
      </Link>
    </Button>
  )
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Button asChild>
      <Link href={`/dashboard/invoices/${id}/edit`}>
        <span className="sr-only">Edit</span>
        <PencilLineIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id)
  return (
    <form action={deleteInvoiceWithId}>
      <Button>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  )
}
