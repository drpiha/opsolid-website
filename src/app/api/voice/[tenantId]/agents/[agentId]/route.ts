import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";
import { UpdateVoiceAgentZ } from "@/lib/voice/validation";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function loadAgent(tenantId: string, agentId: string) {
  return prisma.voiceAgent.findFirst({
    where: { id: agentId, tenantId },
  });
}

// -----------------------------------------------------------------------------
// GET — agent detail with last 5 calls + total count.
// PATCH — update editable fields. If providerAgentId is set and prompt/voice
//   changed we also push the update to the provider (best-effort).
// DELETE — only if not active. Active agents must be paused/archived first to
//   avoid mid-call deletes.
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; agentId: string }>;
  },
) {
  const { tenantId, agentId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const agent = await prisma.voiceAgent.findFirst({
      where: { id: agentId, tenantId },
      include: {
        _count: { select: { calls: true } },
        calls: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            providerCallId: true,
            direction: true,
            fromNumber: true,
            toNumber: true,
            status: true,
            disposition: true,
            outcomeType: true,
            durationSeconds: true,
            summaryText: true,
            startedAt: true,
            endedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ data: agent });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.get" },
      extra: { tenantId, agentId },
    });
    return NextResponse.json({ error: "Failed to load agent" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; agentId: string }>;
  },
) {
  const { tenantId, agentId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateVoiceAgentZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        reason: "validation_failed",
      },
      { status: 400 },
    );
  }
  const input = parsed.data;

  try {
    const existing = await loadAgent(tenantId, agentId);
    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updated = await prisma.voiceAgent.update({
      where: { id: agentId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.displayName !== undefined && { displayName: input.displayName }),
        ...(input.language !== undefined && { language: input.language }),
        ...(input.voiceId !== undefined && { voiceId: input.voiceId }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.promptTemplate !== undefined && {
          promptTemplate: input.promptTemplate,
        }),
        ...(input.systemPrompt !== undefined && {
          systemPrompt: input.systemPrompt,
        }),
        ...(input.maxDurationSeconds !== undefined && {
          maxDurationSeconds: input.maxDurationSeconds,
        }),
        ...(input.interruptionSensitivity !== undefined && {
          interruptionSensitivity: input.interruptionSensitivity,
        }),
        ...(input.responseDelayMs !== undefined && {
          responseDelayMs: input.responseDelayMs,
        }),
        ...(input.endCallPhrases !== undefined && {
          endCallPhrases: input.endCallPhrases,
        }),
        ...(input.dtmfHandoffDigit !== undefined && {
          dtmfHandoffDigit: input.dtmfHandoffDigit,
        }),
        ...(input.ambientSoundEnabled !== undefined && {
          ambientSoundEnabled: input.ambientSoundEnabled,
        }),
        ...(input.llmModel !== undefined && {
          llmModel: input.llmModel,
        }),
        ...(input.providerOverrides !== undefined && {
          providerOverrides: input.providerOverrides as object,
        }),
      },
    });

    // If the agent has a provider record AND prompt/voice/duration/model
    // changed, push the diff to the provider. Best-effort — operator can
    // re-sync.
    const promptChanged =
      input.systemPrompt !== undefined &&
      input.systemPrompt !== existing.systemPrompt;
    const voiceChanged =
      input.voiceId !== undefined && input.voiceId !== existing.voiceId;
    const durationChanged =
      input.maxDurationSeconds !== undefined &&
      input.maxDurationSeconds !== existing.maxDurationSeconds;
    const modelChanged =
      input.llmModel !== undefined && input.llmModel !== existing.llmModel;

    let providerSynced = false;
    let providerError: string | null = null;
    if (
      existing.providerAgentId &&
      (promptChanged || voiceChanged || durationChanged || modelChanged)
    ) {
      try {
        const provider = getVoiceProvider();
        await provider.updateAgent({
          providerId: existing.providerAgentId,
          name: updated.name,
          language: updated.language,
          voiceId: updated.voiceId,
          systemPrompt: updated.systemPrompt,
          maxDurationSeconds: updated.maxDurationSeconds,
          interruptionSensitivity: updated.interruptionSensitivity,
          responseDelayMs: updated.responseDelayMs,
          endCallPhrases: updated.endCallPhrases,
          ambientSoundEnabled: updated.ambientSoundEnabled,
          llmModel: updated.llmModel,
          providerOverrides: updated.providerOverrides as Record<string, unknown>,
        });
        await prisma.voiceAgent.update({
          where: { id: agentId },
          data: { lastSyncedAt: new Date() },
        });
        providerSynced = true;
      } catch (err) {
        providerError =
          err instanceof Error ? err.message : "Provider update failed";
        Sentry.captureException(err, {
          tags: { area: "voice-tenant", route: "agents.update.sync" },
          extra: { tenantId, agentId },
        });
      }
    }

    return NextResponse.json({
      data: updated,
      meta: { providerSynced, providerError },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.update" },
      extra: { tenantId, agentId },
    });
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; agentId: string }>;
  },
) {
  const { tenantId, agentId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const agent = await loadAgent(tenantId, agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (agent.status === "active") {
      return NextResponse.json(
        {
          error: "Cannot delete an active agent. Pause or archive it first.",
          reason: "agent_active",
        },
        { status: 409 },
      );
    }

    await prisma.voiceAgent.delete({ where: { id: agentId } });
    return NextResponse.json({ data: { id: agentId, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.delete" },
      extra: { tenantId, agentId },
    });
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
