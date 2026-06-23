import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Privileged Supabase client backed by the service-role key.
 *
 * Bypasses Row Level Security, so it must ONLY ever run on the server. The
 * `server-only` import above makes the build fail loudly if this module is
 * ever pulled into a client bundle.
 *
 * Used by Server Actions to write public leads (customers / bookings) while
 * RLS denies all anonymous access to those tables from the browser.
 */
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createAdminClient() {
  if (cached) return cached;

  cached = createSupabaseClient<Database>(
    env.supabaseUrl,
    env.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return cached;
}
