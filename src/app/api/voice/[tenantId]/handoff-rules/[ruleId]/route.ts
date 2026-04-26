import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const UpdateHandoffRuleZ = z
  .object({
    name: z.string().min(1).max(120).optional(),
    isActive: z.boolean().optional(),
    triggerType: z
      .enum(["keyword", "sentiment", "duration", "dtmf", "topic"])
      .optional(),
    triggerValue: z.string().max(500).nullable().optional(),
    actionType: z
      .enum([
        "transfer_call",
        "send_sms",
        "send_email",
        "create_callback_task",
      ])
      .optional(),
    actionConfig: z.record(z.string(), z.unknown()).optional(),
    sortOrder: z.number().int().min(0).max(10000).optional(),
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

  const parsed = UpdateHandoffRuleZ.safeParse(body);
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
    // Tenant ownership check up front — never let one tenant edit another's rules.
    const existing = await prisma.voiceHandoffRule.findFirst({
      where: { id: ruleId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Handoff rule not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.voiceHandoffRule.update({
      where: { id: ruleId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.triggerType !== undefined && { triggerType: input.triggerType }),
        ...(input.triggerValue !== undefined && {
          triggerValue: input.triggerValue,
        }),
        ...(input.actionType !== undefined && { actionType: input.actionType }),
        ...(input.actionConfig !== undefined && {
          actionConfig: input.actionConfig as object,
        }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "handoff-rules.update" },
      extra: { tenantId, ruleId },
    });
    return NextResponse.json(
      { error: "Failed to update handoff rule" },
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
    const existing = await prisma.voiceHandoffRule.findFirst({
      where: { id: ruleId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Handoff rule not found" },
        { status: 404 },
      );
    }

    await prisma.voiceHandoffRule.delete({ where: { id: ruleId } });
    return NextResponse.json({ data: { id: ruleId, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "handoff-rules.delete" },
      extra: { tenantId, ruleId },
    });
    return NextResponse.json(
      { error: "Failed to delete handoff rule" },
      { status: 500 },
    );
  }
}
