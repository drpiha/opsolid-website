import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { authorizeM2M } from "@/lib/auth/m2m";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// GET /api/m2m/voice/tenants/:id — single tenant detail for Kutasia.
// Returns public fields + agent/phone counts. No secrets.
// Auth: Authorization: Bearer <M2M_ADMIN_TOKEN>
// -----------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = authorizeM2M(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized", reason: auth.reason },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const tenant = await prisma.voiceTenant.findUnique({
      where: { id },
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
        businessDescription: true,
        businessAddress: true,
        kutasiaOrderId: true,
        featureFlags: true,
        trialEndsAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { agents: true, phoneNumbers: true },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: tenant });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "m2m-voice", route: "tenants.get" },
      extra: { tenantId: id },
    });
    return NextResponse.json(
      { error: "Failed to load tenant" },
      { status: 500 },
    );
  }
}
