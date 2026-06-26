"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Bell,
  Building2,
  Monitor,
  Moon,
  Receipt,
  ShieldCheck,
  Sun,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { contact, siteConfig } from "@/lib/site";

const TABS = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "pricing", label: "Pricing & tax", icon: Receipt },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: ShieldCheck },
  { id: "appearance", label: "Appearance", icon: Monitor },
  { id: "profile", label: "Profile", icon: UserCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPanel({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = React.useState<TabId>("business");

  return (
    <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <t.icon className="size-[18px]" />
            {t.label}
          </button>
        ))}
      </nav>

      <div>
        {tab === "business" && <BusinessTab />}
        {tab === "pricing" && <PricingTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "team" && <TeamTab userEmail={userEmail} />}
        {tab === "appearance" && <AppearanceTab />}
        {tab === "profile" && <ProfileTab userEmail={userEmail} />}
      </div>
    </div>
  );
}

/* ── Reusable bits ──────────────────────────────────────────────────────── */
function Section({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      {footer && (
        <div className="mt-6 flex justify-end border-t border-border pt-5">
          {footer}
        </div>
      )}
    </Card>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} disabled />
    </div>
  );
}

function Toggle({
  label,
  description,
  on,
}: {
  label: string;
  description: string;
  on?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          on ? "bg-brand" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            on ? "left-[1.125rem]" : "left-0.5",
          )}
        />
      </span>
    </div>
  );
}

const ComingSoonButton = () => (
  <Button disabled>Save changes</Button>
);

/* ── Tabs ───────────────────────────────────────────────────────────────── */
function BusinessTab() {
  return (
    <Section
      title="Business information"
      description="Shown across the public site. Editing from here is coming soon."
      footer={<ComingSoonButton />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand name" defaultValue={siteConfig.name} />
        <Field label="Legal name" defaultValue={siteConfig.legalName} />
        <Field label="Phone" defaultValue={contact.phone} />
        <Field label="Email" defaultValue={contact.email} />
      </div>
      <Field label="Address" defaultValue={contact.address.full} />
      <Field label="Operating hours" defaultValue={contact.hours} />
    </Section>
  );
}

function PricingTab() {
  return (
    <Section
      title="Pricing & tax"
      description="Configure rental rates and tax. Dynamic pricing is on the roadmap."
      footer={<ComingSoonButton />}
    >
      <Toggle
        label="Dynamic pricing"
        description="Adjust rates automatically by demand and duration."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GST rate (%)" defaultValue="18" type="number" />
        <Field label="Security deposit (₹)" defaultValue="0" type="number" />
      </div>
    </Section>
  );
}

function NotificationsTab() {
  return (
    <Section
      title="Notifications"
      description="Choose how new bookings reach your team. Channels connect later."
      footer={<ComingSoonButton />}
    >
      <Toggle
        label="WhatsApp alerts"
        description="Notify on every new booking request."
        on
      />
      <Toggle
        label="Email alerts"
        description="Daily summary of new and upcoming bookings."
        on
      />
      <Toggle
        label="Instagram DMs"
        description="Route Instagram enquiries into Messages."
      />
    </Section>
  );
}

function TeamTab({ userEmail }: { userEmail: string }) {
  return (
    <Section
      title="Admin users & roles"
      description="Manage who can access this dashboard. Invites are coming soon."
      footer={<Button disabled>Invite admin</Button>}
    >
      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{userEmail}</p>
          <p className="text-xs text-muted-foreground">You</p>
        </div>
        <Badge variant="brand">Owner</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Add admins in the Supabase dashboard (Auth → Users) until invites land
        here.
      </p>
    </Section>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <Section
      title="Appearance"
      description="Personalize how the dashboard looks on this device."
    >
      <div className="grid grid-cols-3 gap-3">
        {options.map((o) => {
          const active = mounted && theme === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setTheme(o.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                active
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border text-muted-foreground hover:bg-muted/40",
              )}
            >
              <o.icon className="size-5" />
              <span className="text-sm font-medium">{o.label}</span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function ProfileTab({ userEmail }: { userEmail: string }) {
  return (
    <Section
      title="Profile & password"
      description="Your account details. Password changes are coming soon."
      footer={<Button disabled>Update password</Button>}
    >
      <Field label="Email" defaultValue={userEmail} type="email" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password" type="password" />
        <Field label="Confirm password" type="password" />
      </div>
    </Section>
  );
}
