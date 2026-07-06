"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/queries";
import type { Database } from "@/lib/supabase/database.types";

export type MutationResult = { ok: boolean; message: string };

type SettingsUpdate = Database["public"]["Tables"]["app_settings"]["Update"];

/** Applies a partial update to the singleton settings row (id = true). */
async function patchSettings(patch: SettingsUpdate): Promise<MutationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update(patch)
    .eq("id", true);

  if (error) {
    console.error("[patchSettings]", error);
    return {
      ok: false,
      message:
        "Could not save. If this persists, make sure migration 0004 has been applied.",
    };
  }

  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings saved." };
}

/* ── Business information ──────────────────────────────────────────────────── */
const businessSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  legal_name: z.string().trim().min(2).max(160),
  business_phone: z.string().trim().min(8).max(20),
  business_email: z.string().trim().email().max(160),
  business_address: z.string().trim().min(4).max(400),
  operating_hours: z.string().trim().min(2).max(120),
});

export async function updateBusinessSettings(
  input: z.input<typeof businessSchema>,
): Promise<MutationResult> {
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the business details." };
  }
  return patchSettings(parsed.data);
}

/* ── Pricing & tax ─────────────────────────────────────────────────────────── */
const pricingSchema = z.object({
  gst_rate: z.coerce.number().min(0).max(100),
  security_deposit: z.coerce.number().min(0).max(1_000_000),
  dynamic_pricing: z.boolean(),
});

export async function updatePricingSettings(
  input: z.input<typeof pricingSchema>,
): Promise<MutationResult> {
  const parsed = pricingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the pricing values." };
  }
  return patchSettings(parsed.data);
}

/* ── Notifications ─────────────────────────────────────────────────────────── */
const notificationsSchema = z.object({
  notify_whatsapp: z.boolean(),
  notify_email: z.boolean(),
  notify_instagram: z.boolean(),
});

export async function updateNotificationSettings(
  input: z.input<typeof notificationsSchema>,
): Promise<MutationResult> {
  const parsed = notificationsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Could not update notifications." };
  }
  return patchSettings(parsed.data);
}

/* ── Profile: password ─────────────────────────────────────────────────────── */
const passwordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters.").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export async function updatePassword(
  input: z.input<typeof passwordSchema>,
): Promise<MutationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authorized." };

  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid password.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    console.error("[updatePassword]", error);
    return { ok: false, message: error.message || "Could not update password." };
  }

  return { ok: true, message: "Password updated." };
}
