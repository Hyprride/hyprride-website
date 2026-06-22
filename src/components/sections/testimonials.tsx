import { Star } from "lucide-react";

import { testimonials, type Testimonial } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";

export function Testimonials() {
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden border-y border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loved by riders"
          title="Real rides. Real reviews."
          description="Hyderabad commuters, weekend explorers and night riders — here's what they say about HYPRRIDE."
        />
      </div>

      <div className="group relative mt-14 flex gap-5 overflow-hidden mask-fade-x">
        <div className="flex shrink-0 animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <TestimonialCard key={`a-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex w-[85vw] max-w-[420px] shrink-0 flex-col justify-between rounded-3xl border border-border bg-card p-7 sm:w-[420px]">
      <div>
        <div className="flex items-center gap-0.5 text-brand">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
        </div>
        <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">
          “{testimonial.quote}”
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
          {testimonial.initials}
        </span>
        <span>
          <span className="block text-sm font-semibold">{testimonial.name}</span>
          <span className="block text-xs text-muted-foreground">
            {testimonial.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
