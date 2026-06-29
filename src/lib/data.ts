import {
  ShieldCheck,
  Sparkles,
  Headset,
  Wrench,
  Timer,
  Eye,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  FLEET                                                                      */
/* -------------------------------------------------------------------------- */

export type PriceTier = {
  duration: string;
  weekday: number;
  weekend: number;
  km: number;
};

export type Bike = {
  slug: string;
  name: string;
  model: string;
  category: "Scooter" | "Motorcycle";
  engine: string;
  fuel: string;
  tagline: string;
  highlight: string;
  accent: string; // tailwind gradient classes for the visual fallback
  image?: string; // product photo in /public/fleet; falls back to BikeVisual
  specs: { label: string; value: string }[];
  pricing: PriceTier[];
  fromWeekday: number;
};

const scooterAccent = "from-zinc-700 via-zinc-800 to-black";
const sportAccent = "from-brand-600 via-brand-700 to-black";

export const fleet: Bike[] = [
  {
    slug: "tvs-jupiter-110",
    name: "TVS Jupiter",
    model: "110",
    category: "Scooter",
    engine: "110cc",
    fuel: "Petrol",
    tagline: "The effortless city commuter.",
    highlight: "Best value for daily Hyderabad commutes.",
    accent: scooterAccent,
    image: "/fleet/tvs-jupiter-110.jpg",
    specs: [
      { label: "Engine", value: "110cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Automatic scooter" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 79, weekend: 99, km: 15 },
      { duration: "3 Hours", weekday: 179, weekend: 219, km: 40 },
      { duration: "5 Hours", weekday: 279, weekend: 329, km: 60 },
      { duration: "7 Hours", weekday: 339, weekend: 409, km: 80 },
      { duration: "12 Hours", weekday: 389, weekend: 469, km: 100 },
      { duration: "24 Hours", weekday: 499, weekend: 599, km: 120 },
    ],
    fromWeekday: 79,
  },
  {
    slug: "tvs-jupiter-125",
    name: "TVS Jupiter",
    model: "125",
    category: "Scooter",
    engine: "125cc",
    fuel: "Petrol",
    tagline: "Comfort-first 125cc commuter.",
    highlight: "Roomy, refined and easy for everyday city rides.",
    accent: scooterAccent,
    image: "/fleet/tvs-jupiter-125.jpg",
    specs: [
      { label: "Engine", value: "125cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Automatic scooter" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 99, weekend: 119, km: 15 },
      { duration: "3 Hours", weekday: 219, weekend: 259, km: 40 },
      { duration: "5 Hours", weekday: 309, weekend: 369, km: 60 },
      { duration: "7 Hours", weekday: 369, weekend: 439, km: 80 },
      { duration: "12 Hours", weekday: 499, weekend: 509, km: 100 },
      { duration: "24 Hours", weekday: 599, weekend: 699, km: 120 },
    ],
    fromWeekday: 99,
  },
  {
    slug: "tvs-ntorq-125",
    name: "TVS Ntorq",
    model: "125",
    category: "Scooter",
    engine: "125cc",
    fuel: "Petrol",
    tagline: "Smart, sporty and connected.",
    highlight: "Bluetooth console with a punchy 125cc motor.",
    accent: scooterAccent,
    image: "/fleet/tvs-ntorq-125.jpg",
    specs: [
      { label: "Engine", value: "125cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Automatic scooter" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 99, weekend: 119, km: 15 },
      { duration: "3 Hours", weekday: 219, weekend: 259, km: 40 },
      { duration: "5 Hours", weekday: 309, weekend: 369, km: 60 },
      { duration: "7 Hours", weekday: 369, weekend: 439, km: 80 },
      { duration: "12 Hours", weekday: 499, weekend: 509, km: 100 },
      { duration: "24 Hours", weekday: 599, weekend: 699, km: 120 },
    ],
    fromWeekday: 99,
  },
  {
    slug: "tvs-raider-125",
    name: "TVS Raider",
    model: "125",
    category: "Motorcycle",
    engine: "125cc",
    fuel: "Petrol",
    tagline: "The Gen-Z street machine.",
    highlight: "Light, agile and fun for weaving the city.",
    accent: sportAccent,
    image: "/fleet/tvs-raider-125.jpg",
    specs: [
      { label: "Engine", value: "125cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Manual motorcycle" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 99, weekend: 119, km: 15 },
      { duration: "3 Hours", weekday: 219, weekend: 259, km: 40 },
      { duration: "5 Hours", weekday: 309, weekend: 369, km: 60 },
      { duration: "7 Hours", weekday: 369, weekend: 439, km: 80 },
      { duration: "12 Hours", weekday: 499, weekend: 509, km: 100 },
      { duration: "24 Hours", weekday: 599, weekend: 699, km: 120 },
    ],
    fromWeekday: 99,
  },
  {
    slug: "yamaha-rayzr-125",
    name: "Yamaha RayZR",
    model: "125",
    category: "Scooter",
    engine: "125cc",
    fuel: "Petrol",
    tagline: "Lightweight street style.",
    highlight: "Featherlight and fuel-efficient for the daily grind.",
    accent: scooterAccent,
    image: "/fleet/yamaha-rayzr-125.jpg",
    specs: [
      { label: "Engine", value: "125cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Automatic scooter" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 99, weekend: 119, km: 15 },
      { duration: "3 Hours", weekday: 219, weekend: 259, km: 40 },
      { duration: "5 Hours", weekday: 309, weekend: 369, km: 60 },
      { duration: "7 Hours", weekday: 369, weekend: 439, km: 80 },
      { duration: "12 Hours", weekday: 499, weekend: 509, km: 100 },
      { duration: "24 Hours", weekday: 599, weekend: 699, km: 120 },
    ],
    fromWeekday: 99,
  },
  {
    slug: "tvs-apache-rtr-160",
    name: "TVS Apache RTR",
    model: "160",
    category: "Motorcycle",
    engine: "160cc",
    fuel: "Petrol",
    tagline: "Race-bred performance.",
    highlight: "The most powerful ride in the HYPRRIDE fleet.",
    accent: sportAccent,
    image: "/fleet/tvs-apache-rtr-160.jpg",
    specs: [
      { label: "Engine", value: "160cc" },
      { label: "Fuel", value: "Petrol" },
      { label: "Type", value: "Manual motorcycle" },
      { label: "Helmet", value: "Included" },
    ],
    pricing: [
      { duration: "1 Hour", weekday: 119, weekend: 139, km: 15 },
      { duration: "3 Hours", weekday: 259, weekend: 309, km: 40 },
      { duration: "5 Hours", weekday: 369, weekend: 449, km: 60 },
      { duration: "7 Hours", weekday: 439, weekend: 529, km: 80 },
      { duration: "12 Hours", weekday: 509, weekend: 609, km: 100 },
      { duration: "24 Hours", weekday: 699, weekend: 839, km: 120 },
    ],
    fromWeekday: 119,
  },
];

/** Lookup a fleet bike by its slug (the value stored as `vehicle_interest`). */
export function getBikeBySlug(slug: string): Bike | undefined {
  return fleet.find((b) => b.slug === slug);
}

/** Map a slab duration (hours) to the label used in `Bike.pricing`. */
const SLAB_LABEL: Record<number, string> = {
  1: "1 Hour",
  3: "3 Hours",
  5: "5 Hours",
  7: "7 Hours",
  12: "12 Hours",
  24: "24 Hours",
};

/**
 * Indicative rental price for a bike + slab, weekday vs weekend. Returns null
 * when the bike/slab is unknown. This is the website estimate only — the
 * booking service computes the authoritative, snapshotted price at booking.
 */
export function estimatePrice(
  slug: string,
  slabHours: number,
  weekend: boolean,
): number | null {
  const bike = getBikeBySlug(slug);
  const label = SLAB_LABEL[slabHours];
  if (!bike || !label) return null;
  const tier = bike.pricing.find((p) => p.duration === label);
  if (!tier) return null;
  return weekend ? tier.weekend : tier.weekday;
}

const SLABS = [1, 3, 5, 7, 12, 24];

/**
 * The pricing slab (hours) a given duration bills against — rounded up to the
 * next slab, capped at the 24h slab. e.g. 4h → 5h slab, 8h → 12h slab.
 */
export function billingSlabHours(totalHours: number): number {
  const capped = Math.min(Math.max(totalHours, 0), 24);
  return SLABS.find((s) => s >= capped) ?? 24;
}

/**
 * Indicative estimate for an ACTUAL rental duration (start → end). Multi-day
 * rentals bill full 24h days plus the slab covering the remainder. Returns null
 * when the bike is unknown or the duration is non-positive. Website estimate
 * only — the booking service computes the authoritative price.
 */
export function estimateForDuration(
  slug: string,
  totalHours: number,
  weekend: boolean,
): number | null {
  if (!getBikeBySlug(slug) || totalHours <= 0) return null;
  const fullDays = Math.floor(totalHours / 24);
  const remHours = totalHours - fullDays * 24;
  let total = 0;
  if (fullDays > 0) {
    const dayPrice = estimatePrice(slug, 24, weekend);
    if (dayPrice == null) return null;
    total += fullDays * dayPrice;
  }
  if (remHours > 0) {
    const remPrice = estimatePrice(slug, billingSlabHours(remHours), weekend);
    if (remPrice == null) return null;
    total += remPrice;
  }
  return total;
}

/** Included km per slab (bike-independent across the current fleet). */
const SLAB_KM: Record<number, number> = {
  1: 15,
  3: 40,
  5: 60,
  7: 80,
  12: 100,
  24: 120,
};

/** Included km for an actual rental duration (full days + remainder slab). */
export function kmForDuration(totalHours: number): number {
  if (totalHours <= 0) return 0;
  const fullDays = Math.floor(totalHours / 24);
  const remHours = totalHours - fullDays * 24;
  return (
    fullDays * SLAB_KM[24] + (remHours > 0 ? SLAB_KM[billingSlabHours(remHours)] : 0)
  );
}

/**
 * One-time fee to unlock unlimited km, by slab: ₹50 for 1/3/5/7h, ₹79 for
 * 12/24h. Multi-day durations map to the 24h slab (₹79).
 */
export function unlimitedKmPrice(slabHours: number): number {
  return slabHours <= 7 ? 50 : 79;
}

/** Unlimited-km fee for an actual duration, based on its billing slab. */
export function unlimitedKmPriceForDuration(totalHours: number): number {
  return unlimitedKmPrice(billingSlabHours(totalHours));
}

/* -------------------------------------------------------------------------- */
/*  WHY HYPRRIDE                                                               */
/* -------------------------------------------------------------------------- */

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyFeatures: Feature[] = [
  {
    title: "Regular servicing",
    description: "Serviced and inspected every two months — no exceptions.",
    icon: Wrench,
  },
  {
    title: "Helmet sanitization",
    description: "UV-sterilised helmets for a clean, safe ride every time.",
    icon: Sparkles,
  },
  {
    title: "Transparency",
    description: "No hidden charges. No last-minute surprises. Ever.",
    icon: Eye,
  },
  {
    title: "Fast support",
    description: "Immediate help on call or WhatsApp whenever you need it.",
    icon: Headset,
  },
  {
    title: "Well-maintained fleet",
    description: "Regular checks keep every ride smooth and hassle-free.",
    icon: ShieldCheck,
  },
  {
    title: "Reliable rides",
    description: "Ready-to-ride vehicles you can depend on, day or night.",
    icon: HeartHandshake,
  },
];

/* -------------------------------------------------------------------------- */
/*  HOW IT WORKS                                                               */
/* -------------------------------------------------------------------------- */

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    number: "01",
    title: "Contact us",
    description:
      "Message us on WhatsApp or call. Tell us the bike and the time you need.",
  },
  {
    number: "02",
    title: "Submit documents",
    description:
      "Share a valid driving licence and ID. Quick, simple verification.",
  },
  {
    number: "03",
    title: "Pick up bike",
    description:
      "Collect a sanitised, ready-to-ride bike with helmet from Madhapur.",
  },
  {
    number: "04",
    title: "Ride freely",
    description:
      "Hit the road. Extend anytime — support is one message away.",
  },
];

