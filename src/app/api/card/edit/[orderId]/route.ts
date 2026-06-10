// =============================================================================
// Customer self-service edit endpoint — PATCH /api/card/edit/[orderId]?t=...
//
// Gate: `requireEditToken` (constant-time, per-order UUID). No admin bearer.
// Writable fields: cardData, brandPrimaryHex, brandAccentHex, photoPath,
// logoPath, and an optional designer hint that gets appended to designNotes.
// Non-writable: billingMode, template, contact email/name/phone (those need
// support — changing them after payment would break Stripe customer mapping).
//
// Blocks edits in PENDING_PAYMENT (not paid yet), CANCELLED, REFUNDED (archive
// states). Editing during AWAITING_DESIGN leaves a "customer edited — re-render
// before publish" flag in designNotes so the designer notices before going live.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { validateManualSlug, isSlugAvailable } from "@/lib/slug";
import { getTemplateById } from "@/config/card-templates";

export const runtime = "nodejs";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a #rrggbb hex")
  .optional()
  .or(z.literal("").transform(() => undefined));

const PatchSchema = z.object({
  cardData: CardDataSchema,
  /** Owner-switchable design template. Validated against the catalog below. */
  templateId: z.number().int().positive().optional(),
  brandPrimaryHex: hexColor,
  brandAccentHex: hexColor,
  photoPath: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logoPath: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  /** Phase 8 — optional slug rename. Only honored on PUBLISHED orders; the
   *  old slug is appended to slug_history for 308 redirects. */
  slug: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  /** Phase 8.1 — discovery visibility and networking flags. */
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  openToNetworking: z.boolean().optional(),
  acceptingClients: z.boolean().optional(),
  /** Optimistic concurrency — the order.updatedAt ISO string the client
   *  loaded. When provided and stale (another tab saved since), the PATCH
   *  is rejected with 409 version_conflict instead of last-write-wins.
   *  Optional so older clients and admin tooling keep working unchanged. */
  expectedVersion: z.string().datetime().optional(),
});

const NON_EDITABLE_STATUSES = new Set<string>([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    if (NON_EDITABLE_STATUSES.has(order.status)) {
      return NextResponse.json(
        { error: "not_editable", status: order.status },
        { status: 409 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Owner switched the design template. Guard against unknown ids so a bad
    // value can't point the renderer at a non-existent template.
    let nextTemplateId: number | null = null;
    if (data.templateId !== undefined && data.templateId !== order.templateId) {
      if (!getTemplateById(data.templateId)) {
        return NextResponse.json(
          { error: "template_invalid" },
          { status: 400 },
        );
      }
      nextTemplateId = data.templateId;
    }

    // If the designer is still preparing the first render, nudge them to
    // pick up the new input. Appended rather than overwriting so they can
    // still see their own prior internal notes.
    const designerHint =
      order.status === OrderStatus.AWAITING_DESIGN
        ? `[${new Date().toISOString()}] customer edited — re-render before publish`
        : null;

    const nextDesignNotes = designerHint
      ? [order.designNotes?.trim(), designerHint].filter(Boolean).join("\n")
      : order.designNotes;

    // Phase 8 — slug rename. Only meaningful on PUBLISHED orders. Validates
    // the new slug, checks uniqueness, then atomically swaps slug + appends
    // the old one to slug_history so old links keep working via 308 redirect.
    let nextSlug: string | null = null;
    let oldSlugForHistory: string | null = null;
    if (data.slug && data.slug !== order.slug) {
      if (order.status !== OrderStatus.PUBLISHED) {
        return NextResponse.json(
          { error: "slug_rename_unsupported_state", status: order.status },
          { status: 409 },
        );
      }
      const v = validateManualSlug(data.slug);
      if (!v.ok) {
        return NextResponse.json(
          { error: "slug_invalid", reason: v.reason },
          { status: 400 },
        );
      }
      if (!(await isSlugAvailable(v.slug))) {
        return NextResponse.json({ error: "slug_taken" }, { status: 409 });
      }
      nextSlug = v.slug;
      oldSlugForHistory = order.slug;
    }

    // Two-tab guard: reject saves based on a stale snapshot. Comparison is
    // ISO-string equality on updatedAt — cheap, and good enough for a single
    // editor session (no merge semantics intended).
    if (
      data.expectedVersion &&
      order.updatedAt.toISOString() !== data.expectedVersion
    ) {
      return NextResponse.json(
        { error: "version_conflict", currentVersion: order.updatedAt.toISOString() },
        { status: 409 }
      );
    }

    const updated = await prisma.cardOrder.update({
      where: { id: order.id },
      data: {
        cardData: data.cardData,
        ...(nextTemplateId !== null ? { templateId: nextTemplateId } : {}),
        brandPrimaryHex: data.brandPrimaryHex ?? null,
        brandAccentHex: data.brandAccentHex ?? null,
        photoPath: data.photoPath ?? null,
        logoPath: data.logoPath ?? null,
        designNotes: nextDesignNotes,
        // Phase 8.1 — persist discovery/visibility settings when provided.
        ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
        ...(data.openToNetworking !== undefined ? { openToNetworking: data.openToNetworking } : {}),
        ...(data.acceptingClients !== undefined ? { acceptingClients: data.acceptingClients } : {}),
        ...(nextSlug
          ? {
              slug: nextSlug,
              slugHistory: oldSlugForHistory
                ? { push: oldSlugForHistory }
                : undefined,
            }
          : {}),
      },
    });

    // Audit trail — status doesn't change, so from == to.
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        actor: "customer-self-edit",
        note: nextSlug
          ? `Customer renamed slug ${oldSlugForHistory} → ${nextSlug}`
          : (designerHint ?? "Customer edited card content"),
      },
    });

    return NextResponse.json({
      ok: true,
      slug: nextSlug ?? order.slug,
      // Fresh version for the client to rebase its next expectedVersion on.
      version: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit PATCH] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
