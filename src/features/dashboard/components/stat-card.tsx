import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AnimatedCounter, type CounterFormat } from "./animated-counter";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  /** Serializable formatter key (functions can't cross the RSC boundary). */
  format?: CounterFormat;
  /** Optional growth percentage (e.g. month-over-month). */
  delta?: number;
  accent?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  format,
  delta,
  accent = "text-brand bg-brand/10",
}: StatCardProps) {
  const showDelta = typeof delta === "number";
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="group surface-sheen relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
      {/* hover glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10",
            accent,
          )}
        >
          <Icon className="size-5" />
        </span>
        {showDelta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              positive
                ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta ?? 0)}%
          </span>
        )}
      </div>
      <p className="relative mt-4 text-[1.75rem] font-semibold leading-none tracking-tight text-foreground">
        <AnimatedCounter value={value} format={format} />
      </p>
      <p className="relative mt-1.5 text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
