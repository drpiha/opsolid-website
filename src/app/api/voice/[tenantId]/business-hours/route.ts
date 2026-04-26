import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

// HH:MM 24h format, 00-23 hours, 00-59 minutes.
const TimeStringZ = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:MM (24h)");

const WeeklyRowZ = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: TimeStringZ,
    closeTime: TimeStringZ,
    isClosed: z.boolean().optional().default(false),
    aiMode: z
      .enum(["always_on", "overflow", "outside_hours", "manual_off"])
      .optional()
      .default("always_on"),
  })
  .strict();

const PutBodyZ = z.array(WeeklyRowZ).min(0).max(50);

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// GET — return all business-hour rows for the tenant (weekly + overrides).
// PUT — replace ALL non-override (weekly) rows for the tenant atomically.
//   Holiday/override rows are NEVER touched by this endpoint to avoid
//   accidentally wiping seasonal closures during a routine schedule edit.
// -----------------------------------------------------------------------------

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
    const rows = await prisma.voiceBusinessHours.findMany({
      where: { tenantId },
      orderBy: [{ isOverride: "asc" }, { dayOfWeek: "asc" }, { overrideDate: "asc" }],
    });
    return NextResponse.json({ data: rows });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "business-hours.get" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load business hours" },
      { status: 500 },
    );
  }
}

export async function PUT(
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

  const parsed = PutBodyZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        reason: "validation_failed",
      },
      { status: 400 },
    );
  }
  const rows = parsed.data;

  // Reject duplicate dayOfWeek entries up front — the unique index would
  // throw, but a clear 400 is friendlier than P2002.
  const seen = new Set<number>();
  for (const row of rows) {
    if (seen.has(row.dayOfWeek)) {
      return NextResponse.json(
        {
          error: `Duplicate dayOfWeek=${row.dayOfWeek} in payload`,
          reason: "duplicate_day",
        },
        { status: 400 },
      );
    }
    seen.add(row.dayOfWeek);
    if (!row.isClosed && row.openTime >= row.closeTime) {
      return NextResponse.json(
        {
          error: `closeTime must be after openTime for day ${row.dayOfWeek}`,
          reason: "bad_range",
        },
        { status: 400 },
      );
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.voiceBusinessHours.deleteMany({
        where: { tenantId, isOverride: false },
      });
      if (rows.length > 0) {
        await tx.voiceBusinessHours.createMany({
          data: rows.map((r) => ({
            tenantId,
            dayOfWeek: r.dayOfWeek,
            openTime: r.openTime,
            closeTime: r.closeTime,
            isClosed: r.isClosed ?? false,
            aiMode: r.aiMode ?? "always_on",
            isOverride: false,
            overrideDate: null,
          })),
        });
      }
      return tx.voiceBusinessHours.findMany({
        where: { tenantId },
        orderBy: [{ isOverride: "asc" }, { dayOfWeek: "asc" }],
      });
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "business-hours.put" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to update business hours" },
      { status: 500 },
    );
  }
}
