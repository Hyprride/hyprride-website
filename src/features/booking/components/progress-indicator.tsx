"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SectionStatus } from "../hooks/use-booking-form";

type ProgressIndicatorProps = {
  sections: SectionStatus[];
  progress: number;
};

/** Animated multi-step progress: a fill bar plus per-section status pills. */
export function ProgressIndicator({
  sections,
  progress,
}: ProgressIndicatorProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Your booking
        </span>
        <span className="text-sm font-semibold tabular-nums text-brand-700">
          {progress}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 24 }}
        />
      </div>

      <ol className="mt-4 space-y-2.5">
        {sections.map((section) => (
          <li key={section.id} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors duration-300",
                section.complete
                  ? "bg-brand text-[#1a0606]"
                  : section.hasError
                    ? "bg-red-500/15 text-red-500"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {section.complete ? (
                <Check className="size-3" strokeWidth={3} />
              ) : (
                section.index + 1
              )}
            </span>
            <span
              className={cn(
                "transition-colors",
                section.complete
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {section.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
