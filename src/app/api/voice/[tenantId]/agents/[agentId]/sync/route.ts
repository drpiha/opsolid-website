import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";
import {
  renderKnowledgeBaseSection,
  renderHandoffSection,
} from "@/lib/voice/prompts";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// POST — push the agent's current configuration to the provider.
// Creates the provider record if missing, otherwise updates in place. Always
// stamps lastSyncedAt on success.
// -----------------------------------------------------------------------------
export async function POST(
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

  if (!process.env.RETELL_API_KEY) {
    return NextResponse.json(
      { error: "No provider configured", reason: "provider_unset" },
      { status: 400 },
    );
  }

  try {
    const agent = await prisma.voiceAgent.findFirst({
      where: { id: agentId, tenantId },
    });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const provider = getVoiceProvider();

    // Compose the prompt sent to the provider:
    //   stored systemPrompt (textarea content)
    //   + Wissensdatenbank section (all active KB items for the tenant)
    //   + Eskalationsregeln section (all active handoff rules for the tenant)
    // Without this, KB items live in the DB but the AI never sees them.
    const [kbItems, handoffRules] = await Promise.all([
      prisma.voiceKnowledgeBaseItem.findMany({
        where: { tenantId, isActive: true },
        orderBy: [{ itemType: "asc" }, { sortOrder: "asc" }],
        select: { itemType: true, title: true, content: true },
      }),
      prisma.voiceHandoffRule.findMany({
        where: { tenantId, isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          name: true,
          triggerType: true,
          triggerValue: true,
          actionType: true,
        },
      }),
    ]);

    const sections: string[] = [agent.systemPrompt.trim()];
    const kbSection = renderKnowledgeBaseSection(kbItems);
    if (kbSection) sections.push(kbSection);
    const handoffSection = renderHandoffSection(handoffRules);
    if (handoffSection) sections.push(handoffSection);
    const composedPrompt = sections.join("\n\n");

    if (agent.providerAgentId) {
      await provider.updateAgent({
        providerId: agent.providerAgentId,
        name: agent.name,
        displayName: agent.displayName,
        language: agent.language,
        voiceId: agent.voiceId,
        systemPrompt: composedPrompt,
        maxDurationSeconds: agent.maxDurationSeconds,
        interruptionSensitivity: agent.interruptionSensitivity,
        responseDelayMs: agent.responseDelayMs,
        endCallPhrases: agent.endCallPhrases,
        ambientSoundEnabled: agent.ambientSoundEnabled,
        llmModel: agent.llmModel,
        providerOverrides: agent.providerOverrides as Record<string, unknown>,
      });
      await prisma.voiceAgent.update({
        where: { id: agent.id },
        data: { lastSyncedAt: new Date() },
      });
      return NextResponse.json({
        data: {
          id: agent.id,
          providerAgentId: agent.providerAgentId,
          action: "updated",
          syncedAt: new Date().toISOString(),
        },
      });
    }

    const result = await provider.createAgent({
      name: agent.name,
      displayName: agent.displayName,
      language: agent.language,
      voiceId: agent.voiceId,
      systemPrompt: composedPrompt,
      maxDurationSeconds: agent.maxDurationSeconds,
      interruptionSensitivity: agent.interruptionSensitivity,
      responseDelayMs: agent.responseDelayMs,
      endCallPhrases: agent.endCallPhrases,
      dtmfHandoffDigit: agent.dtmfHandoffDigit,
      ambientSoundEnabled: agent.ambientSoundEnabled,
      llmModel: agent.llmModel,
      providerOverrides: agent.providerOverrides as Record<string, unknown>,
    });

    if (!result?.providerId) {
      return NextResponse.json(
        { error: "Provider did not return an agent id", reason: "provider_no_id" },
        { status: 502 },
      );
    }

    await prisma.voiceAgent.update({
      where: { id: agent.id },
      data: {
        providerAgentId: result.providerId,
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({
      data: {
        id: agent.id,
        providerAgentId: result.providerId,
        action: "created",
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.sync" },
      extra: { tenantId, agentId },
    });
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Provider sync failed: ${err.message}`
            : "Provider sync failed",
        reason: "provider_error",
      },
      { status: 502 },
    );
  }
}
