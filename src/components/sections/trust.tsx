import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { trustFeatures } from "@/lib/data";

export function Trust() {
  return (
    <section className="relative border-y border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why riders trust us"
          title="Premium standards on every single ride"
          description="No fine print, no compromises. Every HYPRRIDE bike is held to a standard we'd ride ourselves."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustFeatures.map((feature) => (
            <StaggerItem key={feature.title}>
              <article className="group h-full rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
