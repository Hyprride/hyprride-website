"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";

import { CtaButtons } from "@/components/shared/cta-buttons";

const easing = [0.21, 0.47, 0.32, 0.98] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing, delay: 0.15 + i * 0.1 },
  }),
};

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#070708] text-white"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: yGlow }}
          className="absolute left-1/2 top-[-15%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-brand/30 blur-[120px]"
        />
        <motion.div
          style={{ y: yGlow }}
          className="absolute right-[-10%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-brand-700/30 blur-[120px]"
        />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070708]" />
      </div>

      {/* Floating bike silhouette */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: easing, delay: 0.2 }}
        style={{ y: yGlow }}
        className="pointer-events-none absolute inset-x-0 bottom-[8%] mx-auto flex justify-center"
      >
        <HeroBike className="w-[min(92vw,920px)] animate-float text-white/[0.07]" />
      </motion.div>

      <motion.div
        style={{ y: yContent, opacity }}
        className="relative z-10 mx-auto w-full max-w-8xl px-5 pb-28 pt-28 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md"
          >
            <span className="flex items-center gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-current" />
              ))}
            </span>
            HYPRRIDE · Hyderabad's Smart Bike Rentals
          </motion.div>

          <h1 className="mt-6 font-display text-[15vw] font-extrabold leading-[0.92] tracking-tight sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            <motion.span
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="block"
            >
              Rent It.
            </motion.span>
            <motion.span
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="block text-gradient-brand"
            >
              Ride It.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/65 sm:text-xl"
          >
            Clean bikes. Transparent pricing. Fast support. Built for Hyderabad
            riders — rent by the hour or by the day, no logins, no surprises.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9"
          >
            <CtaButtons callVariant="glass" />
          </motion.div>

          <motion.dl
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7"
          >
            {[
              { v: "4", l: "TVS models" },
              { v: "7AM–12AM", l: "Open daily" },
              { v: "₹79", l: "From / hour" },
            ].map((stat) => (
              <div key={stat.l}>
                <dt className="text-xl font-bold tracking-tight sm:text-2xl">
                  {stat.v}
                </dt>
                <dd className="mt-1 text-xs text-white/50 sm:text-sm">
                  {stat.l}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#fleet"
        aria-label="Scroll to fleet"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-colors hover:text-white md:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Scroll
        </span>
        <span className="grid h-9 w-6 place-items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-brand"
          />
        </span>
        <ChevronDown className="size-4" />
      </motion.a>
    </section>
  );
}

function HeroBike({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 240"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="130" cy="180" r="52" />
        <circle cx="130" cy="180" r="16" className="opacity-50" />
        <circle cx="470" cy="180" r="52" />
        <circle cx="470" cy="180" r="16" className="opacity-50" />
        <path d="M130 180 L 270 168 L 320 180" />
        <path d="M250 120 L 300 180" />
        <path d="M170 112 C 220 92 300 92 350 100" />
        <path d="M350 100 C 380 92 430 92 450 116" />
        <path d="M170 112 L 140 128" />
        <path d="M450 116 C 500 104 528 116 520 148" />
        <path d="M505 124 L 470 180" />
        <path d="M450 116 L 482 80" />
        <path d="M468 80 H 520" />
      </g>
    </svg>
  );
}
