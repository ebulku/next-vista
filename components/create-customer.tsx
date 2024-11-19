'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircleIcon } from 'lucide-react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CreateCustomerState, createCustomer } from '@/lib/actions'
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

export default function CreateCustomer({
  isIcon = false,
}: {
  isIcon?: boolean
}) {
  const initialState: CreateCustomerState = {
    message: '',
    errors: {},
    success: false,
  }

  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(createCustomer, initialState)

  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: '',
      email: undefined,
      phone: undefined,
      address: undefined,
      description: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof CreateCustomerSchema>) {
    startTransition(() => formAction(values))
  }

  useEffect(() => {
    if (state?.success) {
      form.reset()
      setOpen(false)
      toast.success('Customer Created Successfully.')
    }
  }, [state, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={isIcon ? 'icon' : 'default'}>
          <PlusCircleIcon />
          {isIcon ? '' : 'Create Customer'}
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
              render={({ field }) => <FormInput name="Notes" field={field} />}
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
              <Button type="submit">Create Customer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
