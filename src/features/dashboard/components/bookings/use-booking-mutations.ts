"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  deleteBooking,
  updateBookingStatus,
} from "@/features/dashboard/bookings-actions";
import type { BookingStatus } from "@/lib/supabase/database.types";

/** Shared booking mutations with toast feedback + cache refresh. */
export function useBookingMutations() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const changeStatus = (
    id: string,
    status: BookingStatus,
    onDone?: () => void,
  ) =>
    startTransition(async () => {
      const res = await updateBookingStatus(id, status);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
        onDone?.();
      } else {
        toast.error(res.message);
      }
    });

  const remove = (id: string, onDone?: () => void) =>
    startTransition(async () => {
      const res = await deleteBooking(id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
        onDone?.();
      } else {
        toast.error(res.message);
      }
    });

  return { changeStatus, remove, pending };
}
