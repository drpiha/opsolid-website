import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const UpdateSettingsZ = z
  .object({
    businessName: z.string().min(1).max(200).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().max(40).nullable().optional(),
    timezone: z.string().max(64).optional(),
    locale: z.string().max(8).optional(),
    businessDescription: z.string().max(2000).nullable().optional(),
    businessAddress: z.string().max(500).nullable().optional(),
    businessCategory: z
      .enum(["restaurant", "clinic", "hotel", "generic", "appointment"])
      .nullable()
      .optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Fields exposed to the tenant dashboard. Tokens, secrets, planId, and
// platform-controlled fields (mode/status) are intentionally excluded.
const SAFE_TENANT_SELECT = {
  id: true,
  slug: true,
  businessName: true,
  contactEmail: true,
  contactPhone: true,
  timezone: true,
  locale: true,
  mode: true,
  status: true,
  providerName: true,
  businessDescription: true,
  businessAddress: true,
  businessCategory: true,
  trialEndsAt: true,
  createdAt: true,
  updatedAt: true,
  plan: {
    select: {
      id: true,
      planKey: true,
      displayName: true,
      monthlyMinutes: true,
      overageRateCents: true,
      monthlyCents: true,
      yearlyCents: true,
      features: true,
    },
  },
} as const;

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
      select: SAFE_TENANT_SELECT,
    });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }
    return NextResponse.json({ data: tenant });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "settings.get" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to load settings" },
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

  const parsed = UpdateSettingsZ.safeParse(body);
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
    const existing = await prisma.voiceTenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const updated = await prisma.voiceTenant.update({
      where: { id: tenantId },
      data: {
        ...(input.businessName !== undefined && { businessName: input.businessName }),
        ...(input.contactEmail !== undefined && { contactEmail: input.contactEmail }),
        ...(input.contactPhone !== undefined && { contactPhone: input.contactPhone }),
        ...(input.timezone !== undefined && { timezone: input.timezone }),
        ...(input.locale !== undefined && { locale: input.locale }),
        ...(input.businessDescription !== undefined && {
          businessDescription: input.businessDescription,
        }),
        ...(input.businessAddress !== undefined && {
          businessAddress: input.businessAddress,
        }),
        ...(input.businessCategory !== undefined && {
          businessCategory: input.businessCategory,
        }),
      },
      select: SAFE_TENANT_SELECT,
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "settings.patch" },
      extra: { tenantId },
    });
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
