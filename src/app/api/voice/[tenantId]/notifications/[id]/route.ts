import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const PatchBodyZ = z
  .object({
    channelType: z.enum(["email", "telegram", "whatsapp", "webhook"]).optional(),
    label: z.string().max(120).nullable().optional(),
    isActive: z.boolean().optional(),
    triggerOn: z.array(z.string().max(64)).max(20).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// PATCH — partial update of a single notification config (toggle isActive,
// rename label, switch channelType, etc).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string; id: string }> },
) {
  const { tenantId, id } = await params;
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

  const parsed = PatchBodyZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        reason: "validation_failed",
      },
      { status: 400 },
    );
  }
  const patch = parsed.data;

  try {
    const existing = await prisma.voiceNotificationConfig.findFirst({
      where: { id, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }
    const data: Record<string, unknown> = {};
    if (patch.channelType !== undefined) data.channelType = patch.channelType;
    if (patch.label !== undefined) data.label = patch.label;
    if (patch.isActive !== undefined) data.isActive = patch.isActive;
    if (patch.triggerOn !== undefined) data.triggerOn = patch.triggerOn;
    if (patch.config !== undefined) data.config = patch.config as object;

    const updated = await prisma.voiceNotificationConfig.update({
      where: { id },
      data,
    });
    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "notifications.patch" },
      extra: { tenantId, id },
    });
    return NextResponse.json(
      { error: "Failed to update notification config" },
      { status: 500 },
    );
  }
}

// DELETE — remove a single config.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string; id: string }> },
) {
  const { tenantId, id } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const result = await prisma.voiceNotificationConfig.deleteMany({
      where: { id, tenantId },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }
    return NextResponse.json({ data: { id, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "notifications.delete" },
      extra: { tenantId, id },
    });
    return NextResponse.json(
      { error: "Failed to delete notification config" },
      { status: 500 },
    );
  }
}
