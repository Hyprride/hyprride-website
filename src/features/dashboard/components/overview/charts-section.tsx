import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookingsTrend, getStatusBreakdown } from "../../queries";
import { BookingsTrendChart } from "../charts/bookings-trend-chart";
import { StatusDonutChart } from "../charts/status-donut-chart";

export async function ChartsSection() {
  const [trend, breakdown] = await Promise.all([
    getBookingsTrend(14),
    getStatusBreakdown(),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bookings trend</CardTitle>
          <CardDescription>New bookings over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsTrendChart data={trend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By status</CardTitle>
          <CardDescription>Distribution across all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDonutChart data={breakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
