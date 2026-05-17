// =============================================================================
// POST /api/inbox/playbooks/[id]/test-fire
//
// Manually fire one playbook against the latest open thread on a matching
// channel (or a thread the caller specifies). The runner records lastRunAt
// + lastRunOk + lastRunError so the playbook list reflects the outcome.
//
// Body (optional):
//   { threadId?: string; extra?: object }
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError, requireUser } from "@/lib/auth/require-user";
import { runPlaybooksForTrigger } from "@/lib/inbox/playbooks/runner";

export const runtime = "nodejs";

const Schema = z.object({
  threadId: z.string().min(1).optional(),
  extra: z.record(z.string(), z.unknown()).optional(),
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
    // empty body is ok
  }
  const parsed = Schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const playbook = await prisma.inboxPlaybook.findFirst({
    where: { id, userId: user.id },
  });
  if (!playbook) {
    return NextResponse.json({ error: "playbook_not_found" }, { status: 404 });
  }

  let threadId = parsed.data.threadId;
  let messageId: string | undefined;

  // If trigger is message.in and no thread provided, grab the most recent
  // open thread + its last inbound message so the user can validate.
  if (!threadId && playbook.triggerType === "message.in") {
    const recent = await prisma.inboxThread.findFirst({
      where: { userId: user.id, status: "open" },
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          where: { direction: "in" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true },
        },
      },
    });
    if (recent) {
      threadId = recent.id;
      messageId = recent.messages[0]?.id;
    }
  }

  // Temporarily activate the playbook for the fire so the runner picks it up
  // (the runner filters by `active=true`). Best-effort restore afterwards.
  const wasActive = playbook.active;
  if (!wasActive) {
    await prisma.inboxPlaybook.update({
      where: { id: playbook.id },
      data: { active: true },
    });
  }
  try {
    const result = await runPlaybooksForTrigger({
      userId: user.id,
      trigger: playbook.triggerType as Parameters<
        typeof runPlaybooksForTrigger
      >[0]["trigger"],
      threadId,
      messageId,
      extra: parsed.data.extra,
    });
    return NextResponse.json({ ok: true, ...result });
  } finally {
    if (!wasActive) {
      await prisma.inboxPlaybook.update({
        where: { id: playbook.id },
        data: { active: false },
      });
    }
  }
}