/* -------------------------------------------------------------------------- */
/*  STORY                                                                      */
/* -------------------------------------------------------------------------- */

export const storyTimeline = [
  {
    title: "Started with just two scooters",
    body: "Two scooters and a simple idea. We learned from real riders, solving everyday commute problems one ride at a time.",
  },
  {
    title: "Built from real street experience",
    body: "Every lesson came from the streets, not a classroom. From breakdowns to busy days, we've seen it all — and built a service riders can truly rely on.",
  },
  {
    title: "Solving Hyderabad's commute",
    body: "Hyderabad moves fast — and so should you. We reduce waiting, stress and travel uncertainty to make daily commuting smoother and smarter.",
  },
  {
    title: "Building a national brand",
    body: "Today we're building a smarter, more reliable way to move in the city — and a brand India can trust from sunrise to midnight.",
  },
];

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS                                                               */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  /** Optional per-review star count (1–5). Defaults to 5 if omitted. */
  rating?: number;
  /** Optional, e.g. "2 weeks ago" — shown under the name when present. */
  date?: string;
};

/**
 * Aggregate Google rating shown in the hero badge + testimonials heading.
 * ── EDIT THESE MANUALLY to match your live Google listing ──
 *   rating → your star average (e.g. 4.9)
 *   total  → total number of Google reviews
 *   url    → your Google Maps listing (used for the "read reviews" links)
 */
