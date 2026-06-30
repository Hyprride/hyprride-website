import type { BookingStatus } from "@/lib/supabase/database.types";

/**
 * Booking business rules and presentation config — the single source of truth
 * shared by the public booking form and the admin dashboard.
 */

/** Ordered list of statuses (drives filters, kanban order, etc.). */
export const BOOKING_STATUSES: readonly BookingStatus[] = [
  "New",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

type StatusMeta = {
  label: string;
  /** Tailwind classes for a soft badge (works in light + dark). */
  badge: string;
  /** Solid dot / accent color. */
  dot: string;
};

export const BOOKING_STATUS_META: Record<BookingStatus, StatusMeta> = {
  New: {
    label: "New",
    badge:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20",
    dot: "bg-blue-500",
  },
  Pending: {
    label: "Pending",
    badge:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    dot: "bg-amber-500",
  },
  Confirmed: {
    label: "Confirmed",
    badge:
      "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/20",
    dot: "bg-green-500",
  },
  Completed: {
    label: "Completed",
    badge:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    label: "Cancelled",
    badge:
      "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20",
    dot: "bg-red-500",
  },
};

/** Hex colors for charts (Recharts can't read Tailwind classes). */
export const BOOKING_STATUS_HEX: Record<BookingStatus, string> = {
  New: "#3b82f6",
  Pending: "#f59e0b",
  Confirmed: "#22c55e",
  Completed: "#10b981",
  Cancelled: "#ef4444",
};

/** Brand accent used across dashboard charts. */
export const BRAND_HEX = "#C9A227";

/**
 * The booking service's fixed duration slabs (hours). The public form lets a
 * lead express a *preferred slab*; staff confirm the real slab in-store.
 */
export const SLAB_HOURS = [1, 3, 5, 7, 12, 24] as const;
export type SlabHours = (typeof SLAB_HOURS)[number];

/**
 * GST rate shown alongside estimates. Display only — it is NOT added into the
 * stored `estimated_amount`; the booking service computes the authoritative tax.
 */
export const GST_RATE_PERCENT = 18;

/** Per-km charge beyond the included limit when unlimited km isn't unlocked. */
export const EXTRA_KM_CHARGE = 4;

/** Refundable security deposit (₹), by pickup/usage location. */
export const SECURITY_DEPOSIT = {
  withinHyd: 1000,
  outsideHyd: 3000,
} as const;

/**
 * How a website lead status maps onto the booking service's lifecycle. The two
 * enums mean different things and stay separate — this is documentation of the
 * bridge, used when a "Confirmed" lead is pushed to the booking service.
 *
 *   New        → nothing yet (just submitted)
 *   Pending    → nothing yet (staff working the lead)
 *   Confirmed  → push to service → booking 'pending' then 'active' after handover
 *   Completed  → mirrors service 'completed'
 *   Cancelled  → no booking, or service 'cancelled'
 */
export const LEAD_TO_SERVICE_STATUS: Record<BookingStatus, string> = {
  New: "none",
  Pending: "none",
  Confirmed: "pending",
  Completed: "completed",
  Cancelled: "cancelled",
};

/** Booking duration / scheduling rules (minutes & hours). */
export const BOOKING_RULES = {
  /** Minimum rental length. */
  minHours: 1,
  /** Maximum rental length (30 days). */
  maxHours: 24 * 30,
  /** Field length limits surfaced to the UI as character counters. */
  limits: {
    name: 120,
    address: 400,
    notes: 1000,
    emergencyName: 120,
  },
} as const;

/** Indian phone defaults for the +91 formatter. */
export const PHONE = {
  countryCode: "+91",
  /** Number of digits after the country code. */
  nationalLength: 10,
} as const;

/** Draft autosave key (localStorage). */
export const BOOKING_DRAFT_KEY = "hyprride:booking-draft:v1";
