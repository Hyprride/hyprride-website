import type { BookingFormValues } from "@/lib/validators/booking";
import type {
  BookingRow,
  CustomerRow,
  EmergencyContactRow,
  ActivityLogRow,
} from "@/lib/supabase/database.types";

/** Field-level errors keyed by form field, returned by the Server Action. */
export type BookingFieldErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

/** Discriminated result of the createBooking Server Action. */
export type BookingActionState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: BookingFieldErrors;
    }
  | {
      status: "success";
      reference: string;
      bookingId: string;
      message: string;
    };

export const INITIAL_BOOKING_STATE: BookingActionState = { status: "idle" };

/* ── Joined shapes consumed by the admin dashboard ──────────────────────── */

export type BookingWithCustomer = BookingRow & {
  customer: CustomerRow | null;
};

export type BookingDetail = BookingRow & {
  customer: (CustomerRow & { emergency_contacts: EmergencyContactRow[] }) | null;
  activity_logs: ActivityLogRow[];
};
