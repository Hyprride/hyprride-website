import { cn } from "@/lib/utils";
import { BOOKING_STATUS_META } from "@/lib/constants/booking";
import type { BookingStatus } from "@/lib/supabase/database.types";

/** Color-coded booking status pill, single source of truth via constants. */
export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const meta = BOOKING_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
