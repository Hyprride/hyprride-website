"use client";

import { motion } from "framer-motion";
import { ArrowRight, Copy, MessageCircle, Check } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { contact, whatsappLink } from "@/lib/site";

const steps = [
  "Our team reviews your request and checks availability.",
  "We confirm your bike and share pickup details on WhatsApp.",
  "Bring your driving licence + ID at pickup. Ride away.",
];

export function SuccessScreen({
  reference,
  onBookAnother,
}: {
  reference: string;
  onBookAnother: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12"
    >
      {/* Animated success mark */}
      <div className="relative mx-auto grid size-20 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-brand/15"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.25, 1], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="grid size-16 place-items-center rounded-full bg-brand text-[#1a0606]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
        >
          <motion.svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6 9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Booking request received
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Thanks for choosing HYPRRIDE. We&apos;ll confirm availability and reach
        out shortly.
      </p>

      {/* Reference */}
      <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-muted/50 px-5 py-3">
        <div className="text-left">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Booking reference
          </p>
          <p className="font-mono text-lg font-semibold text-foreground">
            {reference}
          </p>
        </div>
        <button
          type="button"
          onClick={copyReference}
          aria-label="Copy booking reference"
          className="grid size-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="size-4 text-brand" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>

      {/* Next steps */}
      <ol className="mt-8 space-y-3 text-left">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
              {i + 1}
            </span>
            <span className="text-sm text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1">
          <a
            href={whatsappLink(
              `Hi HYPRRIDE 👋 I just submitted a booking request (ref ${reference}). Could you confirm availability?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" />
            Message us on WhatsApp
          </a>
        </Button>
        <Button variant="outline" className="flex-1" onClick={onBookAnother}>
          Book another bike
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Need help now? Call{" "}
        <a href={contact.phoneHref} className="font-medium text-brand">
          {contact.phone}
        </a>
      </p>
    </motion.div>
  );
}
