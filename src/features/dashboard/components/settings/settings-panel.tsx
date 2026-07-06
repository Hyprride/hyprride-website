"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Bell,
  Building2,
  Receipt,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  updateBusinessSettings,
  updateNotificationSettings,
  updatePassword,
  updatePricingSettings,
  type MutationResult,
} from "@/features/dashboard/settings-actions";
import type { AppSettingsRow } from "@/lib/supabase/database.types";

const TABS = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "pricing", label: "Pricing & tax", icon: Receipt },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: ShieldCheck },
  { id: "profile", label: "Profile", icon: UserCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsPanel({
  settings,
  userEmail,
}: {
  settings: AppSettingsRow;
  userEmail: string;
}) {
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
        {tab === "business" && <BusinessTab settings={settings} />}
        {tab === "pricing" && <PricingTab settings={settings} />}
        {tab === "notifications" && <NotificationsTab settings={settings} />}
        {tab === "team" && <TeamTab userEmail={userEmail} />}
        {tab === "profile" && <ProfileTab userEmail={userEmail} />}
      </div>
    </div>
  );
}

/* ── Shared submit helper ───────────────────────────────────────────────────── */
/** Runs a settings action, toasts the result, and returns whether it succeeded. */
function useSettingsAction() {
  const [pending, startTransition] = React.useTransition();
  const run = (action: () => Promise<MutationResult>, onOk?: () => void) =>
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        toast.success(res.message);
        onOk?.();
      } else {
        toast.error(res.message);
      }
    });
  return { pending, run };
}

/* ── Reusable bits ──────────────────────────────────────────────────────────── */
function Section({
  title,
  description,
  children,
  footer,
  onSubmit,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="p-6">
      <form onSubmit={onSubmit}>
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
      </form>
    </Card>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  disabled,
  ...rest
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  disabled?: boolean;
} & Pick<
  React.ComponentProps<typeof Input>,
  "min" | "max" | "step" | "autoComplete"
>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.125rem]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

function SaveButton({
  pending,
  children = "Save changes",
}: {
  pending: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : children}
    </Button>
  );
}

/* ── Tabs ───────────────────────────────────────────────────────────────────── */
function BusinessTab({ settings }: { settings: AppSettingsRow }) {
  const { pending, run } = useSettingsAction();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(() =>
      updateBusinessSettings({
        business_name: String(fd.get("business_name") ?? ""),
        legal_name: String(fd.get("legal_name") ?? ""),
        business_phone: String(fd.get("business_phone") ?? ""),
        business_email: String(fd.get("business_email") ?? ""),
        business_address: String(fd.get("business_address") ?? ""),
        operating_hours: String(fd.get("operating_hours") ?? ""),
      }),
    );
  }

  return (
    <Section
      title="Business information"
      description="Your contact details for the dashboard and internal records."
      onSubmit={onSubmit}
      footer={<SaveButton pending={pending} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="business_name" label="Brand name" defaultValue={settings.business_name} />
        <Field name="legal_name" label="Legal name" defaultValue={settings.legal_name} />
        <Field name="business_phone" label="Phone" defaultValue={settings.business_phone} />
        <Field name="business_email" label="Email" type="email" defaultValue={settings.business_email} />
      </div>
      <Field name="business_address" label="Address" defaultValue={settings.business_address} />
      <Field name="operating_hours" label="Operating hours" defaultValue={settings.operating_hours} />
    </Section>
  );
}

function PricingTab({ settings }: { settings: AppSettingsRow }) {
  const { pending, run } = useSettingsAction();
  const [dynamicPricing, setDynamicPricing] = React.useState(
    settings.dynamic_pricing,
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(() =>
      updatePricingSettings({
        gst_rate: Number(fd.get("gst_rate") ?? 0),
        security_deposit: Number(fd.get("security_deposit") ?? 0),
        dynamic_pricing: dynamicPricing,
      }),
    );
  }

  return (
    <Section
      title="Pricing & tax"
      description="Tax rate and deposit used across the dashboard."
      onSubmit={onSubmit}
      footer={<SaveButton pending={pending} />}
    >
      <Toggle
        label="Dynamic pricing"
        description="Adjust rates automatically by demand and duration. (Roadmap — stored for later.)"
        checked={dynamicPricing}
        onChange={setDynamicPricing}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="gst_rate"
          label="GST rate (%)"
          type="number"
          defaultValue={String(settings.gst_rate)}
          min={0}
          max={100}
          step="0.01"
        />
        <Field
          name="security_deposit"
          label="Security deposit (₹)"
          type="number"
          defaultValue={String(settings.security_deposit)}
          min={0}
          step="1"
        />
      </div>
    </Section>
  );
}

function NotificationsTab({ settings }: { settings: AppSettingsRow }) {
  const { pending, run } = useSettingsAction();
  const [whatsapp, setWhatsapp] = React.useState(settings.notify_whatsapp);
  const [email, setEmail] = React.useState(settings.notify_email);
  const [instagram, setInstagram] = React.useState(settings.notify_instagram);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(() =>
      updateNotificationSettings({
        notify_whatsapp: whatsapp,
        notify_email: email,
        notify_instagram: instagram,
      }),
    );
  }

  return (
    <Section
      title="Notifications"
      description="Choose how new bookings reach your team. Channel delivery connects later."
      onSubmit={onSubmit}
      footer={<SaveButton pending={pending} />}
    >
      <Toggle
        label="WhatsApp alerts"
        description="Notify on every new booking request."
        checked={whatsapp}
        onChange={setWhatsapp}
      />
      <Toggle
        label="Email alerts"
        description="Daily summary of new and upcoming bookings."
        checked={email}
        onChange={setEmail}
      />
      <Toggle
        label="Instagram DMs"
        description="Route Instagram enquiries into Messages."
        checked={instagram}
        onChange={setInstagram}
      />
    </Section>
  );
}

function TeamTab({ userEmail }: { userEmail: string }) {
  return (
    <Section
      title="Admin users & roles"
      description="Manage who can access this dashboard. Invites are coming soon."
      footer={<Button type="button" disabled>Invite admin</Button>}
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

function ProfileTab({ userEmail }: { userEmail: string }) {
  const { pending, run } = useSettingsAction();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(
      () =>
        updatePassword({
          password: String(fd.get("password") ?? ""),
          confirm: String(fd.get("confirm") ?? ""),
        }),
      () => form.reset(),
    );
  }

  return (
    <Section
      title="Profile & password"
      description="Your account details. Set a new password below."
      onSubmit={onSubmit}
      footer={<SaveButton pending={pending}>Update password</SaveButton>}
    >
      <Field
        name="email"
        label="Email"
        type="email"
        defaultValue={userEmail}
        disabled
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
        />
        <Field
          name="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
      </div>
    </Section>
  );
}
