import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/shared/icons";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-5 py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="HYPRRIDE home">
            <Logo />
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Admin dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage bookings and customers.
          </p>
        </div>

        <div className="surface-sheen rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-7">
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area · {new Date().getFullYear()} HYPRRIDE
        </p>
      </div>
    </div>
  );
}
