import { ArrowRight } from "lucide-react";

import { whyFeatures } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/icons";

export function Why() {
  return (
    <section
      id="why"
      className="scroll-mt-20 border-y border-border bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Why HYPRRIDE
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
                  A rental experience built on{" "}
                  <span className="text-gradient-brand">responsibility</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  Consistency, transparency and respect for every customer — the
                  non-negotiables behind every HYPRRIDE ride.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <Button asChild size="lg" className="mt-7">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-[18px]" />
                    Book your ride
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {whyFeatures.map((feature) => (
                <StaggerItem key={feature.title}>
                  <article className="group h-full rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                        <feature.icon className="size-[22px]" />
                      </span>
                      <h3 className="text-base font-semibold tracking-tight">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
