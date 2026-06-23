"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

/** Counts up to `value` once when scrolled into view. */
export function AnimatedCounter({
  value,
  format = (n) => n.toLocaleString("en-IN"),
  duration = 1,
}: {
  value: number;
  format?: (n: number) => string;
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

  return <span ref={ref}>{format(Math.round(display))}</span>;
}
