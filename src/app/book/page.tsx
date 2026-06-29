import { Sparkles } from "lucide-react";

import { BookingForm } from "@/features/booking/components/booking-form";
import { siteConfig } from "@/lib/site";

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="size-3.5 text-brand" />
          Booking
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
          Reserve your ride
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Pick your bike and duration for an instant estimate, then share your
          details — we&apos;ll confirm availability fast. Clean, serviced bikes
          with a sanitised helmet — {siteConfig.hashtag}
        </p>
      </div>

      <BookingForm />
    </div>
  );
}
