"use client";

import * as React from "react";
import {
  BarChart3,
  CalendarClock,
  IndianRupee,
  ListChecks,
  Send,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string; tools?: string[] };

const SUGGESTIONS = [
  {
    icon: CalendarClock,
    label: "Today's bookings",
    prompt: "How many bookings do we have today, and list them.",
  },
  {
    icon: IndianRupee,
    label: "Revenue & growth",
    prompt: "What's our total revenue and month-over-month growth?",
  },
  {
    icon: ListChecks,
    label: "Pending bookings",
    prompt: "List the pending bookings that still need confirming.",
  },
  {
    icon: BarChart3,
    label: "Recent activity",
    prompt: "Give me a quick summary of the 5 most recent bookings.",
  },
];

const TOOL_LABELS: Record<string, string> = {
  search_customers: "Searched customers",
  get_customer: "Read customer",
  get_booking: "Looked up booking",
  list_recent_bookings: "Listed bookings",
  get_dashboard_stats: "Read stats",
};

export function AiAssistantPanel() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        data.ok
          ? { role: "assistant", content: data.reply, tools: data.tools }
          : {
              role: "assistant",
              content: data.error || "Something went wrong.",
            },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Couldn't reach the assistant. Check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {empty ? (
          <Welcome onPick={send} />
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {loading && <Thinking />}
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about bookings, customers or stats…"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            className="size-9 shrink-0"
            disabled={loading || !value.trim()}
          >
            <Send className="size-4" />
          </Button>
        </form>
        <p className="mt-2 px-1 text-center text-xs text-muted-foreground">
          Read-only · answers from your live bookings &amp; customers.
        </p>
      </div>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Sparkles className="size-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
          Your AI support copilot
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Ask about bookings, customers and stats — it looks up the answer from
          your live data. Powered by Claude.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onPick(s.prompt)}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-3 text-left text-sm transition-colors hover:border-brand/40 hover:bg-muted/40"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <s.icon className="size-4" />
              </span>
              <span className="text-foreground">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Msg }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5",
          isUser ? "bg-brand text-[#2a2208]" : "bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.content}
        </p>
        {message.tools && message.tools.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/60 pt-2">
            {message.tools.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                <Sparkles className="size-3" />
                {TOOL_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
      </div>
    </div>
  );
}
