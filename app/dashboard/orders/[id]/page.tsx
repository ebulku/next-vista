// Redirect to the edit invoice page
import { redirect } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id

  redirect(`/dashboard/orders/${id}/edit`)
}
