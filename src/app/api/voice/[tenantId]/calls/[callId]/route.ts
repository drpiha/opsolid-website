import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// GET — full call detail. Verifies tenant ownership through agent.tenantId.
// Includes events, agent, phoneNumber for the dashboard detail view.
// -----------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; callId: string }>;
  },
) {
  const { tenantId, callId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const call = await prisma.voiceCall.findFirst({
      where: { id: callId, agent: { tenantId } },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            displayName: true,
            language: true,
            status: true,
          },
        },
        phoneNumber: {
          select: {
            id: true,
            e164Number: true,
            friendlyName: true,
            country: true,
          },
        },
        events: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            eventType: true,
            payload: true,
            createdAt: true,
          },
        },
      },
    });

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({ data: call });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "calls.get" },
      extra: { tenantId, callId },
    });
    return NextResponse.json({ error: "Failed to load call" }, { status: 500 });
  }
}
