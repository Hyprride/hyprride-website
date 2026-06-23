"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Clock, Hourglass } from "lucide-react";

import { combineDateTime, getDuration, formatDateTime } from "@/lib/utils/datetime";
import type { BookingFormValues } from "@/lib/validators/booking";

/**
 * Live, read-only summary of the selected rental window: human duration,
 * estimated hours, and the resolved start/end. Designed to slot in below the
 * date/time fields and to leave room for dynamic pricing later.
 */
export function DurationSummary({ values }: { values: BookingFormValues }) {
  const start = combineDateTime(values.startDate, values.startTime);
  const end = combineDateTime(values.endDate, values.endTime);
  const valid = start && end && end > start;
  const duration = valid ? getDuration(start, end) : null;

  return (
    <AnimatePresence initial={false}>
      {duration && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-1 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-muted/40 p-4">
            <Stat
              icon={<Hourglass className="size-4" />}
              label="Total duration"
              value={duration.label}
            />
            <Stat
              icon={<Clock className="size-4" />}
              label="Estimated hours"
              value={`${duration.totalHours} hrs`}
            />
            <div className="col-span-2 flex items-center gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5 shrink-0" />
              <span>
                {formatDateTime(start!)} → {formatDateTime(end!)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
