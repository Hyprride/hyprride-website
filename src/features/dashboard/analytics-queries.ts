import "server-only";

import { createClient } from "@/lib/supabase/server";
import { istDayKey, istStartOfDay, IST_OFFSET_MIN } from "@/lib/utils/ist";
import {
  getBookingsTrend,
  getStatusBreakdown,
  type StatusSlice,
  type TrendPoint,
} from "./queries";

const DAY_MS = 24 * 60 * 60 * 1000;

function dayWindow(days: number) {
  const since = new Date(istStartOfDay().getTime() - (days - 1) * DAY_MS);
  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    keys.push(istDayKey(new Date(since.getTime() + i * DAY_MS)));
  }
  return { since, keys };
}

function dayLabel(key: string): string {
  return new Date(key).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export type RevenuePoint = { date: string; label: string; amount: number };

export async function getRevenueTrend(days = 30): Promise<RevenuePoint[]> {
  const supabase = await createClient();
  const { since, keys } = dayWindow(days);

  const { data } = await supabase
    .from("bookings")
    .select("created_at, estimated_amount, status")
    .eq("status", "Completed")
    .gte("created_at", since.toISOString());

  const buckets = new Map(keys.map((k) => [k, 0]));
  for (const row of data ?? []) {
    const key = istDayKey(row.created_at);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + Number(row.estimated_amount ?? 0));
    }
  }

  return keys.map((date) => ({
    date,
    label: dayLabel(date),
    amount: buckets.get(date) ?? 0,
  }));
}

export type GrowthPoint = { date: string; label: string; total: number };

export async function getCustomerGrowth(days = 30): Promise<GrowthPoint[]> {
  const supabase = await createClient();
  const { since, keys } = dayWindow(days);

  const [{ count: baseline }, { data }] = await Promise.all([
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .lt("created_at", since.toISOString()),
    supabase
      .from("customers")
      .select("created_at")
      .gte("created_at", since.toISOString()),
  ]);

  const perDay = new Map(keys.map((k) => [k, 0]));
  for (const row of data ?? []) {
    const key = istDayKey(row.created_at);
    if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  let running = baseline ?? 0;
  return keys.map((date) => {
    running += perDay.get(date) ?? 0;
    return { date, label: dayLabel(date), total: running };
  });
}

export type TopCustomer = { id: string; name: string; count: number };

export async function getTopCustomers(limit = 5): Promise<TopCustomer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name, bookings(count)")
    .limit(500);

  type Raw = { id: string; name: string; bookings: { count: number }[] | null };
  return ((data ?? []) as unknown as Raw[])
    .map((r) => ({ id: r.id, name: r.name, count: r.bookings?.[0]?.count ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type PeakHour = { hour: number; label: string; count: number };

export async function getPeakHours(): Promise<PeakHour[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("start_datetime")
    .limit(5000);

  const buckets = new Array(24).fill(0) as number[];
  for (const row of data ?? []) {
    const ist = new Date(
      new Date(row.start_datetime).getTime() + IST_OFFSET_MIN * 60000,
    );
    buckets[ist.getUTCHours()] += 1;
  }

  return buckets.map((count, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, "0")}:00`,
    count,
  }));
}

export type AnalyticsData = {
  bookingsTrend: TrendPoint[];
  revenueTrend: RevenuePoint[];
  customerGrowth: GrowthPoint[];
  topCustomers: TopCustomer[];
  statusBreakdown: StatusSlice[];
  peakHours: PeakHour[];
};

export async function getAnalytics(): Promise<AnalyticsData> {
  const [
    bookingsTrend,
    revenueTrend,
    customerGrowth,
    topCustomers,
    statusBreakdown,
    peakHours,
  ] = await Promise.all([
    getBookingsTrend(30),
    getRevenueTrend(30),
    getCustomerGrowth(30),
    getTopCustomers(5),
    getStatusBreakdown(),
    getPeakHours(),
  ]);

  return {
    bookingsTrend,
    revenueTrend,
    customerGrowth,
    topCustomers,
    statusBreakdown,
    peakHours,
  };
}
