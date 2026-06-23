/**
 * Centralised, type-safe access to environment variables.
 *
 * Values are read lazily through getters so that a missing variable only
 * throws at the moment it is actually used (e.g. inside a Server Action),
 * never at module-import / build time. This keeps `next build` green even
 * when secrets are not present in the build environment.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". Add it to your .env.local (see .env.example).`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  /** Server-only. Importing this on the client will (correctly) fail. */
  get supabaseServiceRoleKey() {
    return required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  },
  get siteUrl() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyprride.com"
    ).replace(/\/$/, "");
  },
} as const;

/** True when the public Supabase config is present (used to degrade gracefully). */
export function hasSupabasePublicConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
