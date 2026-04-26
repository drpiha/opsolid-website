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
// POST — explicit operator-initiated retry. Functionally identical to the
// summary/regenerate endpoint but kept distinct so dashboards/log filters can
// differentiate "automatic retry" vs "manual reprocess" intent.
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

    void processCallEnded(call.providerCallId, {}).catch((err) => {
      Sentry.captureException(err, {
        tags: { area: "voice-tenant", route: "calls.reprocess" },
        extra: { tenantId, callId },
      });
    });

    return NextResponse.json({ data: { queued: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "calls.reprocess.outer" },
      extra: { tenantId, callId },
    });
    return NextResponse.json(
      { error: "Failed to queue reprocess" },
      { status: 500 },
    );
  }
}
