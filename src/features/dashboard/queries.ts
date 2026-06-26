import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/database.types";
import { BOOKING_STATUSES } from "@/lib/constants/booking";
import { istDayKey, istStartOfDay, istStartOfMonth } from "@/lib/utils/ist";

export type DashboardStats = {
  totalBookings: number;
  todayBookings: number;
  revenue: number;
  activeRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  growthPct: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const now = new Date();
  const startToday = istStartOfDay(now).toISOString();
  const startThisMonth = istStartOfMonth(now).toISOString();
  const startLastMonth = istStartOfMonth(
    new Date(istStartOfMonth(now).getTime() - 1),
  ).toISOString();
  const nowIso = now.toISOString();

  const [
    total,
    today,
    completed,
    cancelled,
    active,
    thisMonth,
    lastMonth,
    revenueRows,
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startToday),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "Cancelled"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "Confirmed")
      .lte("start_datetime", nowIso)
      .gte("end_datetime", nowIso),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startThisMonth),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startLastMonth)
      .lt("created_at", startThisMonth),
    supabase
      .from("bookings")
      .select("estimated_amount")
      .eq("status", "Completed")
      .not("estimated_amount", "is", null),
  ]);

  const revenue = (revenueRows.data ?? []).reduce(
    (sum, r) => sum + Number(r.estimated_amount ?? 0),
    0,
  );

  const thisMonthCount = thisMonth.count ?? 0;
  const lastMonthCount = lastMonth.count ?? 0;
  const growthPct =
    lastMonthCount === 0
      ? thisMonthCount > 0
        ? 100
        : 0
      : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

  return {
    totalBookings: total.count ?? 0,
    todayBookings: today.count ?? 0,
    revenue,
    activeRentals: active.count ?? 0,
    completedRentals: completed.count ?? 0,
    cancelledRentals: cancelled.count ?? 0,
    growthPct,
  };
}

export type TrendPoint = { date: string; label: string; count: number };

export async function getBookingsTrend(days = 14): Promise<TrendPoint[]> {
  const supabase = await createClient();
  const since = new Date(
    istStartOfDay().getTime() - (days - 1) * 24 * 60 * 60 * 1000,
  );

  const { data } = await supabase
    .from("bookings")
    .select("created_at")
    .gte("created_at", since.toISOString());

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    buckets.set(istDayKey(d.toISOString()), 0);
  }
  for (const row of data ?? []) {
    const key = istDayKey(row.created_at);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    count,
  }));
}

export type StatusSlice = { status: BookingStatus; count: number };

export async function getStatusBreakdown(): Promise<StatusSlice[]> {
  const supabase = await createClient();
  const results = await Promise.all(
    BOOKING_STATUSES.map((status) =>
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", status),
    ),
  );
  return BOOKING_STATUSES.map((status, i) => ({
    status,
    count: results[i].count ?? 0,
  }));
}

export async function getRecentCustomers(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export type RecentActivity = {
  id: string;
  action: string;
  actor: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  reference: string | null;
};

export async function getRecentActivity(limit = 6): Promise<RecentActivity[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("id, action, actor, metadata, created_at, bookings(reference)")
    .order("created_at", { ascending: false })
    .limit(limit);

  type RawActivity = {
    id: string;
    action: string;
    actor: string;
    metadata: unknown;
    created_at: string;
    bookings: { reference: string } | { reference: string }[] | null;
  };

  return ((data ?? []) as unknown as RawActivity[]).map((row) => {
    const booking = Array.isArray(row.bookings)
      ? row.bookings[0]
      : row.bookings;
    return {
      id: row.id,
      action: row.action,
      actor: row.actor,
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      created_at: row.created_at,
      reference: booking?.reference ?? null,
    };
  });
}
