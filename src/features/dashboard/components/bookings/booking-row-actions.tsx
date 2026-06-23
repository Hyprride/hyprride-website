"use client";

import * as React from "react";
import { Ban, Check, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BookingStatus } from "@/lib/supabase/database.types";
import { BookingDetailDrawer } from "./booking-detail-drawer";
import { useBookingMutations } from "./use-booking-mutations";

export function BookingRowActions({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { changeStatus, remove, pending } = useBookingMutations();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Booking actions"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDrawerOpen(true);
            }}
          >
            <Eye />
            View details
          </DropdownMenuItem>
          {status !== "Confirmed" && (
            <DropdownMenuItem onSelect={() => changeStatus(id, "Confirmed")}>
              <Check />
              Confirm
            </DropdownMenuItem>
          )}
          {status !== "Completed" && (
            <DropdownMenuItem onSelect={() => changeStatus(id, "Completed")}>
              <Check />
              Mark completed
            </DropdownMenuItem>
          )}
          {status !== "Cancelled" && (
            <DropdownMenuItem onSelect={() => changeStatus(id, "Cancelled")}>
              <Ban />
              Cancel
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            destructive
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BookingDetailDrawer
        bookingId={id}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete booking?</DialogTitle>
            <DialogDescription>
              This permanently removes the booking and its activity log. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={pending}
              onClick={() => remove(id, () => setConfirmOpen(false))}
            >
              Delete booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
