import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  BookingRow,
  CustomerRow,
  EmergencyContactRow,
} from "@/lib/supabase/database.types";

export const CUSTOMERS_PAGE_SIZE = 10;

export type CustomersSort = "newest" | "oldest" | "name_asc" | "name_desc";

export type CustomersQueryParams = {
  page: number;
  search: string;
  sort: CustomersSort;
};

export type CustomerListRow = Pick<
  CustomerRow,
  "id" | "name" | "email" | "phone" | "address" | "created_at"
> & { bookingCount: number };

export type CustomersResult = {
  rows: CustomerListRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const SORTS: CustomersSort[] = ["newest", "oldest", "name_asc", "name_desc"];

export function parseCustomersParams(
  raw: Record<string, string | string[] | undefined>,
): CustomersQueryParams {
  const get = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const sortRaw = get("sort") as CustomersSort | undefined;
  const pageNum = Number.parseInt(get("page") ?? "1", 10);
  return {
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "newest",
    search: (get("search") ?? "").trim().slice(0, 80),
  };
}

function sanitize(term: string): string {
  return term.replace(/[,()]/g, " ").trim();
}

const SORT_COLUMN: Record<CustomersSort, { col: string; ascending: boolean }> = {
  newest: { col: "created_at", ascending: false },
  oldest: { col: "created_at", ascending: true },
  name_asc: { col: "name", ascending: true },
  name_desc: { col: "name", ascending: false },
};

const LIST_SELECT =
  "id, name, email, phone, address, created_at, bookings(count)";

type RawListRow = CustomerListRow & {
  bookings: { count: number }[] | null;
};

export async function getCustomers(
  params: CustomersQueryParams,
): Promise<CustomersResult> {
  const supabase = await createClient();
  const pageSize = CUSTOMERS_PAGE_SIZE;

  let query = supabase.from("customers").select(LIST_SELECT, { count: "exact" });

  const term = sanitize(params.search);
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
    );
  }

  const sort = SORT_COLUMN[params.sort];
  query = query.order(sort.col, { ascending: sort.ascending });

  const from = (params.page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("[getCustomers]", error);
    return { rows: [], total: 0, page: params.page, pageSize, pageCount: 0 };
  }

  const rows: CustomerListRow[] = ((data ?? []) as unknown as RawListRow[]).map(
    (r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      address: r.address,
      created_at: r.created_at,
      bookingCount: r.bookings?.[0]?.count ?? 0,
    }),
  );

  const total = count ?? 0;
  return {
    rows,
    total,
    page: params.page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export type CustomerDetail = {
  customer: CustomerRow;
  emergencyContacts: EmergencyContactRow[];
  bookings: BookingRow[];
  stats: {
    totalRentals: number;
    completedRentals: number;
    cancelledRentals: number;
    lifetimeValue: number;
    lastBookingAt: string | null;
  };
};

export async function getCustomerDetail(
  id: string,
): Promise<CustomerDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*, emergency_contacts(*), bookings(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "bookings", ascending: false })
    .single();

  if (error || !data) {
    if (error) console.error("[getCustomerDetail]", error);
    return null;
  }

  const row = data as unknown as CustomerRow & {
    emergency_contacts: EmergencyContactRow[];
    bookings: BookingRow[];
  };

  const bookings = row.bookings ?? [];
  const completed = bookings.filter((b) => b.status === "Completed");
  const cancelled = bookings.filter((b) => b.status === "Cancelled");
  const lifetimeValue = completed.reduce(
    (sum, b) => sum + Number(b.estimated_amount ?? 0),
    0,
  );

  const { emergency_contacts, bookings: _b, ...customer } = row;
  void _b;

  return {
    customer: customer as CustomerRow,
    emergencyContacts: emergency_contacts ?? [],
    bookings,
    stats: {
      totalRentals: bookings.length,
      completedRentals: completed.length,
      cancelledRentals: cancelled.length,
      lifetimeValue,
      lastBookingAt: bookings[0]?.created_at ?? null,
    },
  };
}

export type CustomerExportRow = CustomerListRow;

export async function getCustomersForExport(
  search = "",
): Promise<CustomerExportRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select(LIST_SELECT)
    .order("created_at", { ascending: false })
    .limit(5000);

  const term = sanitize(search);
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("[getCustomersForExport]", error);
    return [];
  }

  return ((data ?? []) as unknown as RawListRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    created_at: r.created_at,
    bookingCount: r.bookings?.[0]?.count ?? 0,
  }));
}
