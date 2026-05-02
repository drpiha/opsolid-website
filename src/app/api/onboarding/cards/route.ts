// =============================================================================
// POST /api/onboarding/cards — Faz 7.0a B0.7
//
// Cookie-authenticated card creation for the self-onboarding wizard. Unlike
// /api/v1/cards (Bearer-only, mobile) or /api/orders (anonymous, Stripe-aware),
// this endpoint:
//
//   1. Authenticates via the refresh-cookie session (web SPA pattern).
//   2. Wires `userId` on the created CardOrder so the card appears in the
//      authenticated user's /dashboard/cards list immediately.
//   3. Creates a FREE-tier card directly — no Stripe round-trip — so the
//      onboarding flow can finish in <60 seconds.
//
// Two creation modes via `?mode=publish|draft`:
//   - publish (default): status = PUBLISHED, slug allocated, /c/<slug> live
//   - draft:             status = AWAITING_DESIGN, slug still allocated so the
//                        user can preview but it's clearly "in progress" in
//                        the dashboard list.
//
// Slug handling: client may send `desiredSlug` (validated + uniqueness checked
// here). On collision we return 409 `slug_taken` so the wizard can suggest a
// numeric suffix. If no slug is sent, we generate `name-xxxx` server-side via
// ensureUniqueSlug.
// =============================================================================

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { ensureUniqueSlug, validateManualSlug, isSlugAvailable } from "@/lib/slug";
import { getTemplateById } from "@/config/card-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const OnboardingCreateSchema = z.object({
  templateId: z.number().int().positive(),
  cardData: CardDataSchema,
  desiredSlug: z.string().trim().min(3).max(40).optional(),
  brandPrimaryHex: hexColor.optional(),
  brandAccentHex: hexColor.optional(),
  photoPath: z.string().trim().max(500).optional(),
  logoPath: z.string().trim().max(500).optional(),
  publish: z.boolean().default(true),
  locale: z.enum(["de", "en", "tr"]).default("en"),
});

export async function POST(req: Request) {
  // 1. Auth — refresh cookie only. The wizard always runs in the browser,
  //    so we don't accept Bearer here (keeps the surface tight).
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;
  if (!user) {
    return NextResponse.json(
      { error: { code: "not_authenticated", message: "Please sign in." } },
      { status: 401 },
    );
  }

  // 2. Body parse + validate.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Invalid JSON." } },
      { status: 400 },
    );
  }
  const parsed = OnboardingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_payload",
          message: parsed.error.issues[0]?.message ?? "Invalid payload.",
          issues: parsed.error.issues,
        },
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 3. Template existence (registry-level check via card-templates catalog).
  const template = getTemplateById(data.templateId);
  if (!template || !template.isActive) {
    return NextResponse.json(
      { error: { code: "unknown_template", message: "Unknown template." } },
      { status: 404 },
    );
  }

  // 4. Slug allocation. Customer-typed slug wins when valid + free; otherwise
  //    we auto-generate from the contact name.
  let slug: string;
  if (data.desiredSlug) {
    const v = validateManualSlug(data.desiredSlug);
    if (!v.ok) {
      return NextResponse.json(
        { error: { code: "slug_invalid", message: `Slug invalid: ${v.reason}` } },
        { status: 400 },
      );
    }
    if (!(await isSlugAvailable(v.slug))) {
      return NextResponse.json(
        { error: { code: "slug_taken", message: "Slug already taken." } },
        { status: 409 },
      );
    }
    slug = v.slug;
  } else {
    slug = await ensureUniqueSlug(data.cardData.name);
  }

  // 5. Status: PUBLISHED for live, AWAITING_DESIGN for draft. Schema has no
  //    explicit DRAFT — AWAITING_DESIGN is the closest "not yet live" state
  //    used elsewhere in the app, and it surfaces with a "Draft" pill in
  //    the dashboard via the existing status-history machinery.
  const targetStatus = data.publish
    ? OrderStatus.PUBLISHED
    : OrderStatus.AWAITING_DESIGN;
  const editToken = crypto.randomUUID();
  const now = new Date();

  try {
    const created = await prisma.cardOrder.create({
      data: {
        templateId: template.id,
        userId: user.id,
        contactName: data.cardData.name,
        contactEmail: data.cardData.email ?? user.email,
        contactPhone: data.cardData.phone ?? "",
        callMeBack: false,
        cardData: data.cardData,
        brandPrimaryHex: data.brandPrimaryHex,
        brandAccentHex: data.brandAccentHex,
        photoPath: data.photoPath,
        logoPath: data.logoPath,
        billingMode: "FREE",
        amountCents: 0,
        currency: "EUR",
        locale: data.locale,
        status: targetStatus,
        slug,
        paidAt: now,
        publishedAt: data.publish ? now : null,
        awaitingDesignAt: data.publish ? null : now,
        editToken,
      },
      select: {
        id: true,
        slug: true,
        status: true,
        editToken: true,
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: created.id,
        fromStatus: null,
        toStatus: targetStatus,
        actor: "user",
        note: data.publish
          ? "Created via onboarding wizard (FREE, published)"
          : "Created via onboarding wizard (FREE, draft)",
      },
    });

    return NextResponse.json(
      {
        card: {
          id: created.id,
          slug: created.slug,
          status: created.status,
          editToken: created.editToken,
          publicUrl: `/c/${created.slug}`,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[onboarding/cards] create failed:", err);
    return NextResponse.json(
      { error: { code: "server_error", message: "Internal error." } },
      { status: 500 },
    );
  }
}