export const googleRating: { rating: number; total: number; url: string } = {
  rating: 5.0,
  total: 0,
  url: "https://maps.app.goo.gl/JB8WNXKwanKzzUnU9",
};

/**
 * ── REPLACE THESE WITH REAL GOOGLE REVIEWS ──
 * Copy the text + name from your Google reviews. `initials` is the avatar
 * fallback; `rating` and `date` are optional.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Booked an Ntorq for a weekend trip. The bike was spotless, fully fuelled and the helmet was freshly sanitised. Pricing was exactly what they quoted — zero surprises.",
    name: "Karthik R.",
    role: "Software engineer, Madhapur",
    initials: "KR",
  },
  {
    quote:
      "I rent for my daily commute to HITEC City. Quick WhatsApp booking, bikes are always well maintained, and support replies in minutes. Genuinely reliable.",
    name: "Sneha P.",
    role: "Product designer, Gachibowli",
    initials: "SP",
  },
  {
    quote:
      "Took the Apache RTR for a night ride to the outskirts. Smooth machine, transparent hourly pricing and a hygiene kit in the box. Felt premium end to end.",
    name: "Aditya M.",
    role: "Weekend rider",
    initials: "AM",
  },
  {
    quote:
      "Needed a bike last minute for a hospital visit. They sorted it within the hour, no hidden charges. From sunrise to midnight, they really do have your back.",
    name: "Fatima S.",
    role: "Student, Hyderabad",
    initials: "FS",
  },
  {
    quote:
      "The Jupiter was perfect for running errands all day — meeting, shopping, dinner. Light, easy and affordable. Will definitely rent again.",
    name: "Rahul V.",
    role: "Marketing consultant",
    initials: "RV",
  },
];

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What documents are required to rent a bike?",
    answer:
      "A valid driving licence and a government-issued photo ID (Aadhaar, passport or similar). Verification is quick and done at pickup — message us on WhatsApp and we'll guide you through it.",
  },
  {
    question: "Is there a security deposit?",
    answer:
      "A refundable security deposit may apply depending on the bike and duration. The exact amount is shared upfront before you confirm — no hidden charges, ever. Ask us on WhatsApp for your specific booking.",
  },
  {
    question: "What is the fuel policy?",
    answer:
      "Bikes are handed over ready-to-ride with fuel for your included kilometres. You cover fuel for the distance you ride, and we recommend returning the bike with a comparable level. Each plan includes free kilometres — extra distance is billed at a transparent per-km rate.",
  },
  {
    question: "Are there late return charges?",
    answer:
      "Returning on time keeps it simple. If you're running late, just message us to extend — late returns without notice are charged on an hourly basis. Timely communication almost always avoids extra cost.",
  },
  {
    question: "How do I open the boot space and fuel tank?",
    answer:
      "TVS Jupiter: keep the key in the OFF position, then press, hold and turn the key right to open the fuel tank; turn the key left to unlock the boot. TVS Ntorq: the lock is on the rear left — tilt the key forward to open the fuel tank and backward to unlock the boot.",
  },
  {
    question: "How do I start the vehicles?",
    answer:
      "For the Jupiter, Ntorq, Raider 125 and Apache RTR: insert the key and turn it ON, wait for the speedometer to load, make sure the side stand is up, confirm the kill switch is ON, then press the self-start button.",
  },
  {
    question: "Can I extend my ride?",
    answer:
      "Absolutely. Rides are flexible — just message us on WhatsApp before your time ends and we'll extend your booking subject to availability, at transparent rates.",
  },
];
