import { fetchCardData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BanknoteIcon, Clock2Icon, InboxIcon, UsersIcon } from "lucide-react";

const iconMap = {
  collected: BanknoteIcon,
  customers: UsersIcon,
  pending: Clock2Icon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <CardObject
        title="Collected"
        value={totalPaidInvoices}
        type="collected"
      />
      <CardObject title="Pending" value={totalPendingInvoices} type="pending" />
      <CardObject
        title="Total Invoices"
        value={numberOfInvoices}
        type="invoices"
      />
      <CardObject
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function CardObject({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}
