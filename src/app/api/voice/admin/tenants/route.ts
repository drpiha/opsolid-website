import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireVoiceAdminToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

// -----------------------------------------------------------------------------
// Admin: list / create VoiceTenant.
// Auth: VOICE_ADMIN_TOKEN via requireVoiceAdminToken.
// We never return tenantToken/apiToken/webhookSecret in the list response —
// they leak the entire tenant. Single-tenant detail (returned only on POST
// create) does include the freshly minted tenantToken so the operator can
// hand it to the customer once.
// -----------------------------------------------------------------------------

const CreateVoiceTenantZ = z.object({
  businessName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(40).optional(),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric or dash")
    .optional(),
  timezone: z.string().max(64).optional(),
  locale: z.string().max(8).optional(),
  mode: z.enum(["standalone", "kutasia_module"]).optional(),
  status: z.enum(["trial", "active", "suspended", "cancelled"]).optional(),
  planId: z.string().cuid().optional(),
  providerName: z.enum(["retell", "vapi", "mock"]).optional(),
  businessDescription: z.string().max(2000).optional(),
  businessAddress: z.string().max(500).optional(),
  businessCategory: z
    .enum(["restaurant", "clinic", "hotel", "generic", "appointment"])
    .optional(),
  featureFlags: z.record(z.string(), z.unknown()).optional(),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64) || "tenant";
}

async function ensureUniqueTenantSlug(base: string): Promise<string> {
  let candidate = base;
  for (let i = 0; i < 50; i++) {
    const existing = await prisma.voiceTenant.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${randomBytes(2).toString("hex")}`;
  }
  // Defensive fallback — astronomical odds we ever hit this.
  return `${base}-${randomBytes(4).toString("hex")}`;
}

export async function GET(req: NextRequest) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    if (err instanceof TenantTokenError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenants = await prisma.voiceTenant.findMany({
      orderBy: { createdAt: "desc" },
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
        trialEndsAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            agents: true,
            phoneNumbers: true,
          },
        },
      },
    });

    return NextResponse.json({ data: tenants });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-admin", route: "tenants.list" },
    });
    return NextResponse.json({ error: "Failed to load tenants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireVoiceAdminToken(req);
  } catch (err) {
    if (err instanceof TenantTokenError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateVoiceTenantZ.safeParse(body);
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
    const baseSlug = slugify(input.slug ?? input.businessName);
    const slug = await ensureUniqueTenantSlug(baseSlug);
    const tenantToken = randomBytes(32).toString("hex");
    const webhookSecret = randomBytes(32).toString("hex");

    const tenant = await prisma.voiceTenant.create({
      data: {
        slug,
        businessName: input.businessName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        timezone: input.timezone ?? "Europe/Berlin",
        locale: input.locale ?? "de",
        mode: input.mode ?? "standalone",
        status: input.status ?? "trial",
        planId: input.planId,
        tenantToken,
        webhookSecret,
        providerName: input.providerName ?? "retell",
        businessDescription: input.businessDescription,
        businessAddress: input.businessAddress,
        businessCategory: input.businessCategory,
        featureFlags: (input.featureFlags ?? {}) as object,
      },
    });

    // Returning tenantToken is intentional: this is the ONLY moment the
    // platform admin can copy it. After this response it lives only in the DB.
    return NextResponse.json(
      {
        data: {
          id: tenant.id,
          slug: tenant.slug,
          businessName: tenant.businessName,
          contactEmail: tenant.contactEmail,
          contactPhone: tenant.contactPhone,
          timezone: tenant.timezone,
          locale: tenant.locale,
          mode: tenant.mode,
          status: tenant.status,
          planId: tenant.planId,
          providerName: tenant.providerName,
          businessCategory: tenant.businessCategory,
          tenantToken: tenant.tenantToken,
          webhookSecret: tenant.webhookSecret,
          createdAt: tenant.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-admin", route: "tenants.create" },
    });
    return NextResponse.json({ error: "Failed to create tenant" }, { status: 500 });
  }
}
