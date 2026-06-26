import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalytics } from "@/features/dashboard/analytics-queries";
import { BookingsTrendChart } from "@/features/dashboard/components/charts/bookings-trend-chart";
import { RevenueTrendChart } from "@/features/dashboard/components/charts/revenue-trend-chart";
import { CustomerGrowthChart } from "@/features/dashboard/components/charts/customer-growth-chart";
import { TopCustomersChart } from "@/features/dashboard/components/charts/top-customers-chart";
import { PeakHoursChart } from "@/features/dashboard/components/charts/peak-hours-chart";
import { StatusDonutChart } from "@/features/dashboard/components/charts/status-donut-chart";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trends across bookings, revenue and customers (last 30 days).
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsSections />
      </Suspense>
    </div>
  );
}

async function AnalyticsSections() {
  const data = await getAnalytics();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        className="lg:col-span-2"
        title="Bookings trend"
        description="New bookings over the last 30 days"
      >
        <BookingsTrendChart data={data.bookingsTrend} />
      </ChartCard>

      <ChartCard title="Revenue trend" description="Completed-booking revenue">
        <RevenueTrendChart data={data.revenueTrend} />
      </ChartCard>

      <ChartCard title="Customer growth" description="Cumulative customers">
        <CustomerGrowthChart data={data.customerGrowth} />
      </ChartCard>

      <ChartCard title="Top customers" description="By number of bookings">
        <TopCustomersChart data={data.topCustomers} />
      </ChartCard>

      <ChartCard title="Peak booking times" description="By rental start hour (IST)">
        <PeakHoursChart data={data.peakHours} />
      </ChartCard>

      <ChartCard
        className="lg:col-span-2"
        title="Booking statuses"
        description="Distribution across all bookings"
      >
        <StatusDonutChart data={data.statusBreakdown} />
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className={i === 0 ? "p-6 lg:col-span-2" : "p-6"}>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3.5 w-52" />
          <Skeleton className="mt-6 h-[220px] w-full" />
        </Card>
      ))}
    </div>
  );
}
