'use client'

import { CustomerField } from '@/types'
import { createInvoice, State } from '@/lib/actions'
import { useActionState } from 'react'

import Form from './form'

export default function CreateForm({
  customers,
}: {
  customers: CustomerField[]
}) {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useActionState(createInvoice, initialState)
  return <Form customers={customers} state={state} formAction={formAction} />
}
