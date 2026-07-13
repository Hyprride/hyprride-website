/**
 * Single source of truth for brand, contact and navigation data.
 * Update these values here and they propagate across the entire site.
 */

export const siteConfig = {
  name: "HYPRRIDE",
  legalName: "HYPRRIDE Bike Rentals",
  tagline: "Rent It. Ride It.",
  description:
    "HYPRRIDE — Hyderabad's smart bike rentals. Clean bikes, transparent pricing and fast support. Rent a TVS Jupiter, Ntorq, Raider or Apache by the hour or by the day in Madhapur, Hyderabad.",
  shortDescription: "Hyderabad's Smart Bike Rentals",
  url: "https://hyprride.com",
  locale: "en_IN",
  hashtag: "#ridewithhyprride",
} as const;

export const contact = {
  phone: "+91 7032887133",
  phoneHref: "tel:+917032887133",
  phoneDigits: "917032887133",
  email: "hyprride@gmail.com",
  emailHref: "mailto:hyprride@gmail.com",
  whatsappMessage:
    "Hi HYPRRIDE 👋 I'd like to know more about renting a bike. Could you share availability and details?",
  address: {
    line1: "Vittal Rao Nagar",
    line2: "Madhapur",
    city: "Hyderabad",
    postalCode: "500081",
    full: "Vittal Rao Nagar, Madhapur, Hyderabad, 500081",
  },
  hours: "7:00 AM – 12:00 AM",
  hoursShort: "7 AM – 12 AM, daily",
  instagram: "https://www.instagram.com/hyprride",
  instagramHandle: "@hyprride",
  // The live Google listing — used for the embedded map and the "Visit us" link.
  mapsQuery: "Hyprride Bike Rentals, Madhapur, Hyderabad",
  mapsUrl: "https://maps.app.goo.gl/YT7fGP1YwZQJ9TXXA",
} as const;

/** Builds a WhatsApp deep link with an optional context-specific message. */
export function whatsappLink(message: string = contact.whatsappMessage) {
  return `https://wa.me/${contact.phoneDigits}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Fleet", href: "#fleet" },
  { label: "Story", href: "#story" },
  { label: "Why HYPRRIDE", href: "#why" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;
