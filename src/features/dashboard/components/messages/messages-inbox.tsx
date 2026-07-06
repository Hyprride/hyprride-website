"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Instagram, Search, Send, StickyNote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/icons";
import { formatRelative, formatTime } from "@/lib/utils/datetime";
import {
  formatPhoneWithCode,
  getInitials,
  toE164IndianPhone,
} from "@/lib/utils/format";
import {
  loadConversation,
  sendMessage,
} from "@/features/dashboard/messages-actions";
import type { ConversationContact } from "@/features/dashboard/messages-queries";
import type {
  MessageChannel,
  MessageRow,
} from "@/lib/supabase/database.types";

const LIST_FILTERS = [
  { id: "all", label: "All" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
] as const;

type ListFilter = (typeof LIST_FILTERS)[number]["id"];

const COMPOSE_CHANNELS: {
  id: MessageChannel;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "note", label: "Note", icon: StickyNote },
];

const SEND_LABEL: Record<MessageChannel, string> = {
  whatsapp: "Send on WhatsApp",
  instagram: "Log Instagram reply",
  note: "Add note",
};

const COMPOSE_HINT: Record<MessageChannel, string> = {
  whatsapp: "Opens WhatsApp with your message prefilled, and logs it here.",
  instagram: "Logged here — send it from the Instagram app.",
  note: "Private — visible only to your team.",
};

/** wa.me deep link to the customer's number with the message prefilled. */
function waLink(phone: string, text: string) {
  const e164 = toE164IndianPhone(phone);
  const digits = (e164 || phone).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function MessagesInbox({
  contacts,
}: {
  contacts: ConversationContact[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string | null>(
    contacts[0]?.id ?? null,
  );
  const [filter, setFilter] = React.useState<ListFilter>("all");
  const [search, setSearch] = React.useState("");

  const [messages, setMessages] = React.useState<MessageRow[]>([]);
  const [loadingThread, setLoadingThread] = React.useState(false);
  const [body, setBody] = React.useState("");
  const [channel, setChannel] = React.useState<MessageChannel>("whatsapp");
  const [pending, startTransition] = React.useTransition();

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Load the thread whenever the selected conversation changes.
  React.useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    let active = true;
    setLoadingThread(true);
    loadConversation(selectedId)
      .then((msgs) => {
        if (active) setMessages(msgs);
      })
      .finally(() => {
        if (active) setLoadingThread(false);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  // Keep the thread pinned to the latest message.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loadingThread]);

  const filtered = contacts.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesFilter =
      filter === "all" || c.lastMessage?.channel === filter;
    return matchesSearch && matchesFilter;
  });

  function handleSend() {
    if (!selected || !body.trim() || pending) return;
    const text = body.trim();
    const targetChannel = channel;

    if (targetChannel === "whatsapp") {
      window.open(
        waLink(selected.phone, text),
        "_blank",
        "noopener,noreferrer",
      );
    }

    startTransition(async () => {
      const res = await sendMessage({
        customerId: selected.id,
        channel: targetChannel,
        body: text,
      });
      if (res.ok) {
        if (res.messages) setMessages(res.messages);
        setBody("");
        toast.success(res.message);
        router.refresh(); // refresh the conversation-list previews
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="grid h-[calc(100dvh-12rem)] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <aside
        className={cn(
          "flex flex-col border-r border-border",
          selected && "hidden md:flex",
        )}
      >
        <div className="space-y-3 border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-9 pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {LIST_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f.id
                    ? "bg-brand text-[#2a2208]"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No conversations.
            </p>
          ) : (
            <ul>
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-muted/40",
                      selectedId === c.id && "bg-muted/60",
                    )}
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="text-[11px]">
                        {getInitials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {c.name}
                        </p>
                        {c.lastMessage && (
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {formatRelative(c.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.lastMessage
                          ? `${c.lastMessage.direction === "out" ? "You: " : ""}${c.lastMessage.body}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Thread */}
      <section className={cn("flex flex-col", !selected && "hidden md:flex")}>
        {selected ? (
          <>
            <header className="flex items-center gap-3 border-b border-border p-3">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="grid size-9 place-items-center rounded-full hover:bg-muted md:hidden"
                aria-label="Back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <Avatar className="size-9">
                <AvatarFallback className="text-[11px]">
                  {getInitials(selected.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {selected.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatPhoneWithCode(selected.phone)}
                </p>
              </div>
              <Badge variant="outline" className="hidden gap-1 sm:flex">
                <WhatsAppIcon className="size-3.5" /> WhatsApp
              </Badge>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingThread ? (
                <p className="pt-6 text-center text-sm text-muted-foreground">
                  Loading…
                </p>
              ) : messages.length === 0 ? (
                <div className="grid h-full place-items-center px-6 text-center">
                  <p className="max-w-xs text-sm text-muted-foreground">
                    No messages yet. Send a WhatsApp or jot an internal note
                    below — it&apos;ll be logged here for {selected.name}.
                  </p>
                </div>
              ) : (
                messages.map((m) => <MessageBubble key={m.id} message={m} />)
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex gap-1.5">
                {COMPOSE_CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      channel === c.id
                        ? "bg-brand text-[#2a2208]"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <c.icon className="size-3.5" />
                    {c.label}
                  </button>
                ))}
              </div>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  channel === "note"
                    ? "Write an internal note…"
                    : `Message ${selected.name}…`
                }
                className="min-h-[72px]"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {COMPOSE_HINT[channel]}
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSend}
                  disabled={pending || !body.trim()}
                  className="shrink-0"
                >
                  <Send className="size-4" />
                  {pending ? "Saving…" : SEND_LABEL[channel]}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Select a conversation to view its timeline.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function MessageBubble({ message }: { message: MessageRow }) {
  if (message.channel === "note") {
    return (
      <div className="mx-auto max-w-[85%] rounded-xl border border-dashed border-border bg-muted/40 px-3.5 py-2 text-center">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Note · {formatTime(message.created_at)}
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
          {message.body}
        </p>
      </div>
    );
  }

  const isOut = message.direction === "out";
  return (
    <div className={cn("flex", isOut ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2",
          isOut ? "bg-brand text-[#2a2208]" : "bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.body}</p>
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-[11px]",
            isOut ? "text-[#2a2208]/70" : "text-muted-foreground",
          )}
        >
          {message.channel === "whatsapp" ? (
            <WhatsAppIcon className="size-3" />
          ) : (
            <Instagram className="size-3" />
          )}
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
