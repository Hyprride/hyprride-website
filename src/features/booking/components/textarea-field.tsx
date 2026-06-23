"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
};

/** Floating-label textarea with hint, character counter and inline error. */
export function TextareaField({
  id,
  label,
  value,
  onValueChange,
  onBlur,
  error,
  hint,
  maxLength,
  rows = 4,
  disabled,
}: TextareaFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const floated = focused || value.length > 0;
  const hasError = Boolean(error);

  return (
    <div>
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
        <textarea
          id={id}
          value={value}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={hasError}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full resize-none bg-transparent px-4 pb-3 pt-6 text-[15px] text-foreground outline-none placeholder:text-transparent disabled:cursor-not-allowed"
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 origin-left transition-all duration-200",
            floated ? "top-2 text-xs font-medium" : "top-5 text-[15px]",
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
            <span key="hint" className="text-xs text-muted-foreground/70">
              {hint}
            </span>
          )}
        </AnimatePresence>

        {maxLength ? (
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
}
