import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";
import { renderSystemPrompt } from "@/lib/voice/prompts";
import { CreateVoiceAgentZ } from "@/lib/voice/validation";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// GET — list agents for tenant.
// POST — create a new agent. If status==="active" we also try to push it to
// the provider; provider failures don't block DB creation (operator can sync
// later via /agents/{id}/sync).
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const agents = await prisma.voiceAgent.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { calls: true } },
      },
    });
    return NextResponse.json({ data: agents });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.list" },
      extra: { tenantId },
    });
    return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
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

  const parsed = CreateVoiceAgentZ.safeParse(body);
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
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        businessName: true,
        contactPhone: true,
        contactEmail: true,
        timezone: true,
        locale: true,
        businessDescription: true,
        businessAddress: true,
        businessCategory: true,
      },
    });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Render system prompt from template + tenant context if not supplied.
    const systemPrompt =
      input.systemPrompt && input.systemPrompt.trim().length > 0
        ? input.systemPrompt
        : await renderSystemPrompt(input.promptTemplate, {
            tenantId,
            businessName: tenant.businessName,
            businessDescription: tenant.businessDescription ?? undefined,
            businessAddress: tenant.businessAddress ?? undefined,
            businessCategory: tenant.businessCategory ?? undefined,
            contactEmail: tenant.contactEmail,
            contactPhone: tenant.contactPhone ?? undefined,
            timezone: tenant.timezone,
            locale: tenant.locale,
            language: input.language,
          });

    const agent = await prisma.voiceAgent.create({
      data: {
        tenantId,
        name: input.name,
        displayName: input.displayName ?? input.name,
        language: input.language ?? "de",
        voiceId: input.voiceId ?? "",
        status: "draft",
        promptTemplate: input.promptTemplate,
        systemPrompt,
        maxDurationSeconds: input.maxDurationSeconds ?? 600,
        interruptionSensitivity: input.interruptionSensitivity ?? 0.8,
        responseDelayMs: input.responseDelayMs ?? 500,
        endCallPhrases: input.endCallPhrases ?? [],
        dtmfHandoffDigit: input.dtmfHandoffDigit ?? null,
        ambientSoundEnabled: input.ambientSoundEnabled ?? false,
        providerOverrides: (input.providerOverrides ?? {}) as object,
      },
    });

    // If created as active, try to provision on provider. Wrap in try/catch:
    // a provider hiccup must not undo the DB record — operator can re-sync.
    let providerSynced = false;
    let providerError: string | null = null;
    if (agent.status === "active") {
      try {
        const provider = getVoiceProvider();
        const result = await provider.createAgent({
          name: agent.name,
          displayName: agent.displayName,
          language: agent.language,
          voiceId: agent.voiceId,
          systemPrompt: agent.systemPrompt,
          maxDurationSeconds: agent.maxDurationSeconds,
          interruptionSensitivity: agent.interruptionSensitivity,
          responseDelayMs: agent.responseDelayMs,
          endCallPhrases: agent.endCallPhrases,
          dtmfHandoffDigit: agent.dtmfHandoffDigit,
          ambientSoundEnabled: agent.ambientSoundEnabled,
          providerOverrides: agent.providerOverrides as Record<string, unknown>,
        });
        if (result?.providerId) {
          await prisma.voiceAgent.update({
            where: { id: agent.id },
            data: {
              providerAgentId: result.providerId,
              lastSyncedAt: new Date(),
            },
          });
          providerSynced = true;
        }
      } catch (err) {
        providerError =
          err instanceof Error ? err.message : "Provider sync failed";
        Sentry.captureException(err, {
          tags: { area: "voice-tenant", route: "agents.create.sync" },
          extra: { tenantId, agentId: agent.id },
        });
      }
    }

    const fresh = await prisma.voiceAgent.findUnique({
      where: { id: agent.id },
      include: { _count: { select: { calls: true } } },
    });

    return NextResponse.json(
      {
        data: fresh,
        meta: { providerSynced, providerError },
      },
      { status: 201 },
    );
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "agents.create" },
      extra: { tenantId },
    });
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
