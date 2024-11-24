'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  ChevronsUpDown,
  CircleDollarSignIcon,
  CircleUserIcon,
  TextIcon,
} from 'lucide-react'
import Link from 'next/link'
import { startTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { State } from '@/lib/actions'
import { CreateOrderSchema } from '@/lib/forms'
import { cn } from '@/lib/utils'

import CreateCustomer from '@/components/customers/create-customer'
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form as FormComponent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { CustomerField, OrderForm } from '@/types'

export default function Form({
  customers,
  order,
  state,
  formAction,
}: {
  customers: CustomerField[]
  order?: OrderForm
  state: State
  formAction: (values: z.infer<typeof CreateOrderSchema>) => void
}) {
  const { pending } = useFormStatus()

  const form = useForm<z.infer<typeof CreateOrderSchema>>({
    resolver: zodResolver(CreateOrderSchema),
  })

  function onSubmit(values: z.infer<typeof CreateOrderSchema>) {
    startTransition(() => formAction(values))
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{order ? 'Edit Order' : 'Create Order'}</CardTitle>
        <CardDescription>
          {order ? 'Edit your order' : 'Create a new order'}
        </CardDescription>
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
              defaultValue={order?.customerId || undefined}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose customer</FormLabel>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-6">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl className="pl-8 w-full">
                            {/* <div className="relative"> */}
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between relative',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? customers.find(
                                    (customer) => customer.id === field.value
                                  )?.name
                                : 'Select Customer'}
                              <ChevronsUpDown className="opacity-50" />
                              <CircleUserIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            </Button>
                            {/* </div> */}
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 pl-4">
                          <Command>
                            <CommandInput
                              placeholder="Search Customer..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {customers.map((customer) => (
                                  <CommandItem
                                    value={customer.name}
                                    key={customer.id}
                                    onSelect={() => {
                                      form.setValue('customerId', customer.id)
                                    }}
                                  >
                                    {customer.name}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        customer.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="col-span-1">
                      <CreateCustomer isIcon={true} />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              defaultValue={order?.title || ''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter title"
                        className="pl-8"
                        {...field}
                      />
                      <TextIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              defaultValue={order?.amount ? order.amount / 100 : 0}
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
              defaultValue={order?.status || 'new'}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Set the invoice status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="gap-4"
                    >
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="new" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          <StatusBadge status="new" />
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="production" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          <StatusBadge status="production" />
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="shipped" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          <StatusBadge status="shipped" />
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
          <Link href={`/dashboard/orders/${order?.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" form="create-invoice-form" disabled={pending}>
          {order ? 'Update Order' : 'Create Order'}
        </Button>
      </CardFooter>
    </Card>
  )
}
