// =============================================================================
// AI orchestrator — refresh AI fields on a thread.
//
// Called after a new inbound message is ingested. Idempotent: skips when
// the message count hasn't moved since the last regen.
//
// Steps:
// 1. Look up thread + recent messages.
// 2. (Optional) If the latest inbound has a voiceUrl and no transcript yet,
//    run Whisper and persist the transcript onto the message.
// 3. Analyze the trimmed transcript → summary / sentiment / intent /
//    language / priority. Persist on the thread.
//
// Suggestion (draft reply) is NOT auto-run here — it's expensive and the UI
// triggers it on demand via /api/inbox/threads/[id]/ai/suggest.
// =============================================================================

import { prisma } from "@/lib/prisma";
import { analyzeThread, type AnalyzableMessage } from "./analyze";
import { transcribeAudio } from "./transcribe";

export interface RegenerateOptions {
  /** Force regen even if message count hasn't changed. */
  force?: boolean;
  /** Override owner locale (defaults to user.locale). */
  ownerLocale?: string;
}

export interface RegenerateResult {
  skipped: boolean;
  reason?: string;
  analysisModel?: string;
  transcribedMessages?: number;
}

export async function regenerateThreadAI(
  threadId: string,
  opts: RegenerateOptions = {},
): Promise<RegenerateResult> {
  const thread = await prisma.inboxThread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { locale: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread) return { skipped: true, reason: "thread_not_found" };

  if (!opts.force && thread.aiMessageCount === thread.messages.length) {
    return { skipped: true, reason: "no_new_messages" };
  }

  // Step 1: Transcribe any inbound voice messages we haven't transcribed yet.
  let transcribed = 0;
  for (const msg of thread.messages) {
    if (
      msg.direction === "in" &&
      msg.voiceUrl &&
      !msg.voiceTranscript
    ) {
      const result = await transcribeAudio(msg.voiceUrl, {
        languageHint: msg.language ?? thread.contactLocale,
      });
      if (result?.text) {
        await prisma.inboxMessage.update({
          where: { id: msg.id },
          data: {
            voiceTranscript: result.text,
            language: msg.language ?? result.language,
          },
        });
        msg.voiceTranscript = result.text;
        transcribed += 1;
      }
    }
  }

  // Step 2: Analyze.
  const ownerLocale = opts.ownerLocale ?? thread.user.locale ?? "en";
  const analyzable: AnalyzableMessage[] = thread.messages.map((m) => ({
    direction: m.direction as "in" | "out",
    body: m.body,
    voiceTranscript: m.voiceTranscript,
    createdAt: m.createdAt,
  }));

  const analysis = await analyzeThread(analyzable, ownerLocale);

  await prisma.inboxThread.update({
    where: { id: thread.id },
    data: {
      aiSummary: analysis.summary || null,
      aiSentiment: analysis.sentiment,
      aiIntent: analysis.intent,
      aiUpdatedAt: new Date(),
      aiMessageCount: thread.messages.length,
      priority: Math.max(thread.priority, analysis.priority),
      // Lock in language on the thread as soon as we have a confident read.
      contactLocale: thread.contactLocale ?? analysis.language,
    },
  });

  return {
    skipped: false,
    analysisModel: analysis.model,
    transcribedMessages: transcribed,
  };
}
