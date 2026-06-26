import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  CalendarDays,
  BarChart3,
  MessageSquare,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Marks pages that are scaffolded but not yet fully built. */
  soon?: boolean;
};

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare, soon: true },
  { label: "AI Assistant", href: "/admin/ai-assistant", icon: Sparkles, soon: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, soon: true },
];

/** Resolves the active nav item for a given pathname (longest match wins). */
export function activeNavLabel(pathname: string): string {
  const match = [...DASHBOARD_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    );
  return match?.label ?? "Dashboard";
}
