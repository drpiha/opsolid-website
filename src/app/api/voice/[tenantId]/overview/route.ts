import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getCallStats } from "@/lib/voice/analytics";
import { shouldAiAnswerNow } from "@/lib/voice/business-hours";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// GET /api/voice/{tenantId}/overview
// Dashboard landing page payload — call stats, active agent, active phone
// number, the AI-on/off decision for "now", and recent calls.
// -----------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;

  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    if (err instanceof TenantTokenError) {
      const status = err.status;
      return NextResponse.json({ error: err.message }, { status });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [stats, activeAgent, activePhoneNumber, aiDecision, recentCalls] =
      await Promise.all([
        getCallStats(tenantId, 30),
        prisma.voiceAgent.findFirst({
          where: { tenantId, status: "active" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            displayName: true,
            language: true,
            status: true,
            providerAgentId: true,
            lastSyncedAt: true,
          },
        }),
        prisma.voicePhoneNumber.findFirst({
          where: { tenantId, status: "active" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            e164Number: true,
            friendlyName: true,
            status: true,
            agentId: true,
            country: true,
          },
        }),
        shouldAiAnswerNow(tenantId),
        prisma.voiceCall.findMany({
          where: { agent: { tenantId } },
          orderBy: { createdAt: "desc" },
          take: 5,
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
            agent: {
              select: { id: true, name: true, displayName: true },
            },
          },
        }),
      ]);

    return NextResponse.json({
      data: {
        stats,
        activeAgent,
        activePhoneNumber,
        aiDecision,
        recentCalls,
      },
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "overview" },
      extra: { tenantId },
    });
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}
