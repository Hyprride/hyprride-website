"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUS_META } from "@/lib/constants/booking";
import { formatTime } from "@/lib/utils/datetime";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { BookingDetailDrawer } from "@/features/dashboard/components/bookings/booking-detail-drawer";
import { loadCalendarBookings } from "@/features/dashboard/calendar-actions";
import type { CalendarEvent } from "@/features/dashboard/calendar-queries";

type View = "month" | "week" | "day";

const WEEK_OPTS = { weekStartsOn: 1 } as const; // Monday
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayKey = (d: Date | string) =>
  format(typeof d === "string" ? parseISO(d) : d, "yyyy-MM-dd");

export function CalendarView() {
  const [view, setView] = React.useState<View>("month");
  const [cursor, setCursor] = React.useState<Date>(new Date());
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const range = React.useMemo(() => {
    if (view === "month") {
      return {
        start: startOfWeek(startOfMonth(cursor), WEEK_OPTS),
        end: endOfWeek(endOfMonth(cursor), WEEK_OPTS),
      };
    }
    if (view === "week") {
      return {
        start: startOfWeek(cursor, WEEK_OPTS),
        end: endOfWeek(cursor, WEEK_OPTS),
      };
    }
    return { start: startOfDay(cursor), end: endOfDay(cursor) };
  }, [view, cursor]);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    loadCalendarBookings(
      range.start.toISOString(),
      endOfDay(range.end).toISOString(),
    ).then((data) => {
      if (active) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [range.start, range.end]);

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = dayKey(e.start);
      const list = map.get(key);
      if (list) list.push(e);
      else map.set(key, [e]);
    }
    return map;
  }, [events]);

  const openBooking = (id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };
  const openDay = (day: Date) => {
    setCursor(day);
    setView("day");
  };

  const navigate = (dir: -1 | 1) => {
    setCursor((c) =>
      view === "month"
        ? addMonths(c, dir)
        : view === "week"
          ? addWeeks(c, dir)
          : addDays(c, dir),
    );
  };

  const title =
    view === "month"
      ? format(cursor, "MMMM yyyy")
      : view === "week"
        ? `${format(range.start, "d MMM")} – ${format(range.end, "d MMM yyyy")}`
        : format(cursor, "EEEE, d MMM yyyy");

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {loading && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
            Today
          </Button>
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-r-none"
              onClick={() => navigate(-1)}
              aria-label="Previous"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-l-none border-l-0"
              onClick={() => navigate(1)}
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex rounded-full border border-border p-0.5">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors",
                  view === v
                    ? "bg-brand text-[#2a2208]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {view === "month" && (
          <MonthGrid
            cursor={cursor}
            eventsByDay={eventsByDay}
            onEvent={openBooking}
            onDay={openDay}
          />
        )}
        {view === "week" && (
          <WeekGrid
            range={range}
            eventsByDay={eventsByDay}
            onEvent={openBooking}
            onDay={openDay}
          />
        )}
        {view === "day" && (
          <DayAgenda
            day={cursor}
            events={eventsByDay.get(dayKey(cursor)) ?? []}
            onEvent={openBooking}
          />
        )}
      </Card>

      <BookingDetailDrawer
        bookingId={selectedId ?? ""}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

/* ── Event chip ─────────────────────────────────────────────────────────── */
function EventChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick: () => void;
}) {
  const meta = BOOKING_STATUS_META[event.status];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`${event.reference} · ${event.customerName} · ${event.status}`}
      className={cn(
        "flex w-full items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium",
        meta.badge,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} />
      <span className="truncate">{event.customerName}</span>
    </button>
  );
}

/* ── Month ──────────────────────────────────────────────────────────────── */
function MonthGrid({
  cursor,
  eventsByDay,
  onEvent,
  onDay,
}: {
  cursor: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEvent: (id: string) => void;
  onDay: (day: Date) => void;
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), WEEK_OPTS),
    end: endOfWeek(endOfMonth(cursor), WEEK_OPTS),
  });

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const list = eventsByDay.get(dayKey(day)) ?? [];
          const muted = !isSameMonth(day, cursor);
          return (
            <div
              key={day.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => onDay(day)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onDay(day);
                }
              }}
              className={cn(
                "min-h-[104px] cursor-pointer border-b border-r border-border p-1.5 text-left align-top transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&:nth-child(7n)]:border-r-0",
                muted && "bg-muted/20",
              )}
            >
              <span
                className={cn(
                  "inline-grid size-6 place-items-center rounded-full text-xs",
                  isToday(day)
                    ? "bg-brand font-semibold text-[#2a2208]"
                    : muted
                      ? "text-muted-foreground/50"
                      : "text-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {list.slice(0, 3).map((e) => (
                  <EventChip key={e.id} event={e} onClick={() => onEvent(e.id)} />
                ))}
                {list.length > 3 && (
                  <span className="block px-1.5 text-[11px] font-medium text-muted-foreground">
                    +{list.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Week ───────────────────────────────────────────────────────────────── */
function WeekGrid({
  range,
  eventsByDay,
  onEvent,
  onDay,
}: {
  range: { start: Date; end: Date };
  eventsByDay: Map<string, CalendarEvent[]>;
  onEvent: (id: string) => void;
  onDay: (day: Date) => void;
}) {
  const days = eachDayOfInterval({ start: range.start, end: range.end });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((day) => {
        const list = eventsByDay.get(dayKey(day)) ?? [];
        return (
          <div
            key={day.toISOString()}
            className="min-h-[160px] border-b border-r border-border p-2 last:border-r-0"
          >
            <button
              type="button"
              onClick={() => onDay(day)}
              className="mb-2 flex items-center gap-1.5 text-sm"
            >
              <span className="font-medium text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs",
                  isToday(day)
                    ? "bg-brand font-semibold text-[#2a2208]"
                    : "text-foreground",
                )}
              >
                {format(day, "d")}
              </span>
            </button>
            <div className="space-y-1">
              {list.length === 0 ? (
                <p className="text-[11px] text-muted-foreground/60">—</p>
              ) : (
                list.map((e) => (
                  <EventChip key={e.id} event={e} onClick={() => onEvent(e.id)} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Day ────────────────────────────────────────────────────────────────── */
function DayAgenda({
  day,
  events,
  onEvent,
}: {
  day: Date;
  events: CalendarEvent[];
  onEvent: (id: string) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="grid place-items-center gap-2 py-16 text-center">
        <p className="font-medium text-foreground">No bookings</p>
        <p className="text-sm text-muted-foreground">
          Nothing scheduled for {format(day, "d MMM yyyy")}.
        </p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {events.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            onClick={() => onEvent(e.id)}
            className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
          >
            <div className="w-28 shrink-0 text-sm">
              <p className="font-medium text-foreground">
                {formatTime(e.start)}
              </p>
              <p className="text-xs text-muted-foreground">
                to {formatTime(e.end)}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {e.customerName}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {e.reference}
              </p>
            </div>
            <StatusBadge status={e.status} />
          </button>
        </li>
      ))}
    </ul>
  );
}
