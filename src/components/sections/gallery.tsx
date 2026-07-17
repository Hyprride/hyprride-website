"use client";

import * as React from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Building2,
  Clapperboard,
  Moon,
  Mountain,
  ShoppingBag,
  Sunrise,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Moment = {
  title: string;
  caption: string;
  accent: string;
  icon: LucideIcon;
};

// Accents stay within the brand family — warm ambers, brand reds and neutral
// zincs, each melting into black — so the sequence reads as one premium system
// rather than a generic multi-colour reel.
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
    accent: "from-amber-600 via-zinc-800 to-black",
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
    accent: "from-stone-500 via-zinc-800 to-black",
    icon: ShoppingBag,
  },
  {
    title: "Late-night drives",
    caption: "From sunrise to midnight, the city is yours.",
    accent: "from-zinc-700 via-brand-900 to-black",
    icon: Moon,
  },
];

const TOTAL = moments.length;

/**
 * Opacity for one moment across the pinned scroll. Each moment owns an equal
 * slice of the track and crossfades with its neighbours over a shoulder at each
 * boundary — as one reaches 0.5 the next does too, so there is never a gap or a
 * double-exposure. The first and last clamp to fully visible at the track ends,
 * so the sequence opens and closes on a held frame rather than a half-fade.
 */
function useMomentOpacity(progress: MotionValue<number>, index: number) {
  const span = 1 / TOTAL;
  const start = index * span;
  const end = start + span;
  const shoulder = span * 0.3;
  const isFirst = index === 0;
  const isLast = index === TOTAL - 1;

  const input = isFirst
    ? [0, end - shoulder, end + shoulder]
    : isLast
      ? [start - shoulder, start + shoulder, 1]
      : [start - shoulder, start + shoulder, end - shoulder, end + shoulder];
  const output = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];

  return useTransform(progress, input, output);
}

function MomentBackdrop({
  progress,
  index,
  accent,
}: {
  progress: MotionValue<number>;
  index: number;
  accent: string;
}) {
  const opacity = useMomentOpacity(progress, index);
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className={cn("absolute inset-0 bg-gradient-to-br", accent)}
    />
  );
}

function MomentCopy({
  progress,
  index,
  moment,
}: {
  progress: MotionValue<number>;
  index: number;
  moment: Moment;
}) {
  const prefersReduced = useReducedMotion();
  const opacity = useMomentOpacity(progress, index);
  const span = 1 / TOTAL;
  // Slow vertical drift through the moment's slice — the parallax that makes it
  // read as camera movement rather than a slideshow.
  const drift = useTransform(
    progress,
    [index * span, index * span + span],
    [26, -26],
  );
  const Icon = moment.icon;

  return (
    <motion.div
      style={{ opacity, y: prefersReduced ? 0 : drift }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <Icon className="size-10 text-white/70 sm:size-12" aria-hidden />
      <h3 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
        {moment.title}
      </h3>
      <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
        {moment.caption}
      </p>
    </motion.div>
  );
}

/**
 * The signature section: a pinned, scroll-driven sequence of full-bleed colour
 * fields and large type. The tall outer track supplies the scroll distance; the
 * sticky child holds the frame while the moments crossfade through it.
 */
export function Gallery() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = React.useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL))));
  });

  return (
    <section ref={trackRef} className="relative h-[300vh] sm:h-[400vh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-black">
        {moments.map((m, i) => (
          <MomentBackdrop
            key={m.title}
            progress={scrollYProgress}
            index={i}
            accent={m.accent}
          />
        ))}
        <div aria-hidden className="absolute inset-0 bg-dot opacity-40" />
        {/* Vignette — seals the frame so the type sits in the light */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"
        />

        {/* pt-24 keeps the copy clear of the fixed navbar */}
        <div className="relative mx-auto flex h-full max-w-8xl flex-col px-5 pb-12 pt-24 sm:px-6 lg:px-8">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
            <span aria-hidden className="h-px w-8 bg-white/30" />
            Ride moments
          </p>
          <h2 className="sr-only">Made for every corner of Hyderabad</h2>

          <div className="relative flex-1">
            {moments.map((m, i) => (
              <MomentCopy
                key={m.title}
                progress={scrollYProgress}
                index={i}
                moment={m}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full origin-left bg-brand"
              />
            </div>
            <p className="text-xs font-semibold tabular-nums tracking-[0.2em] text-white/60">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(TOTAL).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
