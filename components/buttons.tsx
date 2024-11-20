import {
  EditIcon,
  EyeIcon,
  LucideIcon,
  PlusCircle,
  TrashIcon,
} from 'lucide-react'
import Link from 'next/link'

import { deleteCustomer } from '@/lib/actions'
import { deleteInvoice } from '@/lib/actions'
import { deleteOrder } from '@/lib/actions'

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
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'

type ActionType = () => Promise<{ message: string } | undefined>

export function CreateInvoiceButton() {
  return createButton({
    link: '/dashboard/invoices/create',
    name: 'Create Invoice',
  })
}

export function UpdateInvoiceButton({ id }: { id: string }) {
  return updateButton({
    link: `/dashboard/invoices/${id}/edit`,
    name: 'Edit Invoice',
  })
}

export function DeleteInvoiceButton({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id)

  return deleteButton({
    action: deleteInvoiceWithId,
    message:
      'This action cannot be undone. This will permanently delete this invoice data.',
  })
}

export function CreateOrderButton() {
  return createButton({
    link: '/dashboard/orders/create',
    name: 'Create Order',
  })
}

export function UpdateOrderButton({ id }: { id: string }) {
  return updateButton({
    link: `/dashboard/orders/${id}/edit`,
    name: 'Edit Order',
  })
}

export function ViewOrderButton({ id }: { id: string }) {
  return viewButton({
    link: `/dashboard/orders/${id}`,
    name: 'View Order',
  })
}

export function DeleteOrderButton({ id }: { id: string }) {
  const deleteOrderWithId = deleteOrder.bind(null, id)

  return deleteButton({
    action: deleteOrderWithId,
    message:
      'This action cannot be undone. This will permanently delete this order and remove the data from our servers.',
  })
}

export function DeleteCustomerButton({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id)

  return deleteButton({
    action: deleteCustomerWithId,
    message:
      'This action cannot be undone. This will permanently delete this customer and their invoices, but not the orders.',
  })
}

const linkButton = ({
  link,
  name,
  Icon,
}: {
  link: string
  name: string
  Icon: LucideIcon
}) => {
  return (
    <Button asChild size={'icon'} variant={'link'}>
      <Link href={link}>
        <span className="sr-only">{name}</span>
        <Icon className="w-5" />
      </Link>
    </Button>
  )
}

const createButton = ({ link, name }: { link: string; name: string }) => {
  return (
    <Button asChild>
      <Link href={link}>
        <PlusCircle />
        {name}
      </Link>
    </Button>
  )
}

const updateButton = ({ link, name }: { link: string; name: string }) => {
  return linkButton({ link, name, Icon: EditIcon })
}

const viewButton = ({ link, name }: { link: string; name: string }) => {
  return linkButton({ link, name, Icon: EyeIcon })
}

const deleteButton = ({
  action,
  message,
}: {
  action: ActionType
  message: string
}) => {
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
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={action}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
