"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/queries";
import { getMessagesForCustomer } from "./messages-queries";
import type { MessageRow } from "@/lib/supabase/database.types";

export type MutationResult = { ok: boolean; message: string };

/** Client-callable loader for a customer's message thread. */
export async function loadConversation(
  customerId: string,
): Promise<MessageRow[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getMessagesForCustomer(customerId);
}

const sendSchema = z.object({
  customerId: z.string().uuid(),
  channel: z.enum(["whatsapp", "instagram", "note"]),
  body: z.string().trim().min(1).max(4000),
});

/**
 * Logs an outbound message / internal note. Returns the refreshed thread so the
 * client can update immediately without a full reload.
 */
export async function sendMessage(
  input: z.input<typeof sendSchema>,
): Promise<MutationResult & { messages?: MessageRow[] }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not authorized." };

  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Message can't be empty." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    customer_id: parsed.data.customerId,
    channel: parsed.data.channel,
    direction: "out",
    body: parsed.data.body,
  });

  if (error) {
    console.error("[sendMessage]", error);
    return {
      ok: false,
      message:
        "Could not save. If this persists, make sure migration 0005 has been applied.",
    };
  }

  revalidatePath("/admin/messages");
  const messages = await getMessagesForCustomer(parsed.data.customerId);
  return {
    ok: true,
    message: parsed.data.channel === "note" ? "Note added." : "Message logged.",
    messages,
  };
}
