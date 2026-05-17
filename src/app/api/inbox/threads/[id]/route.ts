// =============================================================================
// GET    /api/inbox/threads/[id]  — thread detail with full message log
// PATCH  /api/inbox/threads/[id]  — update status / priority / assignee / tags
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { getThreadById, updateThread } from "@/lib/inbox/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
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
  const thread = await getThreadById(user.id, id);
  if (!thread) {
    return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    thread: {
      id: thread.id,
      channel: {
        id: thread.channel.id,
        type: thread.channel.type,
        label: thread.channel.label,
        status: thread.channel.status,
      },
      channelType: thread.channelType,
      contactName: thread.contactName,
      contactHandle: thread.contactHandle,
      contactLocale: thread.contactLocale,
      subject: thread.subject,
      status: thread.status,
      priority: thread.priority,
      tags: thread.tags,
      assignedTo: thread.assignedTo,
      unreadCount: thread.unreadCount,
      aiSummary: thread.aiSummary,
      aiSentiment: thread.aiSentiment,
      aiIntent: thread.aiIntent,
      aiUpdatedAt: thread.aiUpdatedAt,
      lastMessageAt: thread.lastMessageAt,
      messages: thread.messages.map((m) => ({
        id: m.id,
        direction: m.direction,
        sentBy: m.sentBy,
        status: m.status,
        body: m.body,
        mediaUrls: m.mediaUrls,
        voiceUrl: m.voiceUrl,
        voiceTranscript: m.voiceTranscript,
        language: m.language,
        createdAt: m.createdAt,
        deliveredAt: m.deliveredAt,
        readAt: m.readAt,
      })),
      suggestions: thread.suggestions.map((s) => ({
        id: s.id,
        type: s.type,
        status: s.status,
        content: s.content,
        modelUsed: s.modelUsed,
        createdAt: s.createdAt,
      })),
    },
  });
}

const PatchSchema = z.object({
  status: z.enum(["open", "snoozed", "closed", "archived"]).optional(),
  priority: z.number().int().min(0).max(3).optional(),
  assignedTo: z.string().nullable().optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  snoozedUntil: z.string().datetime().nullable().optional(),
});

export async function PATCH(
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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        issues: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const patch = parsed.data;
  const result = await updateThread(user.id, id, {
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
    ...(patch.assignedTo !== undefined
      ? { assignedTo: patch.assignedTo }
      : {}),
    ...(patch.tags ? { tags: patch.tags } : {}),
    ...(patch.snoozedUntil !== undefined
      ? { snoozedUntil: patch.snoozedUntil ? new Date(patch.snoozedUntil) : null }
      : {}),
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
