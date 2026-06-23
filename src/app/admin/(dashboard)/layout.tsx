import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { requireUser } from "@/features/auth/queries";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · HYPRRIDE Admin" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <DashboardShell userEmail={user.email ?? "admin"}>
      {children}
      <Toaster />
    </DashboardShell>
  );
}
