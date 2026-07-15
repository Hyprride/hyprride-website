import { z } from "zod";

import { BOOKING_RULES, DEFAULT_DIAL_CODE } from "@/lib/constants/booking";
import {
  combineDateTime,
  getDuration,
  isWeekendRate,
  isWithinReturnHours,
  isWithinStoreHours,
} from "@/lib/utils/datetime";
import { toE164 } from "@/lib/utils/format";
import {
  billingSlabHours,
  estimateForDuration,
  getBikeBySlug,
  unlimitedKmPriceForDuration,
} from "@/lib/data";

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
  /** Dial code for {@link phone}, e.g. "+91". */
  phoneCountry: string;
  email: string;
  /** Present address in Hyderabad — flat / room number. */
  addressFlat: string;
  /** Building / hostel / hotel / flat name. */
  addressBuilding: string;
  /** Street / area. */
  addressArea: string;
  emergencyName: string;
  emergencyPhone: string;
  /** Dial code for {@link emergencyPhone}. */
  emergencyPhoneCountry: string;
  notes: string;
  /** Required: bike slug the rider wants (from src/lib/data.ts). */
  vehicleInterest: string;
  /** Optional: chosen duration slab ("1".."24"); empty = custom end time. */
  slabHours: string;
  /** Optional: "true" when the rider opts into unlimited km. */
  unlimitedKm: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export const EMPTY_BOOKING_FORM: BookingFormValues = {
  fullName: "",
  phone: "",
  phoneCountry: DEFAULT_DIAL_CODE,
  email: "",
  addressFlat: "",
  addressBuilding: "",
  addressArea: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyPhoneCountry: DEFAULT_DIAL_CODE,
  notes: "",
  vehicleInterest: "",
  slabHours: "",
  unlimitedKm: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

const requiredString = (label: string) =>
  z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`);

/** Per-field schemas — used for fast, isolated on-blur validation in the hook. */
export const bookingFieldSchemas = {
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(BOOKING_RULES.limits.name, "That name is a little too long")
    .regex(/^\D+$/, "Name can't contain numbers")
    .refine((v) => /\p{L}/u.test(v), "Please enter a valid name"),
  // Phone format depends on the country — checked in the cross-field refine.
  phone: z.string().trim().min(1, "Phone number is required"),
  phoneCountry: z.string().min(1),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(180, "That email is too long"),
  addressFlat: z
    .string()
    .trim()
    .min(1, "Flat / room number is required")
    .max(60, "That's a little too long"),
  addressBuilding: z
    .string()
    .trim()
    .min(2, "Enter the building / hostel / hotel name")
    .max(120, "That's a little too long"),
  addressArea: z
    .string()
    .trim()
    .min(2, "Enter the street / area")
    .max(160, "That's a little too long"),
  emergencyName: z
    .string()
    .trim()
    .min(2, "Enter the contact's name")
    .max(BOOKING_RULES.limits.emergencyName, "That name is a little too long")
    .regex(/^\D+$/, "Name can't contain numbers")
    .refine((v) => /\p{L}/u.test(v), "Enter a valid name"),
  emergencyPhone: z.string().trim().min(1, "Contact phone is required"),
  emergencyPhoneCountry: z.string().min(1),
  notes: z
    .string()
    .trim()
    .max(BOOKING_RULES.limits.notes, "Notes are a little too long")
    .optional(),
  vehicleInterest: z
    .string()
    .trim()
    .min(1, "Please choose a bike")
    .refine((v) => Boolean(getBikeBySlug(v)), "Please choose a bike"),
  slabHours: z.string().optional(),
  unlimitedKm: z.string().optional(),
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
    isUnlimitedKm: boolean;
    unlimitedKmCharge: number | null;
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
    // Phone format depends on the chosen country. India: strict 10-digit
    // mobile (6-9…); everything else: a lenient 6–15 digit E.164 body.
    const checkPhone = (
      raw: string,
      dial: string,
      path: "phone" | "emergencyPhone",
    ) => {
      const d = raw.replace(/\D/g, "");
      if (d.length === 0) return; // "required" handled at field level
      const ok =
        dial === "+91"
          ? /^[6-9]\d{9}$/.test(d)
          : d.length >= 6 && d.length <= 15;
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [path],
          message:
            dial === "+91"
              ? "Enter a valid 10-digit mobile number"
              : "Enter a valid phone number",
        });
      }
    };
    checkPhone(values.phone, values.phoneCountry, "phone");
    checkPhone(values.emergencyPhone, values.emergencyPhoneCountry, "emergencyPhone");

    // Emergency contact must be a different number from the rider's own phone.
    const riderDigits = values.phone.replace(/\D/g, "");
    const emergencyDigits = values.emergencyPhone.replace(/\D/g, "");
    if (
      riderDigits.length > 0 &&
      riderDigits === emergencyDigits &&
      values.phoneCountry === values.emergencyPhoneCountry
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergencyPhone"],
        message: "Emergency contact can't be the same as your own number",
      });
    }

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

    // Store hours: open 7 AM–12 AM. No pickups during the closed window.
    if (!isWithinStoreHours(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Sorry, we're closed 12 AM–7 AM. Pick a time between 7 AM and 12 AM.",
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

    // Returns allowed up to 12 AM (midnight); closed window is 12:01 AM–7 AM.
    if (!isWithinReturnHours(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Returns must be by 12 AM (midnight) or from 7 AM onward.",
      });
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
    const isUnlimitedKm = values.unlimitedKm === "true";
    const unlimitedKmCharge = isUnlimitedKm
      ? unlimitedKmPriceForDuration(totalHours)
      : null;
    // Estimate = hourly/slab price + unlimited-km fee (if chosen). GST excluded.
    const hourly = vehicleInterest
      ? estimateForDuration(vehicleInterest, totalHours, weekend)
      : null;
    const estimatedAmount =
      hourly != null ? hourly + (unlimitedKmCharge ?? 0) : null;

    return {
      customer: {
        name: values.fullName.trim(),
        phone: toE164(values.phoneCountry, values.phone),
        email: values.email.trim().toLowerCase(),
        address: [values.addressFlat, values.addressBuilding, values.addressArea]
          .map((s) => s.trim())
          .filter(Boolean)
          .join(", "),
      },
      emergencyContact: {
        contactName: values.emergencyName.trim(),
        contactPhone: toE164(values.emergencyPhoneCountry, values.emergencyPhone),
      },
      booking: {
        startDatetime: start.toISOString(),
        endDatetime: end.toISOString(),
        totalHours,
        specialNotes: notes && notes.length > 0 ? notes : null,
        vehicleInterest,
        preferredSlabHours,
        isUnlimitedKm,
        unlimitedKmCharge,
        estimatedAmount,
      },
    };
  });

/** Field groups → drives the multi-section progress indicator. */
export const BOOKING_SECTIONS = [
  {
    id: "schedule",
    title: "Your ride",
    fields: ["vehicleInterest", "startDate", "startTime", "endDate", "endTime"],
  },
  {
    id: "personal",
    title: "Personal details",
    fields: [
      "fullName",
      "phone",
      "email",
      "addressFlat",
      "addressBuilding",
      "addressArea",
    ],
  },
  {
    id: "emergency",
    title: "Emergency contact",
    fields: ["emergencyName", "emergencyPhone"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  fields: ReadonlyArray<keyof BookingFormValues>;
}>;
