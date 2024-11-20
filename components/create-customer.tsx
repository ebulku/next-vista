'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { EditIcon, PlusCircleIcon } from 'lucide-react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  CreateCustomerState,
  createCustomer,
  editCustomer,
} from '@/lib/actions'
import { CreateCustomerSchema } from '@/lib/forms'

import FormInput from '@/components/form-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'

import { FormattedCustomersTable } from '@/types'

export default function CreateCustomer({
  isIcon = false,
  customer,
}: {
  isIcon?: boolean
  customer?: FormattedCustomersTable
}) {
  const initialState: CreateCustomerState = {
    message: '',
    errors: {},
    success: false,
  }

  const [open, setOpen] = useState(false)

  const actionFunction = customer
    ? (
        prevState: CreateCustomerState,
        formData: z.infer<typeof CreateCustomerSchema>
      ) => editCustomer(customer.id, prevState, formData)
    : createCustomer

  const defaultValues = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    description: customer?.description || '',
  }

  const [state, formAction] = useActionState(actionFunction, initialState)
  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof CreateCustomerSchema>) {
    startTransition(() => formAction(values))
  }

  useEffect(() => {
    if (state?.success) {
      form.reset()
      setOpen(false)
      const method = customer ? 'Edited' : 'Created'
      toast.success(`Customer ${method} Successfully.`)
    }
  }, [state, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={isIcon ? 'icon' : 'default'}>
          {customer ? <EditIcon /> : <PlusCircleIcon />}
          {isIcon ? '' : customer ? 'Edit' : 'Create'}
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogDescription className="hidden">
          Create a new customer
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit(onSubmit)()
            }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Add a new Note</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInput name="Name" field={field} required />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => <FormInput name="Email" field={field} />}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => <FormInput name="Phone" field={field} />}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => <FormInput name="Address" field={field} />}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormInput name="Description" field={field} />
              )}
            />

            {state?.message && (
              <div className="text-sm text-red-500">{state.message}</div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{customer ? 'Edit' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
