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
    <div className="grid min-h-dvh place-items-center bg-muted/30 px-5 py-12">
      <div className="w-full max-w-sm">
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

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area · {new Date().getFullYear()} HYPRRIDE
        </p>
      </div>
    </div>
  );
}
