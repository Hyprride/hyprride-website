import { getRecentCustomers } from "@/features/dashboard/queries";
import { MessagesInbox } from "@/features/dashboard/components/messages/messages-inbox";

export const metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const contacts = await getRecentCustomers(20);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Messages
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Unified inbox for WhatsApp and Instagram — architecture ready,
          integrations pending.
        </p>
      </div>
      <MessagesInbox contacts={contacts} />
    </div>
  );
}
