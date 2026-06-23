import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Supabase client for use in Client Components.
 * Uses the public anon key — all access is gated by Row Level Security.
 */
export function createClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
