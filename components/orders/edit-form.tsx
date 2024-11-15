'use client'

import { CustomerField, InvoiceForm, OrderForm } from '@/types'
import { State, updateInvoice, updateOrder } from '@/lib/actions'
import { useActionState } from 'react'
import Form from './form'

export default function EditForm({
  customers,
  order,
}: {
  customers: CustomerField[]
  order: OrderForm
}) {
  const initialState: State = { message: null, errors: {} }
  const updateOrderWithId = updateOrder.bind(null, order.id)
  const [state, formAction] = useActionState(updateOrderWithId, initialState)
  return (
    <Form
      customers={customers}
      order={order}
      state={state}
      formAction={formAction}
    />
  )
}
