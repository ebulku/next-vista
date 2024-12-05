'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeEuroIcon, CircleUserIcon } from 'lucide-react'
import Link from 'next/link'
import { startTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { State } from '@/lib/actions'
import { CreateInvoiceSchema } from '@/lib/forms'

import StatusBadge from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form as FormComponent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CustomerField, InvoiceForm } from '@/types'

export default function Form({
  customers,
  invoice,
  state,
  formAction,
}: {
  customers: CustomerField[]
  invoice?: InvoiceForm
  state: State
  formAction: (values: z.infer<typeof CreateInvoiceSchema>) => void
}) {
  const { pending } = useFormStatus()

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
                        placeholder="Enter EUR amount"
                        className="pl-8"
                        {...field}
                      />
                      <BadgeEuroIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
