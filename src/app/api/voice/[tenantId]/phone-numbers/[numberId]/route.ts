import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { getVoiceProvider } from "@/lib/voice/provider";

export const runtime = "nodejs";

const UpdatePhoneNumberZ = z
  .object({
    friendlyName: z.string().max(120).nullable().optional(),
    agentId: z.string().cuid().nullable().optional(),
    status: z.enum(["active", "released", "pending"]).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; numberId: string }>;
  },
) {
  const { tenantId, numberId } = await params;
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

  const parsed = UpdatePhoneNumberZ.safeParse(body);
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
    const existing = await prisma.voicePhoneNumber.findFirst({
      where: { id: numberId, tenantId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Phone number not found" },
        { status: 404 },
      );
    }

    if (input.agentId) {
      const agent = await prisma.voiceAgent.findFirst({
        where: { id: input.agentId, tenantId },
        select: { id: true },
      });
      if (!agent) {
        return NextResponse.json(
          { error: "Agent not found in this tenant", reason: "bad_agent" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.voicePhoneNumber.update({
      where: { id: numberId },
      data: {
        ...(input.friendlyName !== undefined && {
          friendlyName: input.friendlyName,
        }),
        ...(input.agentId !== undefined && { agentId: input.agentId }),
        ...(input.status !== undefined && { status: input.status }),
      },
      include: {
        agent: { select: { id: true, name: true, displayName: true } },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "phone-numbers.update" },
      extra: { tenantId, numberId },
    });
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; numberId: string }>;
  },
) {
  const { tenantId, numberId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const existing = await prisma.voicePhoneNumber.findFirst({
      where: { id: numberId, tenantId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Phone number not found" },
        { status: 404 },
      );
    }

    if (existing.providerPhoneId) {
      try {
        const provider = getVoiceProvider();
        await provider.releasePhoneNumber(existing.providerPhoneId);
      } catch (err) {
        // Provider release failure isn't fatal — we still mark our row as
        // released so the customer can stop using it. Sentry captures the
        // residual state for ops cleanup.
        Sentry.captureException(err, {
          tags: { area: "voice-tenant", route: "phone-numbers.release" },
          extra: { tenantId, numberId, providerPhoneId: existing.providerPhoneId },
        });
      }
    }

    const updated = await prisma.voicePhoneNumber.update({
      where: { id: numberId },
      data: { status: "released", releasedAt: new Date() },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "phone-numbers.delete" },
      extra: { tenantId, numberId },
    });
    return NextResponse.json(
      { error: "Failed to release phone number" },
      { status: 500 },
    );
  }
}
