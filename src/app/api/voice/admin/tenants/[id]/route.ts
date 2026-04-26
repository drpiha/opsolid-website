import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireVoiceAdminToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// Admin: detail / update / delete a single VoiceTenant.
// -----------------------------------------------------------------------------

const UpdateVoiceTenantZ = z
  .object({
    businessName: z.string().min(1).max(200).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().max(40).nullable().optional(),
    timezone: z.string().max(64).optional(),
    locale: z.string().max(8).optional(),
    mode: z.enum(["standalone", "kutasia_module"]).optional(),
    status: z.enum(["trial", "active", "suspended", "cancelled"]).optional(),
    planId: z.string().cuid().nullable().optional(),
    providerName: z.enum(["retell", "vapi", "mock"]).optional(),
    businessDescription: z.string().max(2000).nullable().optional(),
    businessAddress: z.string().max(500).nullable().optional(),
    businessCategory: z
      .enum(["restaurant", "clinic", "hotel", "generic", "appointment"])
      .nullable()
      .optional(),
    featureFlags: z.record(z.string(), z.unknown()).optional(),
    trialEndsAt: z.string().datetime().nullable().optional(),
  })
  .strict();

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    return unauthorized(err);
  }

  const { id } = await params;

  try {
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id },
      include: {
        plan: true,
        agents: {
          select: {
            id: true,
            name: true,
            displayName: true,
            language: true,
            status: true,
            providerAgentId: true,
            lastSyncedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            agents: true,
            phoneNumbers: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Strip tenantToken/apiToken/webhookSecret — admin GET should not leak
    // them. They are exposed only at create time.
    const {
      tenantToken: _tt,
      apiToken: _at,
      webhookSecret: _ws,
      ...safe
    } = tenant;

    return NextResponse.json({ data: safe });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-admin", route: "tenants.get" },
      extra: { tenantId: id },
    });
    return NextResponse.json({ error: "Failed to load tenant" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    return unauthorized(err);
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateVoiceTenantZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Validation failed",
        reason: "validation_failed",
      },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.voiceTenant.findUnique({
      where: { id },
      select: { id: true, featureFlags: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const data = parsed.data;
    // Merge featureFlags rather than replace — partial admin updates should
    // not wipe operator-configured flags.
    const mergedFlags =
      data.featureFlags === undefined
        ? undefined
        : {
            ...(existing.featureFlags as Record<string, unknown>),
            ...data.featureFlags,
          };

    const updated = await prisma.voiceTenant.update({
      where: { id },
      data: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
        ...(data.locale !== undefined && { locale: data.locale }),
        ...(data.mode !== undefined && { mode: data.mode }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.planId !== undefined && { planId: data.planId }),
        ...(data.providerName !== undefined && { providerName: data.providerName }),
        ...(data.businessDescription !== undefined && {
          businessDescription: data.businessDescription,
        }),
        ...(data.businessAddress !== undefined && {
          businessAddress: data.businessAddress,
        }),
        ...(data.businessCategory !== undefined && {
          businessCategory: data.businessCategory,
        }),
        ...(mergedFlags !== undefined && { featureFlags: mergedFlags as object }),
        ...(data.trialEndsAt !== undefined && {
          trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : null,
        }),
      },
      select: {
        id: true,
        slug: true,
        businessName: true,
        contactEmail: true,
        contactPhone: true,
        timezone: true,
        locale: true,
        mode: true,
        status: true,
        planId: true,
        providerName: true,
        businessCategory: true,
        featureFlags: true,
        trialEndsAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-admin", route: "tenants.update" },
      extra: { tenantId: id },
    });
    return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    return unauthorized(err);
  }

  const { id } = await params;

  try {
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Cascade-delete is configured at the Prisma relation level (onDelete:
    // Cascade) for all owned records. VoiceCall→agent uses Restrict, so
    // tenants with calls cannot be deleted until calls are archived. That's
    // intentional — call records are billing/compliance evidence.
    await prisma.voiceTenant.delete({ where: { id } });

    return NextResponse.json({ data: { id, deleted: true } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-admin", route: "tenants.delete" },
      extra: { tenantId: id },
    });
    return NextResponse.json(
      {
        error: "Failed to delete tenant. Existing calls may need to be archived first.",
        reason: "delete_failed",
      },
      { status: 500 },
    );
  }
}
