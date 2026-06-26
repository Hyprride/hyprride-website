"use server";

import { getCurrentUser } from "@/features/auth/queries";
import { getCalendarBookings, type CalendarEvent } from "./calendar-queries";

/** Client-callable loader for the calendar's visible range. */
export async function loadCalendarBookings(
  startISO: string,
  endISO: string,
): Promise<CalendarEvent[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getCalendarBookings(startISO, endISO);
}
