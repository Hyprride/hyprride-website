"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, ChevronDown, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      {/* Background — TVS Apache RTR 160 photo with cinematic dark scrims */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: easing }}
          className="absolute inset-0"
        >
          <Image
            src="/hero-bike.jpg"
            alt="Premium motorcycle ready to ride with HYPRRIDE"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Left→right scrim keeps the headline readable over the bike */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-[#070708]/80 to-[#070708]/10" />
        {/* Top + bottom fade to blend into the page */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-[#070708]/60" />

        {/* Brand glow accent */}
        <motion.div
          style={{ y: yGlow }}
          className="absolute right-[-6%] top-[8%] h-[44vh] w-[44vh] rounded-full bg-brand/25 blur-[130px]"
        />
      </div>

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
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
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
