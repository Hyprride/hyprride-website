import { getConversationContacts } from "@/features/dashboard/messages-queries";
import { MessagesInbox } from "@/features/dashboard/components/messages/messages-inbox";

export const metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const contacts = await getConversationContacts(30);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Messages
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Log WhatsApp replies and internal notes per customer. One-click
          WhatsApp; full inbound sync connects later.
        </p>
      </div>
      <MessagesInbox contacts={contacts} />
    </div>
  );
}
