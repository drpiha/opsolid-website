import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { authorizeM2M } from "@/lib/auth/m2m";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// M2M: list / create VoiceTenants for Kutasia admin dashboard.
// Auth: Authorization: Bearer <M2M_ADMIN_TOKEN>
//
// GET  — tenant list, no secrets in response.
// POST — create tenant; returns tenantToken once (only opportunity to read it).
// -----------------------------------------------------------------------------

function m2mDeny(reason: string): NextResponse {
  return NextResponse.json({ error: "Unauthorized", reason }, { status: 401 });
}

// ---------------------------------------------------------------------------
// GET — list all tenants (no secrets)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const auth = authorizeM2M(req);
  if (!auth.ok) return m2mDeny(auth.reason);

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
        kutasiaOrderId: true,
        trialEndsAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { agents: true, phoneNumbers: true },
        },
      },
    });
    return NextResponse.json({ data: tenants });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "m2m-voice", route: "tenants.list" },
    });
    return NextResponse.json(
      { error: "Failed to load tenants" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — create tenant (returns tenantToken once)
// ---------------------------------------------------------------------------

const CreateVoiceTenantM2MZ = z.object({
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
  kutasiaOrderId: z.string().cuid().optional(),
  featureFlags: z.record(z.string(), z.unknown()).optional(),
});

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 64) || "tenant"
  );
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
  return `${base}-${randomBytes(4).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  const auth = authorizeM2M(req);
  if (!auth.ok) return m2mDeny(auth.reason);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateVoiceTenantM2MZ.safeParse(body);
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
        mode: input.mode ?? "kutasia_module",
        status: input.status ?? "trial",
        planId: input.planId,
        tenantToken,
        webhookSecret,
        providerName: input.providerName ?? "retell",
        businessDescription: input.businessDescription,
        businessAddress: input.businessAddress,
        businessCategory: input.businessCategory,
        kutasiaOrderId: input.kutasiaOrderId,
        featureFlags: (input.featureFlags ?? {}) as object,
      },
    });

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
          kutasiaOrderId: tenant.kutasiaOrderId,
          tenantToken: tenant.tenantToken,
          webhookSecret: tenant.webhookSecret,
          createdAt: tenant.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "m2m-voice", route: "tenants.create" },
    });
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 },
    );
  }
}
