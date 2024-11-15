'use client'

import { CustomerField } from '@/types'
import { createOrder, State } from '@/lib/actions'
import { useActionState } from 'react'
import Form from './form'

export default function CreateForm({
  customers,
}: {
  customers: CustomerField[]
}) {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useActionState(createOrder, initialState)
  return <Form customers={customers} state={state} formAction={formAction} />
}
