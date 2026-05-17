// =============================================================================
// Playbook: Email → Quote Draft
//
// Trigger: message.in
// Condition: channel=email AND body matches RFQ keywords from config.
// Action:
//   1. Read the inbound body + the channel's price list (config.priceList).
//   2. AI drafts a quote (Sonnet) — stored as an InboxSuggestion (type=reply)
//      sitting in the Outbox awaiting human approval. Never auto-sends.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { completeText } from "@/lib/inbox/ai/claude";
import type { PlaybookTemplate } from "../types";

const DEFAULT_KEYWORDS_RE = /(quote|quotation|teklif|angebot|anfrage|rfq)\b/i;

interface PriceListEntry {
  sku: string;
  name: string;
  price: string;
  notes?: string;
}

interface PlaybookConfig {
  matchKeywords?: string[]; // regex strings combined with OR
  priceList?: PriceListEntry[];
}

export const emailToQuoteDraft: PlaybookTemplate = {
  slug: "email-to-quote-draft",
  name: "Email → Quote Draft",
  description:
    "When an email with RFQ keywords arrives, AI drafts a quote against your price list and parks it in the Outbox for you to approve.",
  triggerType: "message.in",
  defaultConfig: {
    matchKeywords: ["quote", "quotation", "teklif", "angebot", "rfq"],
    priceList: [],
  },
  defaultSteps: { onlyEmail: true, requireApproval: true },
  async run({ user, thread, message, playbook }) {
    if (!thread || !message) return { summary: "skipped — no thread/message" };
    if (thread.channelType !== "email")
      return { summary: "skipped — not email" };

    const text = message.body ?? "";
    if (!text.trim()) return { summary: "skipped — empty body" };

    const config = (playbook.triggerConfig ?? {}) as PlaybookConfig;
    const keywords = config.matchKeywords?.length
      ? new RegExp(`\\b(${config.matchKeywords.join("|")})\\b`, "i")
      : DEFAULT_KEYWORDS_RE;
    if (!keywords.test(text)) {
      return { summary: "skipped — no RFQ keyword match" };
    }

    const priceListText = (config.priceList ?? [])
      .slice(0, 50)
      .map((p) => `- ${p.sku} · ${p.name} · ${p.price}${p.notes ? ` (${p.notes})` : ""}`)
      .join("\n");

    const ownerLocale = user.locale ?? "en";
    const ownerName = user.name ?? "the team";

    let draft = "";
    try {
      const result = await completeText(
        "sonnet",
        `You draft polite, structured quote emails on behalf of ${ownerName}. Write in ${ownerLocale}. 4-8 sentences, with a subject line on the first line ("Subject: ...") and the body after. Use ONLY items from the provided price list — when the request doesn't match, propose a short discovery call instead of inventing prices.`,
        `Customer email:\n"""\n${text.slice(0, 4000)}\n"""\n\nPrice list:\n${priceListText || "(no price list configured — propose a discovery call)"}\n\nDraft the quote.`,
        { maxTokens: 700, temperature: 0.3 },
      );
      draft = result.text.trim();
    } catch (err) {
      console.warn("[playbook/email-to-quote-draft] LLM failed", err);
      return { summary: "draft failed" };
    }

    await prisma.inboxSuggestion.create({
      data: {
        threadId: thread.id,
        type: "reply",
        status: "pending",
        content: draft,
        modelUsed: "sonnet:playbook",
      },
    });

    // Tag + elevate so the user notices.
    await prisma.inboxThread.update({
      where: { id: thread.id },
      data: {
        tags: { set: ["quote-draft-ready"] },
        priority: Math.max(1, 1),
      },
    });

    return {
      summary: "quote draft parked in Outbox",
      details: { draftLength: draft.length },
    };
  },
};
