import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";
import { isTenantEnabled } from "@/lib/voice/feature-flags";

export const runtime = "nodejs";

const E164 = /^\+[1-9]\d{1,14}$/;

const TestCallBodyZ = z
  .object({
    toNumber: z
      .string()
      .regex(E164, "toNumber must match E.164 format (+CCxxxxxxxx)"),
    agentId: z.string().cuid(),
    notes: z.string().max(500).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// POST — initiate an outbound test call to verify the agent + telephony path.
// Gated by VOICE_TEST_CALL_ENABLED feature flag. Records a VoiceTestRun row
// regardless of provider success so failed attempts are auditable.
// -----------------------------------------------------------------------------
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

  if (!(await isTenantEnabled("VOICE_TEST_CALL_ENABLED", tenantId))) {
    return NextResponse.json(
      { error: "Test calls are disabled", reason: "feature_disabled" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = TestCallBodyZ.safeParse(body);
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
    const agent = await prisma.voiceAgent.findFirst({
      where: { id: input.agentId, tenantId },
      select: {
        id: true,
        providerAgentId: true,
        status: true,
      },
    });
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found in this tenant", reason: "bad_agent" },
        { status: 404 },
      );
    }

    if (!agent.providerAgentId) {
      return NextResponse.json(
        {
          error: "Agent not synced to provider yet",
          reason: "agent_not_synced",
        },
        { status: 400 },
      );
    }

    // Create the test run row first so we always have an audit record, even
    // if the provider rejects the request a moment later.
    const testRun = await prisma.voiceTestRun.create({
      data: {
        tenantId,
        agentId: agent.id,
        toNumber: input.toNumber,
        notes: input.notes,
        status: "initiated",
      },
    });

    let providerCallId: string | null = null;
    try {
      const provider = getVoiceProvider();
      const result = await provider.initiateTestCall({
        agentProviderId: agent.providerAgentId,
        toNumber: input.toNumber,
      });
      providerCallId = result?.providerCallId ?? null;

      await prisma.voiceTestRun.update({
        where: { id: testRun.id },
        data: {
          providerCallId,
          status: providerCallId ? "initiated" : "failed",
        },
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Provider error";
      await prisma.voiceTestRun.update({
        where: { id: testRun.id },
        data: { status: "failed", notes: `${input.notes ?? ""}\nERROR: ${errorMsg}`.trim() },
      });
      Sentry.captureException(err, {
        tags: { area: "voice-tenant", route: "test-call.provider" },
        extra: { tenantId, agentId: agent.id },
      });
      return NextResponse.json(
        {
          error: `Provider rejected test call: ${errorMsg}`,
          reason: "provider_error",
          testRunId: testRun.id,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        data: {
          testRunId: testRun.id,
          providerCallId,
          status: providerCallId ? "initiated" : "failed",
        },
      },
      { status: 201 },
    );
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "test-call.outer" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to initiate test call" },
      { status: 500 },
    );
  }
}
