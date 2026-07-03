import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/**
 * Date/time helpers for the booking flow.
 *
 * The form keeps `date` ("YYYY-MM-DD") and `time` ("HH:mm") as separate
 * strings. These helpers combine them into a real Date in the visitor's local
 * timezone and produce the duration breakdown shown live in the UI.
 */

export function combineDateTime(
  date: string,
  time: string,
): Date | null {
  if (!date || !time) return null;
  const candidate = new Date(`${date}T${time}`);
  return isValid(candidate) ? candidate : null;
}

export type Duration = {
  totalMinutes: number;
  totalHours: number; // rounded to 2 decimals
  days: number;
  hours: number;
  minutes: number;
  /** e.g. "2 days 3 hrs" / "5 hrs 30 mins" / "45 mins" */
  label: string;
};

export function getDuration(start: Date, end: Date): Duration {
  const totalMinutes = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 60000),
  );
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);

  return {
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 100) / 100,
    days,
    hours,
    minutes,
    label: parts.length ? parts.join(" ") : "0 mins",
  };
}

/** Today's date as "YYYY-MM-DD" in local time — used for `min` on date inputs. */
export function todayISODate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** A Date → "YYYY-MM-DD" (local) for a date input value. */
export function toDateInputValue(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** A Date → "HH:mm" (local, 24h) for a time field value. */
export function toTimeInputValue(d: Date): string {
  return format(d, "HH:mm");
}

/** HYPRRIDE is open 7 AM–12 AM; the store is closed from midnight to 7 AM. */
export const STORE_OPEN_HOUR = 7;

/**
 * Whether a time-of-day is within store hours (07:00–23:59). Pickups and
 * returns are only accepted while the store is open.
 */
export function isWithinStoreHours(date: Date): boolean {
  return date.getHours() >= STORE_OPEN_HOUR;
}

/**
 * Whether a start time falls in the booking service's weekend window:
 * Friday 17:00 → Sunday 23:59. Used only for the website's *indicative*
 * estimate; the booking service computes the authoritative day_type/price.
 */
export function isWeekendRate(date: Date): boolean {
  const day = date.getDay(); // 0 Sun … 6 Sat
  if (day === 6 || day === 0) return true; // all of Sat/Sun
  if (day === 5 && date.getHours() >= 17) return true; // Fri from 17:00
  return false;
}

/* ── Display formatters (accept Date or ISO string) ─────────────────────── */

function toDate(value: Date | string): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function formatDateTime(value: Date | string): string {
  const d = toDate(value);
  return d ? format(d, "d MMM yyyy, h:mm a") : "—";
}

export function formatDateShort(value: Date | string): string {
  const d = toDate(value);
  return d ? format(d, "d MMM yyyy") : "—";
}

export function formatTime(value: Date | string): string {
  const d = toDate(value);
  return d ? format(d, "h:mm a") : "—";
}

export function formatRelative(value: Date | string): string {
  const d = toDate(value);
  return d ? `${formatDistanceToNow(d)} ago` : "—";
}
