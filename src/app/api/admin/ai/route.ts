import Anthropic from "@anthropic-ai/sdk";

import { getCurrentUser } from "@/features/auth/queries";
import { AI_TOOLS, runTool } from "@/features/dashboard/ai-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
const MAX_TOOL_ITERATIONS = 6;

const SYSTEM = `You are the HYPRRIDE admin assistant — a support copilot inside the staff dashboard of a bike-rental business in Madhapur, Hyderabad. You help staff look up bookings and customers, summarise activity, and draft short replies.

Rules:
- Use the tools to fetch real data. Never invent bookings, customers, phone numbers, amounts, or dates. If a tool returns nothing, say so plainly.
- Amounts are in Indian Rupees (₹); times are IST. Booking references look like HR-000123.
- Be concise and factual. Prefer short summaries and small tables over long prose.
- You are READ-ONLY: you cannot create, edit, confirm, cancel, or message anyone. If asked to take an action, explain how to do it from the dashboard instead.
- If a question is outside HYPRRIDE's bookings/customers/stats, say it's out of scope.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ok: false,
      error:
        "The AI assistant isn't configured yet — add ANTHROPIC_API_KEY to your environment (.env.local) and restart the dev server.",
    });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20);

  if (history.length === 0) {
    return Response.json({ ok: false, error: "Ask a question first." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const toolsUsed: string[] = [];

  try {
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        system: SYSTEM,
        tools: AI_TOOLS,
        messages,
      });

      if (res.stop_reason === "tool_use") {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of res.content) {
          if (block.type === "tool_use") {
            toolsUsed.push(block.name);
            let result: unknown;
            try {
              result = await runTool(
                block.name,
                (block.input ?? {}) as Record<string, unknown>,
              );
            } catch (e) {
              result = {
                error: e instanceof Error ? e.message : "Tool failed.",
              };
            }
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          }
        }
        messages.push({ role: "assistant", content: res.content });
        messages.push({ role: "user", content: toolResults });
        continue;
      }

      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      const reply =
        res.stop_reason === "refusal"
          ? "I can't help with that request."
          : text || "(No response.)";

      return Response.json({ ok: true, reply, tools: [...new Set(toolsUsed)] });
    }

    return Response.json({
      ok: true,
      reply:
        "That took more steps than I can take at once — try narrowing the question.",
      tools: [...new Set(toolsUsed)],
    });
  } catch (e) {
    console.error("[ai route]", e);
    const msg =
      e instanceof Anthropic.APIError
        ? `AI error: ${e.message}`
        : "Something went wrong talking to the assistant.";
    return Response.json({ ok: false, error: msg });
  }
}
