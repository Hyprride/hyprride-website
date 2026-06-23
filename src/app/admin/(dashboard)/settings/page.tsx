import { getCurrentUser } from "@/features/auth/queries";
import { SettingsPanel } from "@/features/dashboard/components/settings/settings-panel";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Business, pricing, notifications, team and appearance.
        </p>
      </div>
      <SettingsPanel userEmail={user?.email ?? "admin"} />
    </div>
  );
}
