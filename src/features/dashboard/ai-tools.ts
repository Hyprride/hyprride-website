import "server-only";

import type Anthropic from "@anthropic-ai/sdk";

import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/database.types";
import { getDashboardStats } from "./queries";

/**
 * Read-only tools the AI assistant can call to answer questions from the live
 * Supabase data. All run through the authenticated server client, so RLS still
 * applies. Nothing here mutates data.
 */
export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: "search_customers",
    description:
      "Search customers by name, phone, or email (partial match). Returns up to 10 matches with id, name, phone, email and join date. Call this first when the user names a person but you don't yet have their customer id.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "A name, phone number, or email to search for.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_customer",
    description:
      "Get one customer's details plus their recent bookings, by customer id (obtained from search_customers).",
    input_schema: {
      type: "object",
      properties: {
        customer_id: { type: "string", description: "The customer's UUID." },
      },
      required: ["customer_id"],
    },
  },
  {
    name: "get_booking",
    description:
      "Look up a single booking by its reference (format HR-000123). Returns the booking status, times, amount, and the customer.",
    input_schema: {
      type: "object",
      properties: {
        reference: {
          type: "string",
          description: "Booking reference, e.g. HR-000123.",
        },
      },
      required: ["reference"],
    },
  },
  {
    name: "list_recent_bookings",
    description:
      "List the most recent bookings, newest first, optionally filtered by status. Returns reference, customer name, status, start/end times and amount.",
    input_schema: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          description: "How many to return (1–20). Defaults to 10.",
        },
        status: {
          type: "string",
          enum: ["New", "Pending", "Confirmed", "Completed", "Cancelled"],
          description: "Optional status filter.",
        },
      },
    },
  },
  {
    name: "get_dashboard_stats",
    description:
      "Get the current business overview: total and today's bookings, revenue, active rentals, completed/cancelled counts, and month-over-month growth.",
    input_schema: { type: "object", properties: {} },
  },
];

/** Dispatch a tool call to its implementation. */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "search_customers":
      return searchCustomers(String(input.query ?? ""));
    case "get_customer":
      return getCustomer(String(input.customer_id ?? ""));
    case "get_booking":
      return getBooking(String(input.reference ?? ""));
    case "list_recent_bookings":
      return listRecentBookings(
        Number(input.limit) || 10,
        input.status ? String(input.status) : undefined,
      );
    case "get_dashboard_stats":
      return getDashboardStats();
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

/** Strip characters that would break a PostgREST `.or()` filter. */
function sanitize(term: string): string {
  return term.replace(/[,()%]/g, " ").trim();
}

async function searchCustomers(query: string) {
  const term = sanitize(query);
  if (!term) return { matches: [] };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, email, created_at")
    .or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
    .limit(10);
  if (error) return { error: error.message };
  return { matches: data ?? [] };
}

async function getCustomer(customerId: string) {
  const supabase = await createClient();
  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!customer) return { error: "No customer found with that id." };

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "reference, status, start_datetime, end_datetime, total_hours, estimated_amount, vehicle_interest, created_at",
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(20);

  return { customer, bookings: bookings ?? [] };
}

async function getBooking(reference: string) {
  const ref = reference.trim().toUpperCase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "reference, status, start_datetime, end_datetime, total_hours, estimated_amount, vehicle_interest, is_unlimited_km, unlimited_km_charge, special_notes, created_at, customer:customers(name, phone, email)",
    )
    .eq("reference", ref)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: `No booking found with reference ${ref}.` };
  return data;
}

async function listRecentBookings(limit: number, status?: string) {
  const n = Math.min(Math.max(limit, 1), 20);
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select(
      "reference, status, start_datetime, end_datetime, estimated_amount, vehicle_interest, created_at, customer:customers(name)",
    )
    .order("created_at", { ascending: false })
    .limit(n);
  if (status) query = query.eq("status", status as BookingStatus);
  const { data, error } = await query;
  if (error) return { error: error.message };
  return { bookings: data ?? [] };
}
