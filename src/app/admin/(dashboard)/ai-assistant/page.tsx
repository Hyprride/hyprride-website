import { AiAssistantPanel } from "@/features/dashboard/components/ai/ai-assistant-panel";

export const metadata = { title: "AI Assistant" };

export default function AiAssistantPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          AI Assistant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer lookups, summaries and suggested replies — OpenAI-ready.
        </p>
      </div>
      <AiAssistantPanel />
    </div>
  );
}
