"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Check, ChevronDown, Sparkles } from "lucide-react";

import type { Bike } from "@/lib/data";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { BikeVisual } from "@/components/shared/bike-visual";
import { WhatsAppIcon } from "@/components/shared/icons";

type Plan = "weekday" | "weekend";

export function FleetCard({ bike }: { bike: Bike }) {
  const [plan, setPlan] = React.useState<Plan>("weekday");
  const [showDetails, setShowDetails] = React.useState(false);

  const message = `Hi HYPRRIDE 👋 I'm interested in renting the ${bike.name} ${bike.model} (${bike.engine}). Is it available?`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-elevated">
      {/* Photo runs full-bleed to the card edge; the article's overflow-hidden
          clips it to the card radius, so there's one frame instead of a photo
          boxed inside a stage inside a card. */}
      <div className="relative overflow-hidden">
        {bike.image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <Image
              src={bike.image}
              alt={`${bike.name} ${bike.model} (${bike.engine}) available to rent at HYPRRIDE`}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.05]"
            />
            <span className="absolute bottom-3 left-3 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 backdrop-blur-sm">
              {bike.engine}
            </span>
          </div>
        ) : (
          <BikeVisual
            category={bike.category}
            engine={bike.engine}
            accent={bike.accent}
            ghost={bike.model}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
          {bike.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
        {/* Always visible: name, tagline, from-price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {bike.name}{" "}
              <span className="text-muted-foreground">{bike.model}</span>
            </h3>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {bike.tagline}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              From
            </p>
            <p className="text-lg font-bold tracking-tight text-brand-700">
              ₹{bike.fromWeekday}
              <span className="text-xs font-medium text-muted-foreground">
                /hr
              </span>
            </p>
          </div>
        </div>

        {/* Collapsible: specs, pricing table, perks, WhatsApp */}
        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* per-bike highlight — the one-line reason to pick this ride */}
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-brand/5 px-3 py-2.5 text-[13px] font-medium leading-snug text-foreground/80">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
                {bike.highlight}
              </p>

              {/* spec chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {bike.specs.map((spec) => (
                  <span
                    key={spec.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    {spec.value}
                  </span>
                ))}
              </div>

              {/* plan toggle */}
              <div className="mt-6 inline-flex self-start rounded-full border border-border bg-muted/60 p-1 text-sm">
                {(["weekday", "weekend"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={cn(
                      "relative rounded-full px-4 py-1.5 font-medium capitalize transition-colors",
                      plan === p
                        ? "text-[#1a0606]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {plan === p ? (
                      <motion.span
                        layoutId={`plan-${bike.slug}`}
                        className="absolute inset-0 rounded-full bg-brand"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative z-10">{p}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {plan === "weekday"
                  ? "Mon 12 AM – Fri 5 PM"
                  : "Fri 5 PM – Mon 12 AM"}{" "}
                · prices exclusive of GST
              </p>

              {/* pricing table */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.dl
                    key={plan}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="divide-y divide-border"
                  >
                    {bike.pricing.map((tier) => (
                      <div
                        key={tier.duration}
                        className="flex items-center justify-between gap-4 px-4 py-2.5"
                      >
                        <dt className="text-sm font-medium">{tier.duration}</dt>
                        <dd className="flex items-baseline gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {tier.km} km
                          </span>
                          <span className="w-14 text-right text-sm font-semibold tabular-nums">
                            ₹{plan === "weekday" ? tier.weekday : tier.weekend}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </motion.dl>
                </AnimatePresence>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground/80">
                <Check className="size-4 text-brand" /> Helmet &amp; hygiene kit
                included
              </p>

              <Button asChild variant="outline" className="mt-4 w-full">
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enquire about the ${bike.name} ${bike.model} on WhatsApp`}
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always visible: show details toggle + book now */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide pricing" : "Show pricing"}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-300",
                showDetails && "rotate-180",
              )}
            />
          </Button>
          <Button asChild size="sm" variant="book">
            <Link
              href={`/book?bike=${bike.slug}`}
              aria-label={`Book the ${bike.name} ${bike.model}`}
            >
              <CalendarCheck className="size-4" />
              Book now
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
