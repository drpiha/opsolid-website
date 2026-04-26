import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const UpdateAppointmentRuleZ = z
  .object({
    name: z.string().min(1).max(120).optional(),
    isActive: z.boolean().optional(),
    bookingType: z
      .enum(["direct_cal", "direct_url", "email_request", "phone_callback"])
      .optional(),
    calApiKey: z.string().max(500).nullable().optional(),
    calEventTypeId: z.number().int().positive().nullable().optional(),
    bookingUrl: z.string().url().max(500).nullable().optional(),
    bufferMinutes: z.number().int().min(0).max(1440).optional(),
    minNoticeMinutes: z.number().int().min(0).max(43200).optional(),
    maxDaysAhead: z.number().int().min(1).max(365).optional(),
    slotDurationMin: z.number().int().min(5).max(1440).optional(),
    conflictPolicy: z.enum(["reject", "offer_next", "waitlist"]).optional(),
    confirmationMsg: z.string().max(2000).nullable().optional(),
    requireFields: z.array(z.string().max(64)).max(20).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function sanitize<T extends { calApiKey?: string | null }>(rule: T) {
  const { calApiKey, ...rest } = rule;
  return { ...rest, hasCalApiKey: !!calApiKey };
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; ruleId: string }>;
  },
) {
  const { tenantId, ruleId } = await params;
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

  const parsed = UpdateAppointmentRuleZ.safeParse(body);
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
    const existing = await prisma.voiceAppointmentRule.findFirst({
      where: { id: ruleId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Appointment rule not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.voiceAppointmentRule.update({
      where: { id: ruleId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.bookingType !== undefined && { bookingType: input.bookingType }),
        ...(input.calApiKey !== undefined && { calApiKey: input.calApiKey }),
        ...(input.calEventTypeId !== undefined && {
          calEventTypeId: input.calEventTypeId,
        }),
        ...(input.bookingUrl !== undefined && { bookingUrl: input.bookingUrl }),
        ...(input.bufferMinutes !== undefined && {
          bufferMinutes: input.bufferMinutes,
        }),
        ...(input.minNoticeMinutes !== undefined && {
          minNoticeMinutes: input.minNoticeMinutes,
        }),
        ...(input.maxDaysAhead !== undefined && {
          maxDaysAhead: input.maxDaysAhead,
        }),
        ...(input.slotDurationMin !== undefined && {
          slotDurationMin: input.slotDurationMin,
        }),
        ...(input.conflictPolicy !== undefined && {
          conflictPolicy: input.conflictPolicy,
        }),
        ...(input.confirmationMsg !== undefined && {
          confirmationMsg: input.confirmationMsg,
        }),
        ...(input.requireFields !== undefined && {
          requireFields: input.requireFields as unknown as object,
        }),
      },
    });

    return NextResponse.json({ data: sanitize(updated) });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "appointment-rules.update" },
      extra: { tenantId, ruleId },
    });
    return NextResponse.json(
      { error: "Failed to update appointment rule" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; ruleId: string }>;
  },
) {
  const { tenantId, ruleId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const existing = await prisma.voiceAppointmentRule.findFirst({
      where: { id: ruleId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Appointment rule not found" },
        { status: 404 },
      );
    }

    await prisma.voiceAppointmentRule.delete({ where: { id: ruleId } });
    return NextResponse.json({ data: { id: ruleId, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "appointment-rules.delete" },
      extra: { tenantId, ruleId },
    });
    return NextResponse.json(
      { error: "Failed to delete appointment rule" },
      { status: 500 },
    );
  }
}
