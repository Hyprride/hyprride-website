"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { contact, navLinks, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo, WhatsAppIcon } from "@/components/shared/icons";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-5 transition-all duration-500 sm:h-[4.5rem] sm:px-6 lg:px-8",
          scrolled &&
            "supports-[backdrop-filter]:bg-background/70 border-b border-border/60 backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <a href="#home" aria-label="HYPRRIDE home" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/book" aria-label="Book a bike">
              <CalendarCheck className="size-4" />
              Book now
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl lg:hidden sm:top-[4.5rem]"
          >
            <motion.nav
              className="container-px flex flex-col gap-1 py-6"
              aria-label="Mobile"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0 },
                  }}
                  className="border-b border-border/60 py-4 text-2xl font-semibold tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/book" onClick={() => setOpen(false)}>
                    <CalendarCheck className="size-[18px]" />
                    Book a bike
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <WhatsAppIcon className="size-[18px]" />
                    WhatsApp Us
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={contact.phoneHref} onClick={() => setOpen(false)}>
                    Call {contact.phone}
                  </a>
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
