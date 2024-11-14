import { fetchLatestInvoices } from "@/lib/data";
import { formatCurrency, generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();
  return (
    <div className="space-y-8">
      {latestInvoices.map((invoice, i) => {
        return (
          <div key={invoice.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={invoice.customer.imageUrl || undefined}
                alt={`${invoice.customer.name}'s profile picture`}
              />
              <AvatarFallback>
                {generateInitials(invoice.customer.name)}
              </AvatarFallback>
            </Avatar>
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
        );
      })}
    </div>
  );
}
