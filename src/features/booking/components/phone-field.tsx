"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { COUNTRY_CODES } from "@/lib/constants/booking";

/**
 * Phone input with a country-code dropdown (India on top / default) and a
 * plain digits-only number field — no spacing, so it stores like "9876543210".
 */
export type PhoneFieldProps = {
  id: string;
  label: string;
  /** National number, digits only. */
  value: string;
  /** Selected dial code, e.g. "+91". */
  country: string;
  onValueChange: (value: string) => void;
  onCountryChange: (country: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
};

export function PhoneField({
  id,
  label,
  value,
  country,
  onValueChange,
  onCountryChange,
  onBlur,
  error,
  className,
}: PhoneFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const hasError = Boolean(error);
  const floated = focused || value.length > 0;
  const maxDigits = country === "+91" ? 10 : 15;

  return (
    <div className={className}>
      <div
        className={cn(
          "relative flex h-14 items-center rounded-2xl border bg-background transition-all duration-200",
          hasError
            ? "border-red-400 ring-2 ring-red-500/15"
            : focused
              ? "border-brand ring-2 ring-brand/15"
              : "border-input hover:border-foreground/20",
        )}
      >
        <select
          aria-label="Country code"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          onBlur={onBlur}
          className="h-full shrink-0 rounded-l-2xl bg-transparent pl-4 pr-1 text-[15px] text-foreground outline-none [color-scheme:light] cursor-pointer"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} title={c.label}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>

        <span className="mr-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />

        <div className="relative h-full flex-1">
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={value}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            placeholder=" "
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            onChange={(e) =>
              onValueChange(e.target.value.replace(/\D/g, "").slice(0, maxDigits))
            }
            className="h-full w-full bg-transparent pl-1 pr-4 pt-4 text-[15px] text-foreground outline-none placeholder:text-transparent"
          />
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute origin-left transition-all duration-200",
              floated
                ? "left-1 top-2 text-xs font-medium"
                : "left-1 top-1/2 -translate-y-1/2 text-[15px]",
              hasError
                ? "text-red-500"
                : focused
                  ? "text-brand"
                  : "text-muted-foreground",
            )}
          >
            {label}
          </label>
        </div>
      </div>

      <div className="mt-1.5 flex min-h-[1rem] items-start px-1">
        <AnimatePresence mode="wait" initial={false}>
          {hasError ? (
            <motion.p
              key="error"
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1 text-xs font-medium text-red-500"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </motion.p>
          ) : (
            <span key="spacer" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
