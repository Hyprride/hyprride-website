"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/format";
import { Logo } from "@/components/shared/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/features/auth/actions";
import { DASHBOARD_NAV, activeNavLabel } from "../constants";

export function DashboardShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const title = activeNavLabel(pathname);

  return (
    <div className="min-h-dvh bg-app">
      {/* Desktop sidebar */}
      <aside className="surface-sheen fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent
          pathname={pathname}
          userEmail={userEmail}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
              <SidebarContent pathname={pathname} userEmail={userEmail} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-full border border-border text-foreground hover:bg-muted lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  userEmail,
}: {
  pathname: string;
  userEmail: string;
}) {
  return (
    <>
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/admin" aria-label="HYPRRIDE dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Dashboard">
        <ul className="space-y-1">
          {DASHBOARD_NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "bg-brand/10 font-semibold text-brand"
                      : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
                  )}
                  <item.icon className="size-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.soon && (
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                      Soon
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <Avatar className="size-8">
            <AvatarFallback className="text-[11px]">
              {getInitials(userEmail)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Admin</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut className="size-[18px]" />
            Logout
          </button>
        </form>
      </div>
    </>
  );
}
