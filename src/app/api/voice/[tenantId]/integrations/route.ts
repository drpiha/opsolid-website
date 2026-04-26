import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const CreateIntegrationZ = z
  .object({
    integrationType: z.enum([
      "cal_com",
      "google_calendar",
      "custom_webhook",
      "email_only",
    ]),
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

// credentialsJson is encrypted-at-rest material. We never echo it back —
// instead we report a boolean presence flag.
function sanitize<T extends { credentialsJson?: unknown }>(integ: T) {
  const { credentialsJson, ...rest } = integ;
  return { ...rest, hasCredentials: !!credentialsJson };
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
    const integrations = await prisma.voiceIntegration.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ data: integrations.map(sanitize) });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "integrations.list" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load integrations" },
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

  const parsed = CreateIntegrationZ.safeParse(body);
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
    const created = await prisma.voiceIntegration.create({
      data: {
        tenantId,
        integrationType: input.integrationType,
        label: input.label ?? null,
        status: input.status ?? "inactive",
        credentialsJson: (input.credentialsJson ?? undefined) as object | undefined,
        configJson: (input.configJson ?? {}) as object,
      },
    });
    return NextResponse.json({ data: sanitize(created) }, { status: 201 });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "integrations.create" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 },
    );
  }
}
