import { getCurrentUser } from "@/features/auth/queries";
import { getSettings } from "@/features/dashboard/settings-queries";
import { SettingsPanel } from "@/features/dashboard/components/settings/settings-panel";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Business, pricing, notifications, team and profile.
        </p>
      </div>
      <SettingsPanel settings={settings} userEmail={user?.email ?? "admin"} />
    </div>
  );
}
