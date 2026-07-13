import { Bike, CalendarCheck, FileText, KeyRound } from "lucide-react";

import { steps } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { CtaButtons } from "@/components/shared/cta-buttons";

const stepIcons = [CalendarCheck, FileText, KeyRound, Bike];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Book your ride to the road in four steps"
          description="No app downloads, no logins — Book in just few taps and your ride is ready."
        />

        <StaggerGroup className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <StaggerItem key={step.number} className="h-full">
                <div className="relative flex h-full flex-col rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand text-[#1a0606] shadow-[0_8px_24px_-8px_rgba(220,38,38,0.6)]">
                      <Icon className="size-6" />
                    </span>
                    <span className="font-display text-4xl font-extrabold text-border">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <div className="mt-12 flex justify-center">
          <CtaButtons callVariant="outline" />
        </div>
      </div>
    </section>
  );
}
