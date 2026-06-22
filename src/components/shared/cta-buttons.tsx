import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { contact, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/icons";

type CtaButtonsProps = {
  className?: string;
  message?: string;
  size?: "default" | "lg";
  whatsappVariant?: "primary" | "secondary" | "glass" | "outline";
  callVariant?: "primary" | "secondary" | "glass" | "outline";
  whatsappLabel?: string;
  callLabel?: string;
};

/**
 * The two primary brand CTAs: WhatsApp (primary) and Call Now (secondary).
 * Rendered as real anchor links for accessibility and SEO.
 */
export function CtaButtons({
  className,
  message,
  size = "lg",
  whatsappVariant = "primary",
  callVariant = "glass",
  whatsappLabel = "WhatsApp Us",
  callLabel = "Call Now",
}: CtaButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <Button asChild size={size} variant={whatsappVariant}>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with HYPRRIDE on WhatsApp"
        >
          <WhatsAppIcon className="size-[18px]" />
          {whatsappLabel}
        </a>
      </Button>
      <Button asChild size={size} variant={callVariant}>
        <a href={contact.phoneHref} aria-label={`Call HYPRRIDE at ${contact.phone}`}>
          <Phone className="size-[18px]" />
          {callLabel}
        </a>
      </Button>
    </div>
  );
}
