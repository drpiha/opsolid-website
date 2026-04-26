import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { processCallEnded } from "@/lib/voice/processing";

export const runtime = "nodejs";

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// POST — re-queue summary/extraction for a call. Resets processingStatus
// to "pending" and fires processCallEnded in the background.
// -----------------------------------------------------------------------------
export async function POST(
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
      select: { id: true, providerCallId: true },
    });

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    await prisma.voiceCall.update({
      where: { id: callId },
      data: { processingStatus: "pending", processingError: null },
    });

    // Fire-and-forget: caller doesn't wait for the LLM pipeline.
    void processCallEnded(call.providerCallId, {}).catch((err) => {
      Sentry.captureException(err, {
        tags: { area: "voice-tenant", route: "calls.regenerate" },
        extra: { tenantId, callId },
      });
    });

    return NextResponse.json({ data: { queued: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "calls.regenerate.outer" },
      extra: { tenantId, callId },
    });
    return NextResponse.json(
      { error: "Failed to queue regeneration" },
      { status: 500 },
    );
  }
}
