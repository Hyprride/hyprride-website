import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/database.types";
import { BOOKING_STATUSES } from "@/lib/constants/booking";
import { istStartOfDay, istStartOfMonth, istStartOfWeek } from "@/lib/utils/ist";
import type { BookingWithCustomer, BookingDetail } from "@/types/booking";

export const BOOKINGS_PAGE_SIZE = 10;

export type BookingsRange = "all" | "today" | "week" | "month";
export type BookingsSort = "newest" | "oldest" | "start_asc" | "start_desc";

export type BookingsQueryParams = {
  page: number;
  status: BookingStatus | "all";
  range: BookingsRange;
  search: string;
  sort: BookingsSort;
};

export type BookingsResult = {
  rows: BookingWithCustomer[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const RANGES: BookingsRange[] = ["all", "today", "week", "month"];
const SORTS: BookingsSort[] = ["newest", "oldest", "start_asc", "start_desc"];

/** Parse + normalize raw search params into a typed query (defensive). */
export function parseBookingsParams(
  raw: Record<string, string | string[] | undefined>,
): BookingsQueryParams {
  const get = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const statusRaw = get("status");
  const rangeRaw = get("range") as BookingsRange | undefined;
  const sortRaw = get("sort") as BookingsSort | undefined;
  const pageNum = Number.parseInt(get("page") ?? "1", 10);

  return {
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
    status:
      statusRaw && (BOOKING_STATUSES as readonly string[]).includes(statusRaw)
        ? (statusRaw as BookingStatus)
        : "all",
    range: rangeRaw && RANGES.includes(rangeRaw) ? rangeRaw : "all",
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "newest",
    search: (get("search") ?? "").trim().slice(0, 80),
  };
}

/** Remove characters that would break a PostgREST `.or()` filter. */
function sanitize(term: string): string {
  return term.replace(/[,()]/g, " ").trim();
}

function rangeStart(range: BookingsRange): string | null {
  switch (range) {
    case "today":
      return istStartOfDay().toISOString();
    case "week":
      return istStartOfWeek().toISOString();
    case "month":
      return istStartOfMonth().toISOString();
    default:
      return null;
  }
}

const SELECT =
  "id, reference, customer_id, start_datetime, end_datetime, total_hours, estimated_amount, special_notes, vehicle_interest, preferred_slab_hours, external_booking_id, external_reference, sync_status, status, created_at, updated_at, customer:customers(*)";

export async function getBookings(
  params: BookingsQueryParams,
): Promise<BookingsResult> {
  const supabase = await createClient();
  const pageSize = BOOKINGS_PAGE_SIZE;

  let query = supabase.from("bookings").select(SELECT, { count: "exact" });

  if (params.status !== "all") query = query.eq("status", params.status);

  const start = rangeStart(params.range);
  if (start) query = query.gte("created_at", start);

  const term = sanitize(params.search);
  if (term) {
    // Match booking reference, or any customer whose name/phone/email matches.
    const { data: custs } = await supabase
      .from("customers")
      .select("id")
      .or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
      .limit(100);
    const ids = (custs ?? []).map((c) => c.id);

    const ors = [`reference.ilike.%${term}%`];
    if (ids.length) ors.push(`customer_id.in.(${ids.join(",")})`);
    query = query.or(ors.join(","));
  }

  switch (params.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "start_asc":
      query = query.order("start_datetime", { ascending: true });
      break;
    case "start_desc":
      query = query.order("start_datetime", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (params.page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("[getBookings]", error);
    return { rows: [], total: 0, page: params.page, pageSize, pageCount: 0 };
  }

  const total = count ?? 0;
  return {
    rows: (data ?? []) as unknown as BookingWithCustomer[],
    total,
    page: params.page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getBookingDetail(
  id: string,
): Promise<BookingDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*, customer:customers(*, emergency_contacts(*)), activity_logs(*)`,
    )
    .eq("id", id)
    .order("created_at", { referencedTable: "activity_logs", ascending: false })
    .single();

  if (error || !data) {
    if (error) console.error("[getBookingDetail]", error);
    return null;
  }
  return data as unknown as BookingDetail;
}
