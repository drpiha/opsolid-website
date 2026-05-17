// =============================================================================
// Suggest a reply — channel-aware, locale-aware draft for the owner to send.
//
// Sonnet rather than Haiku here: replies are customer-facing and a small
// quality bump is worth ~2-3x the per-call cost (and we only run this on
// demand, not on every inbound message).
// =============================================================================

import { completeText, ClaudeError } from "./claude";
import type { AnalyzableMessage } from "./analyze";

const CHANNEL_TONE: Record<string, string> = {
  whatsapp:
    "Short, conversational, 1–3 sentences. No subject line. May use simple emoji if the customer did.",
  telegram:
    "Short, friendly, 1–3 sentences. No subject line. Markdown allowed but optional.",
  email:
    "Polite, structured, 3–6 sentences. Open with a greeting line, close with a sign-off using the owner's name.",
  voice: "Friendly, conversational, 2–4 sentences (will be read aloud).",
  web: "Concise, helpful, 2–4 sentences.",
  card_action: "Brief, professional, 1–2 sentences.",
};

export interface SuggestReplyParams {
  channelType: string;
  ownerName?: string | null;
  ownerLocale: string;
  customerLocale?: string | null;
  messages: AnalyzableMessage[];
  hint?: string;
}

export interface SuggestReplyResult {
  reply: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

function buildTranscript(messages: AnalyzableMessage[]): string {
  return messages
    .slice(-15)
    .map((m) => {
      const who = m.direction === "in" ? "Customer" : "Owner";
      const text = (m.body ?? m.voiceTranscript ?? "[media]").trim();
      return `${who}: ${text}`;
    })
    .join("\n");
}

export async function suggestReply(
  params: SuggestReplyParams,
): Promise<SuggestReplyResult | null> {
  if (params.messages.length === 0) return null;
  const last = params.messages[params.messages.length - 1];
  if (last.direction !== "in") return null; // Owner sent last — nothing to draft.

  const tone =
    CHANNEL_TONE[params.channelType] ?? CHANNEL_TONE.web;

  const customerLang =
    params.customerLocale ?? "the customer's writing language";

  const ownerName = params.ownerName ?? "the owner";

  const system = `You draft replies on behalf of a small-business owner. Write in ${customerLang}.
Tone constraints for the ${params.channelType} channel: ${tone}
Always sound like a human, not a chatbot. Never invent prices, dates, or commitments
that the conversation doesn't already mention — when uncertain, propose a short
follow-up question instead. Sign off as ${ownerName} only on email; on chat channels
no signature.`;

  const user = `Conversation so far:
${buildTranscript(params.messages)}

${params.hint ? `Owner hint: ${params.hint}\n\n` : ""}Write only the reply body — no quotes, no labels, no markdown headings.`;

  try {
    const result = await completeText("sonnet", system, user, {
      maxTokens: 500,
      temperature: 0.4,
    });
    return {
      reply: result.text,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      model: result.model,
    };
  } catch (err) {
    if (err instanceof ClaudeError) {
      console.warn("[inbox/ai/suggest-reply]", err.message);
    } else {
      console.warn("[inbox/ai/suggest-reply] unknown error", err);
    }
    return null;
  }
}
