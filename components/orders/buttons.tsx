import { deleteInvoice } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { EyeIcon, PencilLineIcon, PlusCircle, TrashIcon } from 'lucide-react'
import Link from 'next/link'

export function CreateOrder() {
  return (
    <Button asChild>
      <Link href="/dashboard/orders/create">
        <PlusCircle />
        Create Order
      </Link>
    </Button>
  )
}

export function UpdateOrder({ id }: { id: string }) {
  return (
    <Button asChild size={'icon'}>
      <Link href={`/dashboard/orders/${id}/edit`}>
        <span className="sr-only">Edit</span>
        <PencilLineIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function ViewOrder({ id }: { id: string }) {
  return (
    <Button asChild size={'icon'}>
      <Link href={`/dashboard/orders/${id}`}>
        <span className="sr-only">View</span>
        <EyeIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteOrder({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id)
  return (
    <form action={deleteInvoiceWithId}>
      <Button size={'icon'}>
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  )
}
