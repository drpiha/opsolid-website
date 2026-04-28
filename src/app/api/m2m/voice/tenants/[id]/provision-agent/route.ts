import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { authorizeM2M } from "@/lib/auth/m2m";
import { getVoiceProvider } from "@/lib/voice/provider";
import { renderSystemPrompt } from "@/lib/voice/prompts";
import {
  VoiceAgentLanguageZ,
  PromptTemplateKeyZ,
} from "@/lib/voice/validation";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// POST /api/m2m/voice/tenants/:id/provision-agent
//
// Creates a VoiceAgent in DB and immediately syncs it to the Retell provider.
// Called by Kutasia during onboarding to auto-provision without requiring
// the customer to log in to the admin dashboard first.
//
// If the provider sync fails the DB record is still created (status=draft)
// so the operator can re-sync via the tenant dashboard later.
//
// Auth: Authorization: Bearer <M2M_ADMIN_TOKEN>
// -----------------------------------------------------------------------------

const ProvisionAgentZ = z.object({
  name: z.string().min(1).max(80),
  displayName: z.string().min(1).max(80).optional(),
  language: VoiceAgentLanguageZ.optional(),
  voiceId: z.string().min(1).max(120).optional(),
  promptTemplate: PromptTemplateKeyZ,
  systemPrompt: z.string().max(20000).optional(),
  maxDurationSeconds: z.number().int().min(60).max(7200).optional(),
  responseDelayMs: z.number().int().min(0).max(5000).optional(),
  interruptionSensitivity: z.number().min(0).max(1).optional(),
  endCallPhrases: z.array(z.string().min(1).max(120)).max(20).optional(),
  ambientSoundEnabled: z.boolean().optional(),
  providerOverrides: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = authorizeM2M(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized", reason: auth.reason },
      { status: 401 },
    );
  }

  const { id: tenantId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ProvisionAgentZ.safeParse(body);
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
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    const language = input.language ?? "de";

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
            language,
          });

    const agent = await prisma.voiceAgent.create({
      data: {
        tenantId,
        name: input.name,
        displayName: input.displayName ?? input.name,
        language,
        voiceId: input.voiceId ?? "",
        status: "draft",
        promptTemplate: input.promptTemplate,
        systemPrompt,
        maxDurationSeconds: input.maxDurationSeconds ?? 600,
        interruptionSensitivity: input.interruptionSensitivity ?? 0.8,
        responseDelayMs: input.responseDelayMs ?? 500,
        endCallPhrases: input.endCallPhrases ?? [],
        ambientSoundEnabled: input.ambientSoundEnabled ?? false,
        providerOverrides: (input.providerOverrides ?? {}) as object,
      },
    });

    let providerSynced = false;
    let providerError: string | null = null;
    let providerAgentId: string | null = null;

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
        providerAgentId = result.providerId;
        await prisma.voiceAgent.update({
          where: { id: agent.id },
          data: {
            providerAgentId: result.providerId,
            status: "active",
            lastSyncedAt: new Date(),
          },
        });
        providerSynced = true;
      }
    } catch (err) {
      providerError =
        err instanceof Error ? err.message : "Provider sync failed";
      Sentry.captureException(err, {
        tags: { area: "m2m-voice", route: "provision-agent.sync" },
        extra: { tenantId, agentId: agent.id },
      });
    }

    return NextResponse.json(
      {
        data: {
          agentId: agent.id,
          providerAgentId,
          status: providerSynced ? "active" : "draft",
        },
        meta: { providerSynced, providerError },
      },
      { status: 201 },
    );
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "m2m-voice", route: "provision-agent.outer" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to provision agent" },
      { status: 500 },
    );
  }
}
