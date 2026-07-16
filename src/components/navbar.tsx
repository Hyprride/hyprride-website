"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { contact, navLinks, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo, WhatsAppIcon } from "@/components/shared/icons";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("home");
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav link for the section crossing mid-viewport.
  React.useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        // Solid, opaque bar — no glass/blur/transparency anywhere.
        "fixed inset-x-0 top-0 z-50 border-b border-border bg-background transition-shadow duration-300",
        scrolled && "shadow-soft",
      )}
    >
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <a href="#home" aria-label="HYPRRIDE home" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = active === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-0 rounded-full bg-muted"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
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
          <Button asChild size="sm" variant="book" className="hidden sm:inline-flex">
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
            className="fixed inset-0 top-16 z-40 bg-background lg:hidden sm:top-[4.5rem]"
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
                <Button asChild size="lg" variant="book">
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
