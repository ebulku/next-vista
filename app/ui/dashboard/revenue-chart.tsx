import { generateRevenueData } from "@/app/lib/utils";
import { fetchRevenue } from "@/app/lib/data";
import { Chart } from "@/components/chart";

export default async function RevenueChart() {
  const revenue = await fetchRevenue();

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  const revenueData = generateRevenueData(revenue);

  return <Chart data={revenueData} />;
}
