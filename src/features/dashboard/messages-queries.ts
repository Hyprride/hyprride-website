import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  MessageChannel,
  MessageDirection,
  MessageRow,
} from "@/lib/supabase/database.types";

export type ConversationContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  created_at: string;
  lastMessage: {
    body: string;
    channel: MessageChannel;
    direction: MessageDirection;
    created_at: string;
  } | null;
};

/**
 * Recent customers as conversation entries, each enriched with a preview of
 * their latest logged message. Degrades gracefully (all previews null) when the
 * `messages` table isn't there yet, so the inbox renders before migration 0005.
 */
export async function getConversationContacts(
  limit = 30,
): Promise<ConversationContact[]> {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const list = customers ?? [];
  if (list.length === 0) return [];

  const { data: msgs } = await supabase
    .from("messages")
    .select("customer_id, body, channel, direction, created_at")
    .in(
      "customer_id",
      list.map((c) => c.id),
    )
    .order("created_at", { ascending: false });

  // First row per customer is the newest (query is ordered desc).
  const latest = new Map<string, ConversationContact["lastMessage"]>();
  for (const m of msgs ?? []) {
    if (!latest.has(m.customer_id)) {
      latest.set(m.customer_id, {
        body: m.body,
        channel: m.channel,
        direction: m.direction,
        created_at: m.created_at,
      });
    }
  }

  return list
    .map((c) => ({ ...c, lastMessage: latest.get(c.id) ?? null }))
    .sort((a, b) => {
      const at = a.lastMessage?.created_at;
      const bt = b.lastMessage?.created_at;
      if (at && bt) return bt.localeCompare(at);
      if (at) return -1;
      if (bt) return 1;
      return b.created_at.localeCompare(a.created_at);
    });
}

/** All logged messages for one customer, oldest first. */
export async function getMessagesForCustomer(
  customerId: string,
): Promise<MessageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
