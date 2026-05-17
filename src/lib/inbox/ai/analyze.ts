// =============================================================================
// Thread analysis — summary + sentiment + intent + language detection
// in a single Haiku call. Cheaper and less code than three round-trips for
// fields that always travel together.
// =============================================================================

import { completeJson, ClaudeError } from "./claude";

export type Sentiment = "positive" | "neutral" | "negative" | "urgent";
export type Intent =
  | "booking"
  | "quote_request"
  | "complaint"
  | "support"
  | "info"
  | "spam"
  | "other";

export interface ThreadAnalysis {
  summary: string;
  sentiment: Sentiment;
  intent: Intent;
  language: string | null;
  priority: 0 | 1 | 2 | 3;
}

export interface AnalyzableMessage {
  direction: "in" | "out";
  body: string | null;
  voiceTranscript?: string | null;
  createdAt: Date;
}

const SYSTEM_PROMPT = `You read inbound/outbound messages from a small-business inbox and
classify them. Reply with ONE JSON object only, no surrounding prose:

{
  "summary": "<one neutral sentence, max 140 chars, in {locale}>",
  "sentiment": "positive" | "neutral" | "negative" | "urgent",
  "intent": "booking" | "quote_request" | "complaint" | "support" | "info" | "spam" | "other",
  "language": "<ISO 639-1 code of the customer's writing language, e.g. en, de, tr>",
  "priority": 0 | 1 | 2 | 3
}

Rules:
- "summary" describes WHAT the customer wants, not feelings — written in {locale}.
- "sentiment=urgent" only when the customer signals time pressure or distress.
- "priority": 0 normal, 1 elevated, 2 high (escalate today), 3 urgent (now).
- If the conversation is empty or media-only with no text, use sentiment=neutral, intent=other, priority=0.
`;

function buildTranscript(messages: AnalyzableMessage[]): string {
  return messages
    .map((m) => {
      const who = m.direction === "in" ? "Customer" : "Owner";
      const text = (m.body ?? m.voiceTranscript ?? "[media]").trim();
      return `${who}: ${text}`;
    })
    .join("\n");
}

export async function analyzeThread(
  messages: AnalyzableMessage[],
  ownerLocale: string = "en",
): Promise<ThreadAnalysis & { tokensIn: number; tokensOut: number; model: string }> {
  if (messages.length === 0) {
    return {
      summary: "",
      sentiment: "neutral",
      intent: "other",
      language: null,
      priority: 0,
      tokensIn: 0,
      tokensOut: 0,
      model: "skipped",
    };
  }

  // Keep prompt bounded — last 20 turns is plenty for triage signal.
  const trimmed = messages.slice(-20);
  const transcript = buildTranscript(trimmed);

  const system = SYSTEM_PROMPT.replace(/\{locale\}/g, ownerLocale);
  const user = `Conversation:\n${transcript}\n\nReturn the JSON.`;

  try {
    const { data, raw } = await completeJson<ThreadAnalysis>(
      "haiku",
      system,
      user,
      { maxTokens: 300, temperature: 0.1 },
    );
    return {
      summary: String(data.summary ?? "").slice(0, 200),
      sentiment: (data.sentiment ?? "neutral") as Sentiment,
      intent: (data.intent ?? "other") as Intent,
      language: data.language ?? null,
      priority: Math.min(3, Math.max(0, Number(data.priority) || 0)) as
        | 0
        | 1
        | 2
        | 3,
      tokensIn: raw.tokensIn,
      tokensOut: raw.tokensOut,
      model: raw.model,
    };
  } catch (err) {
    // Soft-fail — better to show no AI badge than break the inbox load.
    if (err instanceof ClaudeError) {
      console.warn("[inbox/ai/analyze]", err.message);
    } else {
      console.warn("[inbox/ai/analyze] unknown error", err);
    }
    return {
      summary: "",
      sentiment: "neutral",
      intent: "other",
      language: null,
      priority: 0,
      tokensIn: 0,
      tokensOut: 0,
      model: "error",
    };
  }
}
