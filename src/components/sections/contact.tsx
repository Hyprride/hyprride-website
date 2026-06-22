import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { contact, siteConfig } from "@/lib/site";
import { Reveal } from "@/components/shared/reveal";
import { CtaButtons } from "@/components/shared/cta-buttons";
import { InstagramGlyph } from "@/components/shared/icons";

const details = [
  {
    icon: MapPin,
    label: "Visit us",
    value: contact.address.full,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      contact.mapsQuery,
    )}`,
  },
  {
    icon: Clock,
    label: "Open daily",
    value: contact.hours,
  },
  {
    icon: Phone,
    label: "Call us",
    value: contact.phone,
    href: contact.phoneHref,
  },
  {
    icon: Mail,
    label: "Email us",
    value: contact.email,
    href: contact.emailHref,
  },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#070708] p-8 text-white sm:p-12 lg:p-16">
            {/* ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/25 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Contact
                </span>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                  Ready to ride? <br />
                  Let&apos;s get you on a bike.
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                  Message us on WhatsApp or call — we&apos;ll sort your booking in
                  minutes. {siteConfig.hashtag}
                </p>

                <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                  {details.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand">
                        <item.icon className="size-5" />
                      </span>
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-white/45">
                          {item.label}
                        </dt>
                        <dd className="mt-0.5 text-[15px] font-medium leading-snug">
                          {item.href ? (
                            <a
                              href={item.href}
                              target={
                                item.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="transition-colors hover:text-brand"
                            >
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <CtaButtons
                    whatsappVariant="primary"
                    callVariant="glass"
                    size="default"
                  />
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <InstagramGlyph className="size-5" />
                    {contact.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <iframe
                  title="HYPRRIDE location — Vittal Rao Nagar, Madhapur, Hyderabad"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    contact.mapsQuery,
                  )}&output=embed`}
                  className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
