"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clapperboard,
  Moon,
  Mountain,
  ShoppingBag,
  Sunrise,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

type Moment = {
  title: string;
  caption: string;
  accent: string;
  icon: LucideIcon;
};

const moments: Moment[] = [
  {
    title: "Sunrise commutes",
    caption: "Beat the traffic. Start the day on your terms.",
    accent: "from-amber-500 via-brand-600 to-black",
    icon: Sunrise,
  },
  {
    title: "HITEC City runs",
    caption: "Office to meeting to home — effortlessly.",
    accent: "from-zinc-600 via-zinc-800 to-black",
    icon: Building2,
  },
  {
    title: "Weekend getaways",
    caption: "Escape the city. Chase the open road.",
    accent: "from-emerald-600 via-zinc-800 to-black",
    icon: Mountain,
  },
  {
    title: "Movie & dinner",
    caption: "Plans that move as fast as you do.",
    accent: "from-brand-500 via-brand-700 to-black",
    icon: Clapperboard,
  },
  {
    title: "Errand days",
    caption: "Shopping, banking, chores — all in one ride.",
    accent: "from-indigo-600 via-zinc-800 to-black",
    icon: ShoppingBag,
  },
  {
    title: "Late-night drives",
    caption: "From sunrise to midnight, the city is yours.",
    accent: "from-violet-700 via-zinc-900 to-black",
    icon: Moon,
  },
];

export function Gallery() {
  const scroller = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 480) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Ride moments"
            title="Made for every corner of Hyderabad"
            description="From sunrise to midnight, HYPRRIDE has your back — for every plan, every detour, every day."
          />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mask-fade-x mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 sm:px-6 lg:px-8"
      >
        {moments.map((moment) => (
          <article
            key={moment.title}
            className="group relative aspect-[3/4] w-[78vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-border sm:w-[340px]"
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-110",
                moment.accent,
              )}
            />
            <div className="absolute inset-0 bg-dot opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <moment.icon className="absolute right-6 top-6 size-9 text-white/70 transition-transform duration-500 group-hover:-translate-y-1" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-xl font-semibold tracking-tight">
                {moment.title}
              </h3>
              <p className="mt-1.5 text-sm text-white/70">{moment.caption}</p>
            </div>
          </article>
        ))}
        <div className="w-px shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
