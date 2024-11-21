import { fetchLatestInvoices } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

import { UserAvatar } from '@/components/user-avatar'

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices()
  return (
    <div className="space-y-8">
      {latestInvoices.map((invoice, i) => {
        return (
          <div key={invoice.id} className="flex items-center">
            <UserAvatar
              imageUrl={invoice.customer.imageUrl || undefined}
              name={invoice.customer.name}
            />
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {invoice.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoice.customer.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {formatCurrency(invoice.amount)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
