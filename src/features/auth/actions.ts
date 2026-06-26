"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/env";

export type AuthState = { error?: string };

/** Email/password sign-in. Returns an error message, or redirects on success. */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!hasSupabasePublicConfig()) {
    return {
      error: "Authentication isn't configured yet. Add your Supabase keys to .env.local.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password. Please try again." };
  }

  // Only allow internal admin redirects.
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
