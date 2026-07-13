"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

import { storyTimeline } from "@/lib/data";
import { Reveal } from "@/components/shared/reveal";

export function Story() {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="story" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Sticky intro + founder card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Our Story
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
                  Started with just two scooters and a simple idea.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  HYPRRIDE was born from real street experience in Hyderabad. We
                  built this brand to solve everyday commuting problems with
                  reliable, clean and trusted bikes. Every vehicle is regularly
                  serviced and maintained. No hidden surprises. No compromises.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <figure className="mt-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-red-700 via-red-950 to-black p-7 text-white">
                  <Quote className="size-7 text-white/40" />
                  <blockquote className="mt-3 text-lg font-medium leading-relaxed">
                    “We don’t just provide bikes — we deliver trust. Every ride
                    you take reflects the standards we believe in.”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-white/15 text-sm font-bold backdrop-blur">
                      HR
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        The Founder’s Promise
                      </span>
                      <span className="block text-xs text-white/60">
                        HYPRRIDE · Madhapur, Hyderabad
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-7">
            <div ref={lineRef} className="relative pl-8 sm:pl-10">
              {/* track */}
              <div className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-border sm:left-[15px]" />
              {/* animated progress */}
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-brand sm:left-[15px]"
              />

              <div className="space-y-10 sm:space-y-12">
                {storyTimeline.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.05}>
                    <div className="relative">
                      <span className="absolute -left-8 top-1 grid size-6 place-items-center rounded-full border border-border bg-background sm:-left-10">
                        <span className="size-2.5 rounded-full bg-brand" />
                      </span>
                      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
