import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";
import { CreateHandoffRuleZ } from "@/lib/voice/validation";

export const runtime = "nodejs";

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
    const rules = await prisma.voiceHandoffRule.findMany({
      where: { tenantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ data: rules });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "handoff-rules.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load handoff rules" },
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

  const parsed = CreateHandoffRuleZ.safeParse(body);
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
    const created = await prisma.voiceHandoffRule.create({
      data: {
        tenantId,
        name: input.name,
        isActive: input.isActive ?? true,
        triggerType: input.triggerType,
        triggerValue: input.triggerValue,
        actionType: input.actionType,
        actionConfig: (input.actionConfig ?? {}) as object,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "handoff-rules.create" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to create handoff rule" },
      { status: 500 },
    );
  }
}
