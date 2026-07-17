"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * Persistent mobile "Book now" action. The navbar hides its Book/WhatsApp
 * buttons below the sm breakpoint, so once the hero scrolls away the only
 * mobile CTA is the floating WhatsApp bubble. This restores an always-present
 * booking path for the highest-intent (mobile) traffic. It sits to the left of
 * the WhatsApp bubble so the two never overlap, and mirrors the bubble's
 * appear-on-scroll timing. Hidden from sm up, where the navbar CTAs return.
 */
export function MobileBookingBar() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed bottom-5 left-5 right-[5.5rem] z-50 sm:hidden"
        >
          <Link
            href="/book"
            aria-label="Book a bike"
            className={cn(
              buttonVariants({ variant: "book" }),
              "h-14 w-full text-base",
            )}
          >
            <CalendarCheck />
            Book now
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
