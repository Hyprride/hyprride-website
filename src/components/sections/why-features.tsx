"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { whyFeatures } from "@/lib/data";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 3200;
const easing = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * The "Why HYPRRIDE" reasons, shown one at a time and auto-cycling through all
 * of them. The side bars mark progress; hovering pauses, clicking a bar jumps.
 */
export function WhyFeatures() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % whyFeatures.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
    // `active` is a dep so a manual jump restarts the timer from the new card.
  }, [paused, active]);

  const feature = whyFeatures[active];
  const Icon = feature.icon;

  return (
    <div
      className="flex gap-4 sm:gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Side bars — one per reason, the active one grows + fills */}
      <div
        className="flex shrink-0 flex-col justify-center gap-2.5"
        role="tablist"
        aria-label="Why HYPRRIDE"
      >
        {whyFeatures.map((f, i) => (
          <button
            key={f.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={f.title}
            onClick={() => setActive(i)}
            className={cn(
              "w-1.5 rounded-full transition-all duration-300",
              i === active
                ? "h-11 bg-brand"
                : "h-6 bg-border hover:bg-brand/40",
            )}
          />
        ))}
      </div>

      {/* The rotating reason */}
      <div className="relative min-h-[300px] flex-1 sm:min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.article
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: easing }}
            className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 sm:p-10"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
              <Icon className="size-7" />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
              {feature.title}
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {feature.description}
            </p>
            <p className="mt-auto pt-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(whyFeatures.length).padStart(2, "0")}
            </p>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
