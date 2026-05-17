// =============================================================================
// Playbook runner — pick the matching active InboxPlaybook rows for a
// trigger event, hand each one a normalized context, persist the outcome
// (lastRunAt + lastRunOk + lastRunError + runCount).
//
// Called from webhook handlers after AI regen, and from the manual
// test-fire endpoint.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { getTemplate } from "./registry";
import type { PlaybookContext } from "./types";
import type { PlaybookTrigger } from "../types";

export interface RunForTriggerParams {
  userId: string;
  trigger: PlaybookTrigger;
  threadId?: string;
  messageId?: string;
  extra?: Record<string, unknown>;
}

export async function runPlaybooksForTrigger(
  params: RunForTriggerParams,
): Promise<{ ran: number; results: Array<{ id: string; ok: boolean; summary: string }> }> {
  const playbooks = await prisma.inboxPlaybook.findMany({
    where: {
      userId: params.userId,
      active: true,
      triggerType: params.trigger,
    },
  });
  if (playbooks.length === 0) return { ran: 0, results: [] };

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, locale: true, name: true, email: true },
  });
  if (!user) return { ran: 0, results: [] };

  let thread = null as Awaited<ReturnType<typeof loadThreadContext>>;
  let message = null as Awaited<ReturnType<typeof loadMessageContext>>;
  if (params.threadId) thread = await loadThreadContext(params.threadId);
  if (params.messageId) message = await loadMessageContext(params.messageId);

  const results: Array<{ id: string; ok: boolean; summary: string }> = [];

  for (const pb of playbooks) {
    const template = pb.templateSlug ? getTemplate(pb.templateSlug) : null;
    if (!template) {
      await prisma.inboxPlaybook.update({
        where: { id: pb.id },
        data: {
          lastRunAt: new Date(),
          lastRunOk: false,
          lastRunError: `unknown template: ${pb.templateSlug ?? "null"}`,
          runCount: { increment: 1 },
        },
      });
      results.push({ id: pb.id, ok: false, summary: "unknown template" });
      continue;
    }

    const ctx: PlaybookContext = {
      user,
      playbook: pb,
      trigger: params.trigger,
      thread: thread ?? undefined,
      message: message ?? undefined,
      extra: params.extra,
    };

    try {
      const outcome = await template.run(ctx);
      await prisma.inboxPlaybook.update({
        where: { id: pb.id },
        data: {
          lastRunAt: new Date(),
          lastRunOk: true,
          lastRunError: null,
          runCount: { increment: 1 },
        },
      });
      results.push({ id: pb.id, ok: true, summary: outcome.summary });
    } catch (err) {
      const description = err instanceof Error ? err.message : String(err);
      await prisma.inboxPlaybook.update({
        where: { id: pb.id },
        data: {
          lastRunAt: new Date(),
          lastRunOk: false,
          lastRunError: description.slice(0, 1000),
          runCount: { increment: 1 },
        },
      });
      results.push({ id: pb.id, ok: false, summary: description });
    }
  }

  return { ran: playbooks.length, results };
}

async function loadThreadContext(threadId: string) {
  const t = await prisma.inboxThread.findUnique({
    where: { id: threadId },
    include: { channel: true },
  });
  if (!t) return null;
  return {
    id: t.id,
    channelType: t.channelType,
    contactHandle: t.contactHandle,
    contactName: t.contactName,
    contactLocale: t.contactLocale,
    channel: t.channel,
  };
}

async function loadMessageContext(messageId: string) {
  const m = await prisma.inboxMessage.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      body: true,
      voiceTranscript: true,
      voiceUrl: true,
      language: true,
    },
  });
  return m ?? null;
}
