import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const UpdateIntegrationZ = z
  .object({
    label: z.string().max(120).nullable().optional(),
    status: z.enum(["active", "inactive", "error"]).optional(),
    credentialsJson: z.record(z.string(), z.unknown()).nullable().optional(),
    configJson: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function sanitize<T extends { credentialsJson?: unknown }>(integ: T) {
  const { credentialsJson, ...rest } = integ;
  return { ...rest, hasCredentials: !!credentialsJson };
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; integId: string }>;
  },
) {
  const { tenantId, integId } = await params;
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

  const parsed = UpdateIntegrationZ.safeParse(body);
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
    const existing = await prisma.voiceIntegration.findFirst({
      where: { id: integId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.voiceIntegration.update({
      where: { id: integId },
      data: {
        ...(input.label !== undefined && { label: input.label }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.credentialsJson !== undefined && {
          credentialsJson: (input.credentialsJson ?? undefined) as
            | object
            | undefined,
        }),
        ...(input.configJson !== undefined && {
          configJson: input.configJson as object,
        }),
      },
    });

    return NextResponse.json({ data: sanitize(updated) });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "integrations.update" },
      extra: { tenantId, integId },
    });
    return NextResponse.json(
      { error: "Failed to update integration" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; integId: string }>;
  },
) {
  const { tenantId, integId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const existing = await prisma.voiceIntegration.findFirst({
      where: { id: integId, tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 },
      );
    }

    await prisma.voiceIntegration.delete({ where: { id: integId } });
    return NextResponse.json({ data: { id: integId, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "integrations.delete" },
      extra: { tenantId, integId },
    });
    return NextResponse.json(
      { error: "Failed to delete integration" },
      { status: 500 },
    );
  }
}
