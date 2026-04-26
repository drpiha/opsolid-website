import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";
import { CreatePhoneNumberZ } from "@/lib/voice/validation";

export const runtime = "nodejs";

const E164 = /^\+[1-9]\d{1,14}$/;

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

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
    const numbers = await prisma.voicePhoneNumber.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        agent: {
          select: { id: true, name: true, displayName: true, status: true },
        },
      },
    });
    return NextResponse.json({ data: numbers });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "phone-numbers.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load phone numbers" },
      { status: 500 },
    );
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

  const parsed = CreatePhoneNumberZ.safeParse(body);
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

  if (!E164.test(input.e164Number)) {
    return NextResponse.json(
      { error: "e164Number must match E.164 format (+CCxxxxxxxx)", reason: "bad_e164" },
      { status: 400 },
    );
  }

  try {
    // If an agentId is supplied, verify it belongs to the tenant — never trust
    // the client to associate a number with an arbitrary agent.
    if (input.agentId) {
      const agent = await prisma.voiceAgent.findFirst({
        where: { id: input.agentId, tenantId },
        select: { id: true, providerAgentId: true },
      });
      if (!agent) {
        return NextResponse.json(
          { error: "Agent not found in this tenant", reason: "bad_agent" },
          { status: 400 },
        );
      }
    }

    const existing = await prisma.voicePhoneNumber.findUnique({
      where: { e164Number: input.e164Number },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Phone number already registered", reason: "duplicate" },
        { status: 409 },
      );
    }

    let providerPhoneId: string | null = null;
    const providerConfigured = !!process.env.RETELL_API_KEY;

    if (providerConfigured && input.agentId) {
      // Only attempt provider import when caller actually wants telephony —
      // otherwise we keep the row as a forwarding/SIP placeholder.
      try {
        const agent = await prisma.voiceAgent.findUnique({
          where: { id: input.agentId },
          select: { providerAgentId: true },
        });
        if (agent?.providerAgentId) {
          const provider = getVoiceProvider();
          const result = await provider.importPhoneNumber({
            e164Number: input.e164Number,
            agentProviderId: agent.providerAgentId,
            country: input.country ?? "DE",
            friendlyName: input.friendlyName,
          });
          providerPhoneId = result?.providerPhoneId ?? null;
        }
      } catch (err) {
        Sentry.captureException(err, {
          tags: { area: "voice-tenant", route: "phone-numbers.create.import" },
          extra: { tenantId, e164: input.e164Number },
        });
        // Surface as 502 so the operator knows provider rejected it — we
        // don't want a silent half-state record.
        return NextResponse.json(
          {
            error:
              err instanceof Error
                ? `Provider import failed: ${err.message}`
                : "Provider import failed",
            reason: "provider_error",
          },
          { status: 502 },
        );
      }
    }

    const created = await prisma.voicePhoneNumber.create({
      data: {
        tenantId,
        agentId: input.agentId ?? null,
        e164Number: input.e164Number,
        friendlyName: input.friendlyName,
        country: input.country ?? "DE",
        providerPhoneId,
        status: "active",
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "phone-numbers.create" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to create phone number" },
      { status: 500 },
    );
  }
}
