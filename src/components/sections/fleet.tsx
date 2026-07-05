import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { fleet } from "@/lib/data";
import { FleetCard } from "@/components/sections/fleet-card";

export function Fleet() {
  return (
    <section id="fleet" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="The Fleet"
          title={
            <>
              Pick your ride.
              <br className="hidden sm:block" /> Every one is rider-ready.
            </>
          }
          description="A curated lineup of TVS scooters and motorcycles — sanitised, serviced and road-ready. Transparent hourly and daily pricing, helmet always included."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {fleet.map((bike) => (
            <StaggerItem key={bike.slug} className="h-full">
              <FleetCard bike={bike} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All prices are exclusive of GST. Applicable taxes are added at the time
          of billing.
        </p>
      </div>
    </section>
  );
}
