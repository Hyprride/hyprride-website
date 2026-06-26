"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/queries";
import { getBookingDetail } from "./bookings-queries";
import { BOOKING_STATUSES } from "@/lib/constants/booking";
import type { BookingStatus } from "@/lib/supabase/database.types";
import type { BookingDetail } from "@/types/booking";

export type MutationResult = { ok: boolean; message: string };

/** Client-callable loader for the booking detail drawer. */
export async function loadBookingDetail(
  id: string,
): Promise<BookingDetail | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getBookingDetail(id);
}

/** Update a booking's status. The DB trigger records the transition. */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<MutationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authorized." };

  if (!BOOKING_STATUSES.includes(status)) {
    return { ok: false, message: "Invalid status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[updateBookingStatus]", error);
    return { ok: false, message: "Could not update the booking." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  return { ok: true, message: `Booking marked ${status}.` };
}

export async function deleteBooking(id: string): Promise<MutationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("[deleteBooking]", error);
    return { ok: false, message: "Could not delete the booking." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  return { ok: true, message: "Booking deleted." };
}
