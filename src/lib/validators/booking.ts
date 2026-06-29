import { z } from "zod";

import { BOOKING_RULES, PHONE } from "@/lib/constants/booking";
import { combineDateTime, getDuration, isWeekendRate } from "@/lib/utils/datetime";
import { normalizeIndianPhone, toE164IndianPhone } from "@/lib/utils/format";
import { billingSlabHours, estimateForDuration, getBikeBySlug } from "@/lib/data";

/**
 * Booking validation contract.
 *
 * The SAME schema powers live client-side feedback and authoritative
 * server-side validation inside the Server Action — the client can never be
 * trusted, so the server re-runs this on every submission.
 */

/** Canonical, all-strings shape of the form state (autosave-friendly). */
export type BookingFormValues = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  notes: string;
  /** Optional: bike slug the lead is interested in (from src/lib/data.ts). */
  vehicleInterest: string;
  /** Optional: chosen duration slab ("1".."24"); empty = custom end time. */
  slabHours: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export const EMPTY_BOOKING_FORM: BookingFormValues = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  emergencyName: "",
  emergencyPhone: "",
  notes: "",
  vehicleInterest: "",
  slabHours: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

const indianMobile = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .transform(normalizeIndianPhone)
  .refine(
    (d) => d.length === PHONE.nationalLength,
    `Enter a valid ${PHONE.nationalLength}-digit mobile number`,
  )
  .refine((d) => /^[6-9]/.test(d), "Indian mobile numbers start with 6–9");

const requiredString = (label: string) =>
  z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`);

/** Per-field schemas — used for fast, isolated on-blur validation in the hook. */
export const bookingFieldSchemas = {
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(BOOKING_RULES.limits.name, "That name is a little too long"),
  phone: indianMobile,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(180, "That email is too long"),
  address: z
    .string()
    .trim()
    .min(4, "Please enter your pickup / delivery address")
    .max(BOOKING_RULES.limits.address, "That address is too long"),
  emergencyName: z
    .string()
    .trim()
    .min(2, "Enter the contact's name")
    .max(BOOKING_RULES.limits.emergencyName, "That name is a little too long"),
  emergencyPhone: indianMobile,
  notes: z
    .string()
    .trim()
    .max(BOOKING_RULES.limits.notes, "Notes are a little too long")
    .optional(),
  vehicleInterest: z
    .string()
    .trim()
    .refine((v) => v === "" || Boolean(getBikeBySlug(v)), "Unknown bike")
    .optional(),
  slabHours: z.string().optional(),
  startDate: requiredString("Start date"),
  startTime: requiredString("Start time"),
  endDate: requiredString("End date"),
  endTime: requiredString("End time"),
} satisfies Record<keyof BookingFormValues, z.ZodTypeAny>;

/** Output payload, mapped to the database shape. */
export type ParsedBooking = {
  customer: { name: string; phone: string; email: string; address: string };
  emergencyContact: { contactName: string; contactPhone: string };
  booking: {
    startDatetime: string;
    endDatetime: string;
    totalHours: number;
    specialNotes: string | null;
    vehicleInterest: string | null;
    preferredSlabHours: number | null;
    estimatedAmount: number | null;
  };
};

/**
 * Full schema with cross-field datetime rules. On success it transforms the
 * raw form values into the normalized {@link ParsedBooking} payload.
 */
export const bookingFormSchema = z
  .object(bookingFieldSchemas)
  .superRefine((values, ctx) => {
    const start = combineDateTime(values.startDate, values.startTime);
    const end = combineDateTime(values.endDate, values.endTime);

    if (!start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Enter a valid start date and time",
      });
      return;
    }
    if (!end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Enter a valid end date and time",
      });
      return;
    }

    // Immediate / on-demand bookings are accepted — no minimum lead time —
    // but the start must not be in the past.
    if (start < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time can't be in the past",
      });
    }

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after the start time",
      });
      return;
    }

    const { totalHours } = getDuration(start, end);
    if (totalHours < BOOKING_RULES.minHours) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: `Minimum rental is ${BOOKING_RULES.minHours} hour`,
      });
    }
    if (totalHours > BOOKING_RULES.maxHours) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "That booking is longer than we currently support",
      });
    }
  })
  .transform((values): ParsedBooking => {
    const start = combineDateTime(values.startDate, values.startTime)!;
    const end = combineDateTime(values.endDate, values.endTime)!;
    const notes = values.notes?.trim();

    const { totalHours } = getDuration(start, end);
    const weekend = isWeekendRate(start);
    const vehicleInterest = values.vehicleInterest?.trim() || null;
    // The pricing slab the chosen duration bills against (for the booking
    // service, which is slab-based). Estimate is from the actual duration.
    const preferredSlabHours = billingSlabHours(totalHours);
    const estimatedAmount = vehicleInterest
      ? estimateForDuration(vehicleInterest, totalHours, weekend)
      : null;

    return {
      customer: {
        name: values.fullName.trim(),
        phone: toE164IndianPhone(values.phone),
        email: values.email.trim().toLowerCase(),
        address: values.address.trim(),
      },
      emergencyContact: {
        contactName: values.emergencyName.trim(),
        contactPhone: toE164IndianPhone(values.emergencyPhone),
      },
      booking: {
        startDatetime: start.toISOString(),
        endDatetime: end.toISOString(),
        totalHours,
        specialNotes: notes && notes.length > 0 ? notes : null,
        vehicleInterest,
        preferredSlabHours,
        estimatedAmount,
      },
    };
  });

/** Field groups → drives the multi-section progress indicator. */
export const BOOKING_SECTIONS = [
  {
    id: "personal",
    title: "Personal details",
    fields: ["fullName", "phone", "email", "address"],
  },
  {
    id: "emergency",
    title: "Emergency contact",
    fields: ["emergencyName", "emergencyPhone"],
  },
  {
    id: "schedule",
    title: "Your ride",
    fields: ["startDate", "startTime", "endDate", "endTime"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  fields: ReadonlyArray<keyof BookingFormValues>;
}>;
