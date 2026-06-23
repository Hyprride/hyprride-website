"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type FloatingFieldProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "tel" | "date" | "time";
  error?: string;
  prefix?: string;
  /** Transform applied on every change (e.g. live phone formatting). */
  format?: (raw: string) => string;
  maxLength?: number;
  showCounter?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Apple-grade text field: floating label, animated focus ring, friendly
 * inline error, optional leading prefix and live character counter.
 */
export const FloatingField = React.forwardRef<
  HTMLInputElement,
  FloatingFieldProps
>(function FloatingField(
  {
    id,
    label,
    value,
    onValueChange,
    onBlur,
    type = "text",
    error,
    prefix,
    format,
    maxLength,
    showCounter,
    autoComplete,
    inputMode,
    min,
    disabled,
    className,
  },
  ref,
) {
  const [focused, setFocused] = React.useState(false);
  // Native date/time pickers always render content, so keep the label up.
  const alwaysFloat = type === "date" || type === "time";
  const floated = focused || value.length > 0 || alwaysFloat;
  const hasError = Boolean(error);

  return (
    <div className={className}>
      <div
        className={cn(
          "relative rounded-2xl border bg-background transition-all duration-200",
          hasError
            ? "border-red-400 ring-2 ring-red-500/15"
            : focused
              ? "border-brand ring-2 ring-brand/15"
              : "border-input hover:border-foreground/20",
          disabled && "opacity-60",
        )}
      >
        {prefix && (
          <span
            className={cn(
              "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground transition-opacity duration-200",
              floated ? "opacity-100" : "opacity-0",
            )}
          >
            {prefix}
          </span>
        )}

        <input
          id={id}
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          min={min}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onChange={(e) =>
            onValueChange(format ? format(e.target.value) : e.target.value)
          }
          className={cn(
            "h-14 w-full bg-transparent pt-4 text-[15px] text-foreground outline-none",
            "placeholder:text-transparent disabled:cursor-not-allowed",
            prefix ? "pl-[3.4rem] pr-4" : "px-4",
            "[color-scheme:light] dark:[color-scheme:dark]",
          )}
        />

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute origin-left transition-all duration-200",
            floated
              ? "left-4 top-2 text-xs font-medium"
              : "left-4 top-1/2 -translate-y-1/2 text-[15px]",
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

      <div className="mt-1.5 flex min-h-[1rem] items-start justify-between gap-2 px-1">
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

        {showCounter && maxLength ? (
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums",
              value.length >= maxLength
                ? "text-red-500"
                : "text-muted-foreground/60",
            )}
          >
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});
