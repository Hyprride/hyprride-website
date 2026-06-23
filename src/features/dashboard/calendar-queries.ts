import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/database.types";

export type CalendarEvent = {
  id: string;
  reference: string;
  customerName: string;
  status: BookingStatus;
  start: string;
  end: string;
};

/** Bookings whose start falls within [startISO, endISO]. */
export async function getCalendarBookings(
  startISO: string,
  endISO: string,
): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, reference, status, start_datetime, end_datetime, customer:customers(name)",
    )
    .gte("start_datetime", startISO)
    .lte("start_datetime", endISO)
    .order("start_datetime", { ascending: true })
    .limit(1000);

  if (error) {
    console.error("[getCalendarBookings]", error);
    return [];
  }

  type Raw = {
    id: string;
    reference: string;
    status: BookingStatus;
    start_datetime: string;
    end_datetime: string;
    customer: { name: string } | { name: string }[] | null;
  };

  return ((data ?? []) as unknown as Raw[]).map((r) => {
    const customer = Array.isArray(r.customer) ? r.customer[0] : r.customer;
    return {
      id: r.id,
      reference: r.reference,
      customerName: customer?.name ?? "—",
      status: r.status,
      start: r.start_datetime,
      end: r.end_datetime,
    };
  });
}
