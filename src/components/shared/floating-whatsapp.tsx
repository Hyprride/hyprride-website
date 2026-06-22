"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/shared/icons";

export function FloatingWhatsApp() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with HYPRRIDE on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="group fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] sm:bottom-7 sm:right-7"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-pulse-ring" />
          <WhatsAppIcon className="relative size-7 transition-transform group-hover:scale-110" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
