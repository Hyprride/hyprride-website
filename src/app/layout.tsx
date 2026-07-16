import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Social share image (Open Graph + Twitter). A real fleet photo from /public,
 * sized for large-summary cards — matters most for WhatsApp/Instagram shares,
 * HYPRRIDE's primary channels. Resolved to an absolute URL via metadataBase.
 */
const ogImage = {
  url: "/hero-apache-r.jpg",
  width: 1376,
  height: 768,
  alt: `${siteConfig.name} — ${siteConfig.shortDescription}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.shortDescription}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "bike rentals Hyderabad",
    "scooter rental Madhapur",
    "rent bike Hyderabad",
    "TVS Ntorq rental",
    "TVS Jupiter rental",
    "TVS Apache rental",
    "self drive bike Hyderabad",
    "HYPRRIDE",
    "HITEC City bike rental",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  category: "travel",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.shortDescription}`,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.shortDescription}`,
    description: siteConfig.description,
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#f3ead7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <MotionProvider>
            <a
              href="#fleet"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1a0606]"
            >
              Skip to content
            </a>
            {children}
          </MotionProvider>
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
