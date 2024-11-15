'use client'

import { CustomerField, InvoiceForm } from '@/types'
import { State, updateInvoice } from '@/lib/actions'
import { useActionState } from 'react'
import Form from './form'

export default function EditForm({
  customers,
  invoice,
}: {
  customers: CustomerField[]
  invoice: InvoiceForm
}) {
  const initialState: State = { message: null, errors: {} }
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id)
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState)
  return (
    <Form
      customers={customers}
      invoice={invoice}
      state={state}
      formAction={formAction}
    />
  )
}
