import { deleteOrder } from '@/lib/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { EyeIcon, PencilLineIcon, PlusCircle, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

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
    <Button asChild size={'icon'} variant={'link'}>
      <Link href={`/dashboard/orders/${id}/edit`}>
        <span className="sr-only">Edit</span>
        <PencilLineIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function ViewOrder({ id }: { id: string }) {
  return (
    <Button asChild size={'icon'} variant={'link'}>
      <Link href={`/dashboard/orders/${id}`}>
        <span className="sr-only">View</span>
        <EyeIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteOrder({ id }: { id: string }) {
  const deleteOrderWithId = deleteOrder.bind(null, id)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" size={'icon'}>
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            order including the notes and files and remove the data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={deleteOrderWithId}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
