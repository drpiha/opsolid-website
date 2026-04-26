import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

// CreateAppointmentRuleZ is defined locally — the lib/voice/validation barrel
// has no equivalent right now, but the schema mirrors model field constraints.
const CreateAppointmentRuleZ = z
  .object({
    name: z.string().min(1).max(120),
    isActive: z.boolean().optional(),
    bookingType: z.enum([
      "direct_cal",
      "direct_url",
      "email_request",
      "phone_callback",
    ]),
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

// Strip secrets from API responses — calApiKey lives in the DB only.
function sanitize<T extends { calApiKey?: string | null }>(rule: T) {
  const { calApiKey, ...rest } = rule;
  return { ...rest, hasCalApiKey: !!calApiKey };
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
    const rules = await prisma.voiceAppointmentRule.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ data: rules.map(sanitize) });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "appointment-rules.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load appointment rules" },
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

  const parsed = CreateAppointmentRuleZ.safeParse(body);
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
    const created = await prisma.voiceAppointmentRule.create({
      data: {
        tenantId,
        name: input.name,
        isActive: input.isActive ?? true,
        bookingType: input.bookingType,
        calApiKey: input.calApiKey ?? null,
        calEventTypeId: input.calEventTypeId ?? null,
        bookingUrl: input.bookingUrl ?? null,
        bufferMinutes: input.bufferMinutes ?? 15,
        minNoticeMinutes: input.minNoticeMinutes ?? 60,
        maxDaysAhead: input.maxDaysAhead ?? 30,
        slotDurationMin: input.slotDurationMin ?? 60,
        conflictPolicy: input.conflictPolicy ?? "offer_next",
        confirmationMsg: input.confirmationMsg ?? null,
        requireFields:
          input.requireFields ?? (["name", "phone"] as unknown as object),
      },
    });
    return NextResponse.json({ data: sanitize(created) }, { status: 201 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "appointment-rules.create" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to create appointment rule" },
      { status: 500 },
    );
  }
}
