"use client";

import * as React from "react";

import {
  BOOKING_SECTIONS,
  EMPTY_BOOKING_FORM,
  bookingFormSchema,
  type BookingFormValues,
} from "@/lib/validators/booking";
import type { BookingFieldErrors } from "@/types/booking";

type FieldName = keyof BookingFormValues;
type BoolMap = Partial<Record<FieldName, boolean>>;

export type SectionStatus = {
  id: string;
  title: string;
  complete: boolean;
  hasError: boolean;
  index: number;
};

/** Derives the full error map from the shared Zod schema. */
function deriveErrors(values: BookingFormValues): BookingFieldErrors {
  const result = bookingFormSchema.safeParse(values);
  if (result.success) return {};
  const errors: BookingFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as FieldName | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/**
 * Headless booking-form state: controlled values, touched tracking,
 * Zod-derived errors, per-section completion, and submit orchestration.
 * Keeps the form component declarative and the validation logic in one place.
 */
export function useBookingForm() {
  const [values, setValues] = React.useState<BookingFormValues>(EMPTY_BOOKING_FORM);
  const [touched, setTouched] = React.useState<BoolMap>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<BookingFieldErrors>({});

  const errors = React.useMemo(() => deriveErrors(values), [values]);

  const setField = React.useCallback((name: FieldName, value: string) => {
    setValues((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
    setServerErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setMany = React.useCallback((partial: Partial<BookingFormValues>) => {
    setValues((prev) => ({ ...prev, ...partial }));
  }, []);

  const blur = React.useCallback((name: FieldName) => {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  const reset = React.useCallback(() => {
    setValues(EMPTY_BOOKING_FORM);
    setTouched({});
    setSubmitAttempted(false);
    setServerErrors({});
  }, []);

  /** Error to actually render for a field (touched OR after a submit attempt). */
  const visibleError = React.useCallback(
    (name: FieldName): string | undefined => {
      if (serverErrors[name]) return serverErrors[name];
      if (touched[name] || submitAttempted) return errors[name];
      return undefined;
    },
    [errors, serverErrors, touched, submitAttempted],
  );

  const isValid = Object.keys(errors).length === 0;

  const sections: SectionStatus[] = React.useMemo(
    () =>
      BOOKING_SECTIONS.map((section, index) => ({
        id: section.id,
        title: section.title,
        index,
        complete: section.fields.every((f) => !errors[f]),
        hasError: section.fields.some(
          (f) => (touched[f] || submitAttempted) && Boolean(errors[f]),
        ),
      })),
    [errors, touched, submitAttempted],
  );

  const completedSections = sections.filter((s) => s.complete).length;
  const progress = Math.round((completedSections / sections.length) * 100);

  /** Marks every field touched and returns whether the form is valid. */
  const validateAll = React.useCallback((): boolean => {
    setSubmitAttempted(true);
    const allTouched: BoolMap = {};
    (Object.keys(EMPTY_BOOKING_FORM) as FieldName[]).forEach(
      (f) => (allTouched[f] = true),
    );
    setTouched(allTouched);
    return Object.keys(deriveErrors(values)).length === 0;
  }, [values]);

  const firstErrorField = React.useMemo<FieldName | null>(() => {
    const order = Object.keys(EMPTY_BOOKING_FORM) as FieldName[];
    return order.find((f) => errors[f]) ?? null;
  }, [errors]);

  return {
    values,
    errors,
    setField,
    setMany,
    blur,
    reset,
    visibleError,
    isValid,
    sections,
    progress,
    completedSections,
    validateAll,
    firstErrorField,
    setServerErrors,
    submitAttempted,
  };
}

export type BookingFormApi = ReturnType<typeof useBookingForm>;
