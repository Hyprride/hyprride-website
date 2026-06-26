/**
 * IST (Asia/Kolkata, UTC+5:30) date-boundary helpers.
 *
 * HYPRRIDE operates in Hyderabad, but servers (e.g. Vercel) run in UTC. These
 * return the correct UTC instant for the start of an IST day/week/month so
 * "today", "this week" and "this month" line up with the business day.
 */
export const IST_OFFSET_MIN = 330;

function shiftToIst(d: Date): Date {
  return new Date(d.getTime() + IST_OFFSET_MIN * 60000);
}
function shiftFromIst(d: Date): Date {
  return new Date(d.getTime() - IST_OFFSET_MIN * 60000);
}

export function istStartOfDay(d = new Date()): Date {
  const ist = shiftToIst(d);
  ist.setUTCHours(0, 0, 0, 0);
  return shiftFromIst(ist);
}

export function istStartOfWeek(d = new Date()): Date {
  const ist = shiftToIst(d);
  const day = ist.getUTCDay(); // 0 = Sun
  const diff = (day + 6) % 7; // make Monday the first day
  ist.setUTCDate(ist.getUTCDate() - diff);
  ist.setUTCHours(0, 0, 0, 0);
  return shiftFromIst(ist);
}

export function istStartOfMonth(d = new Date()): Date {
  const ist = shiftToIst(d);
  ist.setUTCDate(1);
  ist.setUTCHours(0, 0, 0, 0);
  return shiftFromIst(ist);
}

/** "YYYY-MM-DD" key in IST for grouping. */
export function istDayKey(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return shiftToIst(date).toISOString().slice(0, 10);
}
