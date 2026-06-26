"use client";

import * as React from "react";
import {
  BookMarked,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  { icon: Search, label: "Search customer history", prompt: "Show booking history for " },
  { icon: BookMarked, label: "Booking lookup", prompt: "Look up booking HR-" },
  { icon: MessageSquareText, label: "Suggested reply", prompt: "Draft a reply to a customer asking about " },
  { icon: Wand2, label: "Summarize a customer", prompt: "Summarize the activity for customer " },
];

export function AiAssistantPanel() {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
            Your AI support copilot
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Ask about customers, look up bookings, generate summaries and draft
            replies. OpenAI-ready — wiring up the model is the next step.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setValue(s.prompt)}
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

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask the assistant… (model not connected yet)"
            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button size="icon" className="size-9 shrink-0" disabled>
            <Send className="size-4" />
          </Button>
        </form>
        <p className="mt-2 px-1 text-center text-xs text-muted-foreground">
          Knowledge base + model integration coming soon.
        </p>
      </div>
    </div>
  );
}
