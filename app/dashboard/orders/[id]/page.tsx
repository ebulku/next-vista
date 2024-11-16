// Redirect to the edit invoice page
import OrderTimeline from '@/components/orders/order-timeline'
import { fetchOrderFiles, fetchOrderNotes } from '@/lib/data'
import { redirect } from 'next/navigation'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
  const notes = await fetchOrderNotes(id)
  const files = await fetchOrderFiles(id)

  return <OrderTimeline notes={notes} files={files} />
}
