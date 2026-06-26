import { CalendarView } from "@/features/dashboard/components/calendar/calendar-view";

export const metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Calendar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Color-coded bookings across month, week and day views.
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
