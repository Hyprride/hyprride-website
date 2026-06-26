"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type FormSectionProps = {
  step: number;
  title: string;
  description?: string;
  complete?: boolean;
  children: React.ReactNode;
};

/** A numbered booking-form section with an animated completion badge. */
export function FormSection({
  step,
  title,
  description,
  complete,
  children,
}: FormSectionProps) {
  return (
    <section className="surface-sheen rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
      <header className="mb-5 flex items-start gap-3.5">
        <div
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors duration-300",
            complete
              ? "bg-brand text-white"
              : "bg-muted text-muted-foreground",
          )}
        >
          {complete ? (
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <Check className="size-4" strokeWidth={3} />
            </motion.span>
          ) : (
            step
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
