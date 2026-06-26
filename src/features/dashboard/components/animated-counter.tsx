"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

import { formatCurrency } from "@/lib/utils/format";

/** Serializable formatter keys — safe to pass across the server→client boundary. */
export type CounterFormat = "number" | "currency" | "percent";

const FORMATTERS: Record<CounterFormat, (n: number) => string> = {
  number: (n) => n.toLocaleString("en-IN"),
  currency: (n) => formatCurrency(n),
  percent: (n) => `${n}%`,
};

/** Counts up to `value` once when scrolled into view. */
export function AnimatedCounter({
  value,
  format = "number",
  duration = 1,
}: {
  value: number;
  format?: CounterFormat;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return <span ref={ref}>{FORMATTERS[format](Math.round(display))}</span>;
}
