// =============================================================================
// POST /api/inbox/threads/[id]/ai/suggest
//
// Generate a draft reply for the thread and store it as an InboxSuggestion.
// Idempotent in the cheap sense — calling repeatedly creates multiple
// suggestions; the UI sorts by createdAt desc and shows the latest.
//
// Body (optional): { hint?: string } — owner-supplied hint, e.g.
// "Decline politely" or "Offer 15% deposit, schedule next week".
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { suggestReply } from "@/lib/inbox/ai/suggest-reply";

export const runtime = "nodejs";

const Schema = z.object({
  hint: z.string().trim().max(500).optional(),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { id } = await context.params;

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is fine.
  }
  const parsed = Schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400 },
    );
  }

  const thread = await prisma.inboxThread.findFirst({
    where: { id, userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread) {
    return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  }

  const result = await suggestReply({
    channelType: thread.channelType,
    ownerName: user.name,
    ownerLocale: user.locale ?? "en",
    customerLocale: thread.contactLocale,
    hint: parsed.data.hint,
    messages: thread.messages.map((m) => ({
      direction: m.direction as "in" | "out",
      body: m.body,
      voiceTranscript: m.voiceTranscript,
      createdAt: m.createdAt,
    })),
  });

  if (!result) {
    return NextResponse.json(
      { error: "no_suggestion", description: "AI returned nothing — likely the last message was from you or AI is misconfigured." },
      { status: 422 },
    );
  }

  const suggestion = await prisma.inboxSuggestion.create({
    data: {
      threadId: thread.id,
      type: "reply",
      content: result.reply,
      modelUsed: result.model,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
    },
  });

  return NextResponse.json({
    ok: true,
    suggestion: {
      id: suggestion.id,
      type: suggestion.type,
      content: suggestion.content,
      modelUsed: suggestion.modelUsed,
      createdAt: suggestion.createdAt,
    },
  });
}
