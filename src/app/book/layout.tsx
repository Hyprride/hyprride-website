import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/icons";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a bike",
  description: `Reserve a clean, serviced bike from ${siteConfig.legalName} in minutes. Transparent pricing, helmet included, fast confirmation.`,
  alternates: { canonical: "/book" },
};

export default function BookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-app">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="HYPRRIDE home" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <ArrowLeft className="size-4" />
              Back to site
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>{children}</main>
      <Toaster />
    </div>
  );
}
