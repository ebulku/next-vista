'use client'

import { CustomerField, InvoiceForm } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInvoice, State, updateInvoice } from '@/lib/actions'
import { startTransition, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form as FormComponent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateInvoiceSchema } from '@/lib/forms'
import { Input } from '@/components/ui/input'
import { CircleDollarSignIcon, CircleUserIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormStatus } from 'react-dom'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import StatusBadge from '@/components/invoices/status-badge'

export default function Form({
  customers,
  invoice,
}: {
  customers: CustomerField[]
  invoice?: InvoiceForm
}) {
  const { pending } = useFormStatus()

  const initialState: State = { message: null, errors: {} }

  let formAction: (values: z.infer<typeof CreateInvoiceSchema>) => void
  let state: typeof initialState

  if (invoice) {
    const updateInvoiceWithId = updateInvoice.bind(null, invoice.id)
    ;[state, formAction] = useActionState(updateInvoiceWithId, initialState)
  } else {
    ;[state, formAction] = useActionState(createInvoice, initialState)
  }

  const form = useForm<z.infer<typeof CreateInvoiceSchema>>({
    resolver: zodResolver(CreateInvoiceSchema),
  })

  function onSubmit(values: z.infer<typeof CreateInvoiceSchema>) {
    startTransition(() => formAction(values))
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
        <CardDescription>Create a new invoice for a customer</CardDescription>
      </CardHeader>
      <CardContent>
        <FormComponent {...form}>
          <form
            id="create-invoice-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="customerId"
              defaultValue={invoice?.customerId}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div className="relative">
                      <FormControl className="pl-8">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            className="pl-8"
                            key={customer.id}
                            value={customer.id}
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <CircleUserIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              defaultValue={invoice?.amount || 0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose an amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter USD amount"
                        className="pl-8"
                        {...field}
                      />
                      <CircleDollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              defaultValue={invoice?.status || 'pending'}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Set the invoice status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4 grid-flow-col"
                    >
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pending" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          <StatusBadge status="pending" />
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paid" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          <StatusBadge status="paid" />
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <div aria-live="polite" aria-atomic="true">
            {state.message && (
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
          </div>
        </FormComponent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/invoices">Cancel</Link>
        </Button>
        <Button type="submit" form="create-invoice-form" disabled={pending}>
          {invoice ? 'Update invoice' : 'Create invoice'}
        </Button>
      </CardFooter>
    </Card>
  )
}
