# HYPRRIDE — Hyderabad's Smart Bike Rentals

> Rent It. Ride It.

A premium, motion-driven brand website for **HYPRRIDE**, a smart bike rental
service in Madhapur, Hyderabad. Built as a marketing & lead-generation site —
no logins, no payments — with WhatsApp and Call as the primary calls to action.

## Tech stack

- **Next.js 15** (App Router, React 19, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** + design tokens
- **shadcn-style UI** primitives (Radix Accordion, CVA Button)
- **Framer Motion** for subtle, premium motion
- **Lucide** icons
- **next-themes** for flash-free dark mode

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Production

```bash
npm run build
npm run start
```

## Project structure

```
src/
├── app/                  # App Router: layout, page, SEO routes (sitemap, robots, manifest)
│   ├── globals.css       # Design tokens + Tailwind layers
│   ├── layout.tsx        # Fonts, metadata, theme provider, JSON-LD
│   └── page.tsx          # Section composition
├── components/
│   ├── ui/               # Reusable primitives (button, accordion)
│   ├── shared/           # Cross-section helpers (Reveal, CTAs, icons, visuals)
│   ├── sections/         # Page sections (hero, fleet, story, faq, contact, …)
│   ├── seo/              # Structured data (JSON-LD)
│   ├── navbar.tsx
│   └── footer.tsx
└── lib/
    ├── site.ts           # Brand, contact info, nav links, WhatsApp helper
    ├── data.ts           # Fleet pricing, trust/why features, FAQ, testimonials
    └── utils.ts          # cn() class helper
```

## Editing content

All business content lives in two files so non-developers can update it safely:

- **`src/lib/site.ts`** — phone, email, address, hours, Instagram, nav links.
- **`src/lib/data.ts`** — fleet bikes & pricing, FAQs, testimonials, story.

Pricing is sourced from the HYPRRIDE brochure (weekday & weekend tiers, all
exclusive of GST).

## Notes

- The fleet visuals are self-contained SVG line-art — no external image assets
  are required, so the site renders identically offline. Swap in real
  photography via `next/image` when assets are available (`images.unsplash.com`
  is already allow-listed in `next.config.mjs`).
- The contact map uses Google Maps' keyless embed.
- Accessibility: skip link, semantic landmarks, focus-visible rings, reduced-motion
  support, and labelled interactive elements throughout.
