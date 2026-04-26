import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

// Compliance settings live inside VoiceTenant.featureFlags JSON. Centralizing
// the keys here keeps the GET/PATCH contract narrow and prevents stray keys
// from being injected into the flags blob.
const COMPLIANCE_KEYS = [
  "VOICE_RECORDINGS_ENABLED",
  "VOICE_GDPR_AUTO_DELETE",
  "retentionDays",
  "aiDisclosureEnabled",
  "emergencyEscalationEnabled",
  "dpaStatus",
] as const;

type ComplianceKey = (typeof COMPLIANCE_KEYS)[number];

const ComplianceSettingsZ = z
  .object({
    VOICE_RECORDINGS_ENABLED: z.boolean().optional(),
    VOICE_GDPR_AUTO_DELETE: z.boolean().optional(),
    retentionDays: z.number().int().min(0).max(3650).optional(),
    aiDisclosureEnabled: z.boolean().optional(),
    emergencyEscalationEnabled: z.boolean().optional(),
    dpaStatus: z.enum(["pending", "signed", "na"]).optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function extractCompliance(
  flags: Record<string, unknown> | null | undefined,
): Record<ComplianceKey, unknown> {
  const safe = flags ?? {};
  const out = {} as Record<ComplianceKey, unknown>;
  for (const key of COMPLIANCE_KEYS) {
    out[key] = safe[key];
  }
  return out;
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
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id: tenantId },
      select: { featureFlags: true },
    });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: extractCompliance(tenant.featureFlags as Record<string, unknown>),
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "compliance.get" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load compliance settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(
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

  const parsed = ComplianceSettingsZ.safeParse(body);
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
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id: tenantId },
      select: { featureFlags: true },
    });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Merge — never replace the entire featureFlags blob, since other
    // operator-set flags coexist there.
    const merged: Record<string, unknown> = {
      ...(tenant.featureFlags as Record<string, unknown>),
    };
    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) merged[key] = value;
    }

    const updated = await prisma.voiceTenant.update({
      where: { id: tenantId },
      data: { featureFlags: merged as object },
      select: { featureFlags: true },
    });

    return NextResponse.json({
      data: extractCompliance(updated.featureFlags as Record<string, unknown>),
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "compliance.patch" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to update compliance settings" },
      { status: 500 },
    );
  }
}
