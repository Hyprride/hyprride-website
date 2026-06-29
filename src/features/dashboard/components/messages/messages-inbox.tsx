"use client";

import * as React from "react";
import { ArrowLeft, Clock, Instagram, Search, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/icons";
import { formatRelative } from "@/lib/utils/datetime";
import { formatPhoneWithCode, getInitials } from "@/lib/utils/format";

export type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  created_at: string;
};

const CHANNELS = [
  { id: "all", label: "All" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
];

export function MessagesInbox({ contacts }: { contacts: Contact[] }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    contacts[0]?.id ?? null,
  );
  const [channel, setChannel] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = contacts.find((c) => c.id === selectedId) ?? null;

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
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChannel(c.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  channel === c.id
                    ? "bg-brand text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
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
                      <p className="truncate text-sm font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        No messages yet
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
              <div className="flex gap-1.5">
                <Badge variant="outline" className="gap-1">
                  <WhatsAppIcon className="size-3.5" /> WhatsApp
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Instagram className="size-3.5" /> Instagram
                </Badge>
              </div>
            </header>

            <div className="flex flex-1 items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Clock className="size-6" />
                </div>
                <p className="mt-4 font-medium text-foreground">
                  Conversation history coming soon
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  WhatsApp & Instagram DM threads for {selected.name} will appear
                  here once the integration is connected.
                </p>
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
                <Input
                  disabled
                  placeholder="Messaging integration not connected yet…"
                  className="h-9 border-0 bg-transparent shadow-none"
                />
                <Button size="icon" className="size-9 shrink-0" disabled>
                  <Send className="size-4" />
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
