import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]",
              light
                ? "border-white/15 bg-white/5 text-white/70"
                : "border-border bg-muted/50 text-muted-foreground",
            )}
          >
            <span className="size-1.5 rounded-full bg-brand" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.05}>
        <h2
          className={cn(
            "max-w-3xl text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl",
            light ? "text-white" : "text-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed sm:text-lg",
              light ? "text-white/60" : "text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
