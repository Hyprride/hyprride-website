import { Mail, MapPin, Phone } from "lucide-react";

import { contact, navLinks, siteConfig, whatsappLink } from "@/lib/site";
import { InstagramGlyph, Logo, WhatsAppIcon } from "@/components/shared/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {siteConfig.shortDescription}. Clean bikes, transparent pricing and
              fast support — from sunrise to midnight, HYPRRIDE has your back.
            </p>
            <p className="mt-4 text-sm font-medium text-brand">
              {siteConfig.hashtag}
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[15px] text-foreground/80 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Visit & Reach Us
            </h3>
            <ul className="mt-4 space-y-3.5 text-[15px]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-brand" />
                <span className="text-foreground/80">{contact.address.full}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-[18px] shrink-0 text-brand" />
                <a
                  href={contact.phoneHref}
                  className="text-foreground/80 transition-colors hover:text-brand"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-[18px] shrink-0 text-brand" />
                <a
                  href={contact.emailHref}
                  className="text-foreground/80 transition-colors hover:text-brand"
                >
                  {contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              >
                <WhatsAppIcon className="size-[18px]" />
              </a>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              >
                <InstagramGlyph className="size-[18px]" />
              </a>
              <a
                href={contact.phoneHref}
                aria-label="Call"
                className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              >
                <Phone className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Open daily · {contact.hours}
          </p>
        </div>
      </div>
    </footer>
  );
}
