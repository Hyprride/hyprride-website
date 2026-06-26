import { CalendarX2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { formatDateShort, formatTime, getDuration } from "@/lib/utils/datetime";
import { formatPhoneWithCode, getInitials } from "@/lib/utils/format";
import type { BookingWithCustomer } from "@/types/booking";
import { BookingRowActions } from "./booking-row-actions";

export function BookingsTable({ rows }: { rows: BookingWithCustomer[] }) {
  if (rows.length === 0) {
    return (
      <div className="grid place-items-center gap-3 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <CalendarX2 className="size-6" />
        </span>
        <div>
          <p className="font-medium text-foreground">No bookings found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Booking</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((booking) => {
          const customer = booking.customer;
          const duration = getDuration(
            new Date(booking.start_datetime),
            new Date(booking.end_datetime),
          );
          return (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-xs font-medium text-foreground">
                {booking.reference}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[11px]">
                      {getInitials(customer?.name ?? "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {customer?.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {customer?.email ?? ""}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {customer ? formatPhoneWithCode(customer.phone) : "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <p className="text-sm text-foreground">
                  {formatDateShort(booking.start_datetime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(booking.start_datetime)}
                </p>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <p className="text-sm text-foreground">
                  {formatDateShort(booking.end_datetime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(booking.end_datetime)}
                </p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {duration.label}
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <BookingRowActions id={booking.id} status={booking.status} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
