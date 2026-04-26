import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const NotifConfigZ = z
  .object({
    id: z.string().cuid().optional(),
    channelType: z.enum(["email", "telegram", "whatsapp", "webhook"]),
    label: z.string().max(120).nullable().optional(),
    isActive: z.boolean().optional().default(true),
    triggerOn: z.array(z.string().max(64)).max(20).optional().default([]),
    config: z.record(z.string(), z.unknown()).optional().default({}),
  })
  .strict();

const PutBodyZ = z.array(NotifConfigZ).max(50);

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// GET — list all notification configs for tenant.
// PUT — atomically replace ALL configs for the tenant. Caller sends the full
//   intended state; we delete missing rows in the same transaction to avoid
//   a stale-config window.
//
// We never echo `config` payloads that contain secrets in plaintext. The
// dashboard re-sends them only when the operator changes them.
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
    const configs = await prisma.voiceNotificationConfig.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ data: configs });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "notifications.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load notification configs" },
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
  const desired = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.voiceNotificationConfig.findMany({
        where: { tenantId },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((e) => e.id));
      const incomingIds = new Set(
        desired.map((d) => d.id).filter((v): v is string => !!v),
      );

      // Delete rows the caller didn't include — full-replace semantics.
      const toDelete = Array.from(existingIds).filter((id) => !incomingIds.has(id));
      if (toDelete.length > 0) {
        await tx.voiceNotificationConfig.deleteMany({
          where: { id: { in: toDelete }, tenantId },
        });
      }

      for (const cfg of desired) {
        if (cfg.id && existingIds.has(cfg.id)) {
          await tx.voiceNotificationConfig.update({
            where: { id: cfg.id },
            data: {
              channelType: cfg.channelType,
              label: cfg.label ?? null,
              isActive: cfg.isActive ?? true,
              triggerOn: cfg.triggerOn ?? [],
              config: (cfg.config ?? {}) as object,
            },
          });
        } else {
          await tx.voiceNotificationConfig.create({
            data: {
              tenantId,
              channelType: cfg.channelType,
              label: cfg.label ?? null,
              isActive: cfg.isActive ?? true,
              triggerOn: cfg.triggerOn ?? [],
              config: (cfg.config ?? {}) as object,
            },
          });
        }
      }

      return tx.voiceNotificationConfig.findMany({
        where: { tenantId },
        orderBy: { createdAt: "asc" },
      });
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "notifications.put" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to update notification configs" },
      { status: 500 },
    );
  }
}
