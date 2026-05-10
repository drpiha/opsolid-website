// =============================================================================
// /api/v1/cards/[id] — read / update / soft-delete a single user-owned card.
//
// Auth: bearer-only.
// Authorization: card.userId === user.id (no exceptions, including admin —
// admins use /api/admin paths, not the public API).
// Rate limit: 60 / hour read, 30 / hour write per user.
//
// DELETE is a SOFT delete (status -> CANCELLED). Hard delete is intentionally
// not exposed in v1 — it would cascade to leads / views / connections and we
// want a deliberate admin-side affordance for that. Document this in the
// OpenAPI spec.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { CardDataSchema, OrderStatus, QrStyleSchema } from "@/lib/validation";
import { validateManualSlug, isSlugAvailable } from "@/lib/slug";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { CARD_API_SELECT, toApiCard } from "@/lib/api/v1/card-mapping";
import { getTemplateById } from "@/config/card-templates";
import { hashPassword } from "@/lib/auth/password";
import { isPro } from "@/lib/auth/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const READ_RATE_MAX = 60;
const WRITE_RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const PatchSchema = z
  .object({
    cardData: CardDataSchema.optional(),
    status: z
      .enum([
        OrderStatus.PUBLISHED,
        OrderStatus.CANCELLED,
      ])
      .optional(),
    slug: z.string().trim().min(3).max(40).optional(),
    /** Switch the card to a different active template. The renderer keys
     *  layout/theme defaults off templateId, so allowing this on PATCH lets
     *  mobile re-skin a card without recreating it. */
    templateId: z.number().int().positive().optional(),
    layoutKey: z.string().trim().max(64).optional(),
    themeKey: z.string().trim().max(32).optional(),
    brandPrimaryHex: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .optional(),
    brandAccentHex: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .optional(),
    photoPath: z.string().max(500).nullable().optional(),
    logoPath: z.string().max(500).nullable().optional(),
    /** QR style preset + colors. Stored on the dedicated CardOrder.qrStyle
     *  column (separate from cardData) so the renderer can read it without
     *  re-parsing the form blob. */
    qrStyle: QrStyleSchema.optional(),
    /** Phase 8.4 — toggle visitor-side rating widget. When false, the public
     *  /feedback aggregate returns enabled:false and POST /feedback responds
     *  403 feedback_disabled. Owners flip this from the card edit screen. */
    feedbackEnabled: z.boolean().optional(),
  })
  .strict();

