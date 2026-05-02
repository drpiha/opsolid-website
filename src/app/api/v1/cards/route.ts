// =============================================================================
// /api/v1/cards — list + create cards owned by the authenticated user.
//
// GET  ?limit=&cursor=  → cursor-paginated list (newest first)
// POST { templateId, cardData, ... } → create a FREE-tier card; paid tiers
//                                      still go through /api/orders for now
//                                      (Stripe checkout requires browser
//                                      redirects which the public API surface
//                                      does not handle).
//
// Auth: bearer-only.
// Rate limit: 60 / hour list, 10 / hour create — generous reads, tight writes.
// =============================================================================

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { ensureUniqueSlug, validateManualSlug, isSlugAvailable } from "@/lib/slug";
import { getTemplateById } from "@/config/card-templates";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import {
  buildPage,
  decodeCursor,
  parseLimit,
} from "@/lib/api/v1/pagination";
import {
  CARD_API_SELECT,
  toApiCard,
} from "@/lib/api/v1/card-mapping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIST_RATE_MAX = 60;
const CREATE_RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const CreateCardSchema = z.object({
  templateId: z.number().int().positive(),
  cardData: CardDataSchema,
  desiredSlug: z.string().trim().min(3).max(40).optional(),
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
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("cards:list", req, user, LIST_RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const url = new URL(req.url);
    const pageLimit = parseLimit(url.searchParams.get("limit"));
    const cursor = decodeCursor(url.searchParams.get("cursor"));

    // Cursor-based pagination: fetch limit+1 to compute nextCursor; order by
    // (createdAt DESC, id DESC) for a stable total order. The cursor predicate
    // uses the lexicographic equivalent of "anything strictly older than the
    // last seen row".
    const where = cursor
      ? {
          userId: user.id,
          OR: [
            { createdAt: { lt: new Date(cursor.ts) } },
            {
              createdAt: new Date(cursor.ts),
              id: { lt: cursor.id },
            },
          ],
        }
      : { userId: user.id };

    const rows = await prisma.cardOrder.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: pageLimit + 1,
      select: CARD_API_SELECT,
    });

    const page = buildPage(rows, pageLimit);

    return applyCors(
      NextResponse.json(
        {
          items: page.items.map(toApiCard),
          nextCursor: page.nextCursor,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      ),
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

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("cards:create", req, user, CREATE_RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const body = await readJsonBody(req);
    const parsed = CreateCardSchema.safeParse(body);
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
    const data = parsed.data;

    const template = getTemplateById(data.templateId);
    if (!template || !template.isActive) {
      return applyCors(
        errorJson("unknown_template", "Unknown template.", 404),
        req,
      );
    }

    // /api/v1/cards creates a FREE-tier card immediately. Paid creation goes
    // through the web /api/orders path because it needs a Stripe checkout
    // redirect; mobile clients should open that flow in a webview if needed.
    let slug: string;
    if (data.desiredSlug) {
      const v = validateManualSlug(data.desiredSlug);
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
      slug = v.slug;
    } else {
      slug = await ensureUniqueSlug(data.cardData.name);
    }

    const editToken = crypto.randomUUID();

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
        layoutKey: data.layoutKey,
        themeKey: data.themeKey,
        billingMode: "FREE",
        amountCents: 0,
        currency: "EUR",
        locale: user.locale ?? "de",
        status: OrderStatus.PUBLISHED,
        slug,
        paidAt: new Date(),
        publishedAt: new Date(),
        editToken,
      },
      select: CARD_API_SELECT,
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: created.id,
        fromStatus: null,
        toStatus: OrderStatus.PUBLISHED,
        actor: "user",
        note: "Created via /api/v1/cards (FREE tier)",
      },
    });

    return applyCors(
      NextResponse.json({ card: toApiCard(created) }, { status: 201 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards] create failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
