"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Clock-face time picker with an AM/PM toggle. Tap the hour, then the minute
 * on the dial. Locale-independent (doesn't rely on the native time input) and
 * stores the canonical 24-hour "HH:mm" string the booking flow expects.
 */
export type TimeFieldProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,…,55

type Meridiem = "AM" | "PM";

function parse(value: string): { h12: number | null; min: number | null; ap: Meridiem } {
  const m = /^(\d{2}):(\d{2})$/.exec(value);
  if (!m) return { h12: null, min: null, ap: "AM" };
  const H = Number(m[1]);
  const ap: Meridiem = H >= 12 ? "PM" : "AM";
  const h12 = H % 12 === 0 ? 12 : H % 12;
  return { h12, min: Number(m[2]), ap };
}

function to24(h12: number, ap: Meridiem): number {
  const base = h12 % 12;
  return ap === "PM" ? base + 12 : base;
}

// ── Clock geometry ──
const SIZE = 232;
const C = SIZE / 2;
const R = 84;
function coords(fraction: number) {
  const a = fraction * 2 * Math.PI; // 0 = top, clockwise
  return { x: C + R * Math.sin(a), y: C - R * Math.cos(a) };
}

export function TimeField({
  id,
  label,
  value,
  onValueChange,
  onBlur,
  error,
  disabled,
  className,
}: TimeFieldProps) {
  const init = parse(value);
  const [h12, setH12] = React.useState<number | null>(init.h12);
  const [min, setMin] = React.useState<number | null>(init.min);
  const [ap, setAp] = React.useState<Meridiem>(init.ap);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"hours" | "minutes">("hours");
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Re-sync when the value changes externally (draft restore / reset).
  React.useEffect(() => {
    const current = h12 == null ? "" : `${pad(to24(h12, ap))}:${pad(min ?? 0)}`;
    if (value !== current) {
      if (!value) {
        setH12(null);
        setMin(null);
        setAp("AM");
      } else {
        const p = parse(value);
        setH12(p.h12);
        setMin(p.min);
        setAp(p.ap);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on outside click.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, onBlur]);

  const emit = (nh: number | null, nm: number | null, na: Meridiem) => {
    setH12(nh);
    setMin(nm);
    setAp(na);
    onValueChange(nh == null ? "" : `${pad(to24(nh, na))}:${pad(nm ?? 0)}`);
  };

  const pickHour = (n: number) => {
    emit(n, min ?? 0, ap);
    setMode("minutes");
  };
  const pickMinute = (v: number) => emit(h12, v, ap);
  const setMeridiem = (na: Meridiem) => emit(h12, min ?? 0, na);

  const hasError = Boolean(error);
  const display = h12 != null ? `${h12}:${pad(min ?? 0)} ${ap}` : "";

  // Active hand fraction (0 = 12 o'clock / 00 min, clockwise).
  const handFraction =
    mode === "hours"
      ? (h12 ?? 12) / 12
      : (min ?? 0) / 60;
  const hand = coords(handFraction);
  const showHand = mode === "hours" ? h12 != null : min != null;

  return (
    <div className={className} ref={rootRef}>
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={hasError}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-14 w-full items-center justify-between rounded-2xl border bg-background px-4 text-left transition-all duration-200",
            hasError
              ? "border-red-400 ring-2 ring-red-500/15"
              : open
                ? "border-brand ring-2 ring-brand/15"
                : "border-input hover:border-foreground/20",
            disabled && "cursor-not-allowed opacity-60 hover:border-input",
          )}
        >
          <span className="flex flex-col">
            <span
              className={cn(
                "text-xs font-medium",
                hasError ? "text-red-500" : open ? "text-brand" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "text-[15px]",
                display ? "text-foreground" : "text-muted-foreground/60",
              )}
            >
              {display || "Select time"}
            </span>
          </span>
          <Clock className="size-4 shrink-0 text-muted-foreground" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              role="dialog"
              className="absolute left-0 top-full z-50 mt-2 w-[272px] rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              {/* Digital read-out + AM/PM */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums">
                  <button
                    type="button"
                    onClick={() => setMode("hours")}
                    className={cn(mode === "hours" ? "text-brand" : "text-foreground/70")}
                  >
                    {h12 ?? "--"}
                  </button>
                  <span className="text-foreground/70">:</span>
                  <button
                    type="button"
                    onClick={() => setMode("minutes")}
                    className={cn(mode === "minutes" ? "text-brand" : "text-foreground/70")}
                  >
                    {min != null ? pad(min) : "--"}
                  </button>
                </div>
                <div className="flex flex-col overflow-hidden rounded-lg border border-border text-xs font-semibold">
                  {(["AM", "PM"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMeridiem(m)}
                      className={cn(
                        "px-2.5 py-1 transition-colors",
                        ap === m ? "bg-brand text-[#2a2208]" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock face */}
              <div
                className="relative mx-auto rounded-full bg-muted/50"
                style={{ width: SIZE, height: SIZE }}
              >
                <svg
                  width={SIZE}
                  height={SIZE}
                  className="pointer-events-none absolute inset-0"
                >
                  <circle cx={C} cy={C} r={3} className="fill-brand" />
                  {showHand && (
                    <>
                      <line
                        x1={C}
                        y1={C}
                        x2={hand.x}
                        y2={hand.y}
                        className="stroke-brand"
                        strokeWidth={2}
                      />
                      <circle cx={hand.x} cy={hand.y} r={18} className="fill-brand/20" />
                    </>
                  )}
                </svg>

                {mode === "hours"
                  ? HOURS.map((n) => {
                      const p = coords(n / 12);
                      const active = h12 === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => pickHour(n)}
                          style={{ left: p.x, top: p.y }}
                          className={cn(
                            "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-medium transition-colors",
                            active ? "bg-brand text-[#2a2208]" : "text-foreground hover:bg-brand/10",
                          )}
                        >
                          {n}
                        </button>
                      );
                    })
                  : MINUTES.map((v) => {
                      const p = coords(v / 60);
                      const active = min === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => pickMinute(v)}
                          style={{ left: p.x, top: p.y }}
                          className={cn(
                            "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-medium tabular-nums transition-colors",
                            active ? "bg-brand text-[#2a2208]" : "text-foreground hover:bg-brand/10",
                          )}
                        >
                          {pad(v)}
                        </button>
                      );
                    })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onBlur?.();
                }}
                className="mt-3 w-full rounded-xl bg-brand py-2 text-sm font-semibold text-[#2a2208] transition-colors hover:bg-brand/90"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