const ID_RE = /^[a-z0-9_-]{8,40}$/i;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("cards:read", req, user, READ_RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    if (!ID_RE.test(params.id)) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    const card = await prisma.cardOrder.findUnique({
      where: { id: params.id },
      select: { ...CARD_API_SELECT, userId: true },
    });
    // 404 (not 403) when the card exists but belongs to someone else, to
    // avoid leaking the existence of arbitrary card IDs.
    if (!card || card.userId !== user.id) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    return applyCors(
      NextResponse.json({ card: toApiCard(card) }, { status: 200, headers: { "Cache-Control": "no-store" } }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("cards:write", req, user, WRITE_RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    if (!ID_RE.test(params.id)) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    const body = await readJsonBody(req);
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
          undefined,
          parsed.error.issues,
        ),
        req,
      );
    }

    const existing = await prisma.cardOrder.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true, slug: true, slugHistory: true, status: true },
    });
    if (!existing || existing.userId !== user.id) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.cardData) {
      // M5 — password + tipJar handling (Carrd amendments).
      // The schema accepts `password` as a plain string; the wire shape from
      // mobile is "fresh password to set" or "" (empty) to clear. We hash
      // here before persisting so plaintext never touches the DB.
      const incoming = parsed.data.cardData as Record<string, unknown>;

      // Tip jar is Pro-gated. Quietly drop the field for non-Pro users so an
      // accidental enable on a downgraded card doesn't render to visitors.
      const proCheck = await prisma.user.findUnique({
        where: { id: user.id },
        select: { proSince: true, role: true },
      });
      const userIsPro = isPro({
        proSince: proCheck?.proSince ?? null,
        role: proCheck?.role ?? null,
      });
      if (!userIsPro) {
        if (incoming.tipJar && typeof incoming.tipJar === "object") {
          // Strip stripePriceId (which only Pro users can configure) but keep
          // the visible enabled/label so the form value round-trips. Visitors
          // never see the tip button when not Pro (the public route checks
          // owner pro status defensively).
          delete (incoming.tipJar as Record<string, unknown>).stripePriceId;
        }
        // Same for the password field — non-Pro users can't enable it.
        if ("password" in incoming) {
          delete incoming.password;
        }
      }

      if ("password" in incoming) {
        const raw = incoming.password;
        if (raw === null || raw === "") {
          delete incoming.password;
          // Mark for in-place merge below: explicit clear via separate path.
          (updateData as Record<string, unknown>).__password_clear = true;
        } else if (typeof raw === "string" && raw.length >= 4) {
          incoming.password = await hashPassword(raw);
        } else {
          delete incoming.password;
        }
      }

      // Merge with existing cardData so the password (and other unspecified
      // keys we don't want the client to wipe) persists across PATCHes that
      // don't re-send them. The mobile edit form sends a full cardData blob
      // EXCEPT it omits `password` when the user didn't touch it (so the
      // existing hash is preserved). If `__password_clear` was set, we
      // remove the password key entirely.
      const existingCardData = await prisma.cardOrder.findUnique({
        where: { id: params.id },
        select: { cardData: true },
      });
      const previous =
        (existingCardData?.cardData as Record<string, unknown> | null) ?? {};
      const merged: Record<string, unknown> = { ...incoming };
      if (
        typeof previous.password === "string" &&
        previous.password.length > 0 &&
        !(updateData as Record<string, unknown>).__password_clear &&
        !("password" in incoming)
      ) {
        merged.password = previous.password;
      }
      delete (updateData as Record<string, unknown>).__password_clear;
      updateData.cardData = merged;
    }
    if (parsed.data.templateId !== undefined) {
      // Only allow switching to an active catalog entry. Pricing / billing
      // mode are not re-evaluated here — this is a free-tier visual swap.
      const tpl = getTemplateById(parsed.data.templateId);
      if (!tpl || !tpl.isActive) {
        return applyCors(
          errorJson("unknown_template", "Unknown template.", 404),
          req,
        );
      }
      updateData.templateId = tpl.id;
    }
    if (parsed.data.layoutKey !== undefined) updateData.layoutKey = parsed.data.layoutKey;
    if (parsed.data.themeKey !== undefined) updateData.themeKey = parsed.data.themeKey;
    if (parsed.data.brandPrimaryHex !== undefined) {
      updateData.brandPrimaryHex = parsed.data.brandPrimaryHex;
    }
    if (parsed.data.brandAccentHex !== undefined) {
      updateData.brandAccentHex = parsed.data.brandAccentHex;
    }
    if (parsed.data.photoPath !== undefined) updateData.photoPath = parsed.data.photoPath;
    if (parsed.data.logoPath !== undefined) updateData.logoPath = parsed.data.logoPath;
    if (parsed.data.qrStyle !== undefined) updateData.qrStyle = parsed.data.qrStyle;
    if (parsed.data.feedbackEnabled !== undefined) {
      updateData.feedbackEnabled = parsed.data.feedbackEnabled;
    }
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      if (parsed.data.status === OrderStatus.PUBLISHED && !existing.status) {
        updateData.publishedAt = new Date();
      }
    }

    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const v = validateManualSlug(parsed.data.slug);
      if (!v.ok) {
        return applyCors(
          errorJson("slug_invalid", `Slug invalid: ${v.reason}`, 400),
          req,
        );
      }
      if (!(await isSlugAvailable(v.slug))) {
        return applyCors(
          errorJson("slug_taken", "Slug already taken.", 409),
          req,
        );
      }
      updateData.slug = v.slug;
      // Preserve the previous slug for permanent redirect support.
      if (existing.slug) {
        const next = Array.from(new Set([...(existing.slugHistory ?? []), existing.slug]));
        updateData.slugHistory = next;
      }
    }

    const updated = await prisma.cardOrder.update({
      where: { id: params.id },
      data: updateData,
      select: CARD_API_SELECT,
    });

    return applyCors(
      NextResponse.json({ card: toApiCard(updated) }, { status: 200 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/:id] update failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("cards:write", req, user, WRITE_RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    if (!ID_RE.test(params.id)) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    const existing = await prisma.cardOrder.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true, status: true },
    });
    if (!existing || existing.userId !== user.id) {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    await prisma.cardOrder.update({
      where: { id: params.id },
      data: { status: OrderStatus.CANCELLED },
    });
    await prisma.orderStatusHistory.create({
      data: {
        orderId: existing.id,
        fromStatus: existing.status,
        toStatus: OrderStatus.CANCELLED,
        actor: "user",
        note: "Soft-deleted via /api/v1/cards/:id DELETE",
      },
    });

    return applyCors(
      NextResponse.json({ ok: true, id: existing.id }, { status: 200 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/:id] delete failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
