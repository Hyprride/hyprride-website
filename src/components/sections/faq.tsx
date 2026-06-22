import { faqs } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButtons } from "@/components/shared/cta-buttons";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know before you ride. Still unsure? We're a message away."
        />

        <Reveal className="mt-12">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal className="mt-12" delay={0.05}>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-muted/40 p-8 text-center">
            <p className="text-lg font-semibold tracking-tight">
              Still have a question?
            </p>
            <CtaButtons
              size="default"
              callVariant="outline"
              message="Hi HYPRRIDE 👋 I have a quick question before booking."
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
