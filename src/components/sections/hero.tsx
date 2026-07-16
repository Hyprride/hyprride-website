"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  BadgeIndianRupee,
  CalendarCheck,
  ChevronDown,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaButtons } from "@/components/shared/cta-buttons";
import { GoogleGIcon } from "@/components/shared/icons";
import { fleet, googleRating } from "@/lib/data";

const easing = [0.21, 0.47, 0.32, 0.98] as const;

/** Hero background rotates through the fleet, looping. */
const HERO_IMAGES = [
  { src: "/hero-jupiter-r.jpg", alt: "TVS Jupiter scooter ready to ride with HYPRRIDE" },
  { src: "/hero-ntorq-r.jpg", alt: "TVS Ntorq scooter ready to ride with HYPRRIDE" },
  { src: "/hero-apache-r.jpg", alt: "TVS Apache RTR ready to ride with HYPRRIDE" },
];
const ROTATE_MS = 5000;

/** At-a-glance promises — each is backed by a real HYPRRIDE policy. */
const TRUST_CHIPS = [
  { icon: ShieldCheck, label: "Helmet included" },
  { icon: BadgeIndianRupee, label: "No hidden charges" },
  { icon: Zap, label: "Instant booking" },
] as const;

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
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yShift = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yContent = prefersReduced ? 0 : yShift;
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Cycle the background image on a loop.
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_IMAGES.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  // Crossfading slide stack (reused full-bleed on desktop, as a band on mobile).
  const slides = (imgClassName: string) =>
    HERO_IMAGES.map((img, i) => (
      <motion.div
        key={img.src}
        initial={false}
        animate={{ opacity: i === active ? 1 : 0 }}
        transition={{ duration: 1, ease: easing }}
        className="absolute inset-0"
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={imgClassName}
        />
      </motion.div>
    ));

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden text-foreground sm:block"
    >
      {/* Red-to-black backdrop — sits behind the text on mobile; covered by photos on desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_60%_35%,#6d0f16_0%,#2c0708_52%,#080303_100%)]" />

      {/* Desktop: full-bleed rotating fleet photos */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {slides("object-cover object-[58%_center]")}
      </div>

      {/* Desktop legibility scrim — guarantees text contrast over any photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/5 bg-gradient-to-t from-black/55 to-transparent sm:block"
      />

      {/* Content: stacked on mobile (text over red, photo band below),
          centered overlay on desktop */}
      <div className="relative z-10 flex flex-1 flex-col sm:block">
        <motion.div
          style={{ y: yContent, opacity }}
          className="mx-auto flex w-full max-w-8xl flex-1 flex-col justify-start px-5 pb-8 pt-24 sm:min-h-[100svh] sm:justify-center sm:pb-28 sm:pt-28 lg:px-8"
        >
          <div className="max-w-2xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <a
                href={googleRating.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Rated ${googleRating.rating.toFixed(1)} out of 5 on Google${
                  googleRating.total > 0 ? ` from ${googleRating.total} reviews` : ""
                }`}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-3.5 py-1.5 text-xs font-semibold tracking-[0.04em] text-foreground/80 backdrop-blur-md transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <GoogleGIcon className="size-3.5" />
                {/* Google's own star amber — matches the testimonials section */}
                <span className="flex items-center gap-0.5 text-[#FBBC04]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" aria-hidden />
                  ))}
                </span>
                <span className="font-bold text-foreground">
                  {googleRating.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  on Google
                  {googleRating.total > 0 ? ` · ${googleRating.total} reviews` : ""}
                </span>
              </a>
            </motion.div>

            <h1 className="mt-6 font-display text-[13vw] font-extrabold leading-[0.92] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] sm:text-7xl md:text-8xl lg:text-[7.5rem]">
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
                className="block"
              >
                Ride It.
              </motion.span>
            </h1>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:mt-7 sm:text-xl"
            >
              Sanitised bikes, transparent pricing and instant booking — a
              premium ride you can genuinely trust, right across Hyderabad.
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" variant="book">
                <Link href="/book" aria-label="Book a bike">
                  <CalendarCheck className="size-[18px]" />
                  Book now
                </Link>
              </Button>
              <CtaButtons
                showCall={false}
                whatsappVariant="glass"
                whatsappLabel="WhatsApp Us"
              />
            </motion.div>

            {/* Trust chips — quick, real promises shown on every viewport */}
            <motion.ul
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 flex flex-wrap gap-2 sm:mt-7"
            >
              {TRUST_CHIPS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md"
                >
                  <Icon className="size-3.5 text-brand" aria-hidden />
                  {label}
                </li>
              ))}
            </motion.ul>

            <motion.dl
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-9 hidden max-w-lg grid-cols-3 gap-6 border-t border-white/25 pt-7 sm:mt-11 sm:grid"
            >
              {[
                { v: "₹79", l: "Starting from" },
                { v: String(fleet.length), l: "Bikes in the fleet" },
                { v: `${googleRating.rating.toFixed(1)}★`, l: "Google-rated" },
              ].map((stat) => (
                <div key={stat.l}>
                  <dt className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {stat.v}
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-white/70 sm:text-sm">
                    {stat.l}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </motion.div>

        {/* Mobile: rotating photo band beneath the text */}
        <div className="relative h-[42vh] w-full shrink-0 sm:hidden">
          {slides("object-cover object-[58%_center]")}
          {/* Blend the band into the text area above it */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#080303] to-transparent"
          />
        </div>
      </div>

      {/* Scroll indicator (desktop only) */}
      <motion.a
        href="#fleet"
        aria-label="Scroll to fleet"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white md:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Scroll
        </span>
        <span className="grid h-9 w-6 place-items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.span
            animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-brand"
          />
        </span>
        <ChevronDown className="size-4" />
      </motion.a>
    </section>
  );
}
