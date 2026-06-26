import {
  CalendarCheck,
  CalendarDays,
  IndianRupee,
  Bike,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { getDashboardStats } from "../../queries";
import { StatCard } from "../stat-card";

export async function StatsSection() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total bookings"
        value={stats.totalBookings}
        icon={CalendarCheck}
        delta={stats.growthPct}
      />
      <StatCard
        label="Today's bookings"
        value={stats.todayBookings}
        icon={CalendarDays}
        accent="text-blue-600 bg-blue-500/10 dark:text-blue-400"
      />
      <StatCard
        label="Revenue"
        value={stats.revenue}
        icon={IndianRupee}
        format="currency"
        accent="text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
      />
      <StatCard
        label="Active rentals"
        value={stats.activeRentals}
        icon={Bike}
        accent="text-amber-600 bg-amber-500/10 dark:text-amber-400"
      />
      <StatCard
        label="Completed"
        value={stats.completedRentals}
        icon={CheckCircle2}
        accent="text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
      />
      <StatCard
        label="Cancelled"
        value={stats.cancelledRentals}
        icon={XCircle}
        accent="text-red-600 bg-red-500/10 dark:text-red-400"
      />
      <StatCard
        label="Month-over-month"
        value={stats.growthPct}
        icon={TrendingUp}
        format="percent"
        delta={stats.growthPct}
        accent="text-brand bg-brand/10"
      />
    </div>
  );
}
