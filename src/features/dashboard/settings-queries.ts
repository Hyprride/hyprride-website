import "server-only";

import { createClient } from "@/lib/supabase/server";
import { siteConfig, contact } from "@/lib/site";
import type { AppSettingsRow } from "@/lib/supabase/database.types";

/**
 * Defaults used to seed the form when the `app_settings` row can't be read yet
 * (e.g. migration 0004 not applied). Mirrors the migration's seed values so the
 * Settings page renders identically before and after the table exists.
 */
export const DEFAULT_SETTINGS: AppSettingsRow = {
  id: true,
  business_name: siteConfig.name,
  legal_name: siteConfig.legalName,
  business_phone: contact.phone,
  business_email: contact.email,
  business_address: contact.address.full,
  operating_hours: contact.hours,
  gst_rate: 18,
  security_deposit: 0,
  dynamic_pricing: false,
  notify_whatsapp: true,
  notify_email: true,
  notify_instagram: false,
  updated_at: new Date().toISOString(),
};

/**
 * Reads the singleton app settings row. Falls back to {@link DEFAULT_SETTINGS}
 * if the table/row isn't available, so the page never hard-fails.
 */
export async function getSettings(): Promise<AppSettingsRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    // "Could not find the table … in the schema cache" (PostgREST PGRST205)
    // simply means migration 0004 hasn't been applied yet — fall back to the
    // seeded defaults quietly instead of surfacing a red console error.
    const notMigrated =
      error?.code === "PGRST205" || /schema cache/i.test(error?.message ?? "");
    if (error && !notMigrated) {
      console.error("[getSettings]", error.message);
    }
    return DEFAULT_SETTINGS;
  }
  return data;
}
