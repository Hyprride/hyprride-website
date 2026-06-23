"use client";

import * as React from "react";

import { BOOKING_DRAFT_KEY } from "@/lib/constants/booking";
import {
  EMPTY_BOOKING_FORM,
  type BookingFormValues,
} from "@/lib/validators/booking";

const DEBOUNCE_MS = 600;

function isMeaningful(values: BookingFormValues): boolean {
  return Object.values(values).some((v) => v.trim().length > 0);
}

function readDraft(): BookingFormValues | null {
  try {
    const raw = window.localStorage.getItem(BOOKING_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BookingFormValues>;
    // Merge against the canonical shape so new fields never break old drafts.
    const merged = { ...EMPTY_BOOKING_FORM, ...parsed };
    return isMeaningful(merged) ? merged : null;
  } catch {
    return null;
  }
}

/**
 * Locally persists the in-progress booking so a refresh or accidental
 * navigation never loses the customer's work. Restores once on mount and
 * autosaves (debounced) on every change.
 */
export function useBookingDraft({
  values,
  onRestore,
}: {
  values: BookingFormValues;
  onRestore: (draft: BookingFormValues) => void;
}) {
  const [restored, setRestored] = React.useState(false);
  const onRestoreRef = React.useRef(onRestore);
  onRestoreRef.current = onRestore;

  // Restore once, after mount (avoids SSR hydration mismatch).
  React.useEffect(() => {
    const draft = readDraft();
    if (draft) onRestoreRef.current(draft);
    setRestored(true);
  }, []);

  // Debounced autosave — only after the initial restore has run.
  React.useEffect(() => {
    if (!restored) return;
    const id = window.setTimeout(() => {
      try {
        if (isMeaningful(values)) {
          window.localStorage.setItem(
            BOOKING_DRAFT_KEY,
            JSON.stringify(values),
          );
        } else {
          window.localStorage.removeItem(BOOKING_DRAFT_KEY);
        }
      } catch {
        /* storage unavailable (private mode / quota) — fail silently */
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [values, restored]);

  const clearDraft = React.useCallback(() => {
    try {
      window.localStorage.removeItem(BOOKING_DRAFT_KEY);
    } catch {
      /* noop */
    }
  }, []);

  return { restored, clearDraft };
}
