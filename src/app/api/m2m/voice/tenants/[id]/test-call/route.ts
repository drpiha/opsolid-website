import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { authorizeM2M } from "@/lib/auth/m2m";
import { getVoiceProvider } from "@/lib/voice/provider";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// POST /api/m2m/voice/tenants/:id/test-call
//
// Initiates an outbound test call for a tenant. Uses M2M auth instead of
// tenant token — Kutasia admin can trigger this during onboarding.
//
// If agentId is omitted the first active agent for the tenant is used.
// The tenant's first active phone number is used as the caller ID
// (Retell requires a from_number for outbound calls).
//
// Auth: Authorization: Bearer <M2M_ADMIN_TOKEN>
// -----------------------------------------------------------------------------

const E164 = /^\+[1-9]\d{1,14}$/;

const TestCallM2MZ = z
  .object({
    toNumber: z
      .string()
      .regex(E164, "toNumber must match E.164 format (+CCxxxxxxxx)"),
    agentId: z.string().cuid().optional(),
    notes: z.string().max(500).optional(),
  })
  .strict();

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

  const parsed = TestCallM2MZ.safeParse(body);
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
    const tenantExists = await prisma.voiceTenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
    if (!tenantExists) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    // Resolve agent — explicit ID or first active agent.
    const agentWhere = input.agentId
      ? { id: input.agentId, tenantId }
      : { tenantId, status: "active" as const };

    const agent = await prisma.voiceAgent.findFirst({
      where: agentWhere,
      select: { id: true, providerAgentId: true, status: true },
    });

    if (!agent) {
      return NextResponse.json(
        {
          error: input.agentId
            ? "Agent not found in this tenant"
            : "No active agent found for this tenant",
          reason: "no_agent",
        },
        { status: 404 },
      );
    }

    if (!agent.providerAgentId) {
      return NextResponse.json(
        {
          error: "Agent not synced to provider yet. Run provision-agent first.",
          reason: "agent_not_synced",
        },
        { status: 400 },
      );
    }

    // Retell requires a from_number for outbound calls.
    const phone = await prisma.voicePhoneNumber.findFirst({
      where: { tenantId, status: "active" },
      select: { e164Number: true },
    });
    if (!phone) {
      return NextResponse.json(
        {
          error:
            "No active phone number found for this tenant. Import a phone number first.",
          reason: "no_phone_number",
        },
        { status: 422 },
      );
    }

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
        metadata: { fromNumber: phone.e164Number },
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
        data: {
          status: "failed",
          notes: `${input.notes ?? ""}\nERROR: ${errorMsg}`.trim(),
        },
      });
      Sentry.captureException(err, {
        tags: { area: "m2m-voice", route: "test-call.provider" },
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
      tags: { area: "m2m-voice", route: "test-call.outer" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to initiate test call" },
      { status: 500 },
    );
  }
}
