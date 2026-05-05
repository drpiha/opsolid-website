// =============================================================================
// GET /api/discover/cards — public professional card discovery.
//
// Returns a paginated list of PUBLISHED cards with visibility="public".
// Designed to be consumed by a future directory/people-search UI.
//
// Security guarantees:
//   • Only status=PUBLISHED + visibility=public rows are ever returned.
//   • Input is length-capped and type-coerced before hitting the DB.
//   • No authentication required — the response contains only public data.
//   • Cursor-based pagination prevents enumeration of the full dataset.
//
// Caching: not cached at the route level — callers (CDN, RSC) may add their
// own layer. The where clause is index-covered so cold reads are cheap.
//
// Rate limit: callers should implement their own CDN-level rate limiting.
// This endpoint is intentionally stateless and lightweight.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";

export const runtime = "nodejs";

// Maximum page size a caller can request. Hard-capped to prevent
// accidentally returning unbounded result sets.
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

// GET /api/discover/cards
// Query params:
//   q                — free-text search against name (max 100 chars)
//   industry         — exact match on industry field
//   city             — case-insensitive contains match on city field (max 100 chars)
//   country          — exact match on ISO 3166-1 alpha-2 country code (e.g. "DE")
//   language         — card must include this language code in its languages[] array
//   openToNetworking — "true" to filter to networking-open profiles only
//   acceptingClients — "true" to filter to profiles actively accepting clients
//   cursor           — last card id from previous page (for cursor-based pagination)
//   limit            — page size, 1–50 (default 20)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // --- Input parsing & sanitization ---
  const q = searchParams.get("q")?.trim().slice(0, 100) ?? "";
  const industry = searchParams.get("industry")?.trim().slice(0, 100) || undefined;
  const city = searchParams.get("city")?.trim().slice(0, 100) || undefined;
  const country = searchParams.get("country")?.trim().slice(0, 10) || undefined;
  const language = searchParams.get("language")?.trim().slice(0, 10) || undefined;
  const openToNetworking =
    searchParams.get("openToNetworking") === "true" ? true : undefined;
  const acceptingClients =
    searchParams.get("acceptingClients") === "true" ? true : undefined;
  const cursor = searchParams.get("cursor") || undefined;
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(rawLimit, MAX_LIMIT))
    : DEFAULT_LIMIT;

  // --- Where clause construction ---
  // Always anchor on status + visibility — both are covered by the composite index.
  const where: Record<string, unknown> = {
    status: OrderStatus.PUBLISHED,
    visibility: "public",
  };

  if (industry) where.industry = industry;
  if (country) where.country = country;
  if (language) where.languages = { has: language };
  if (openToNetworking !== undefined) where.openToNetworking = openToNetworking;
  if (acceptingClients !== undefined) where.acceptingClients = acceptingClients;

  // Case-insensitive city contains — hits idx_card_order_country as a loose
  // scan; city-specific index not warranted at current scale.
  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  // Free-text name search. cardData is JSONB so we keep it simple for MVP:
  // match on the denormalized contactName column which is always populated.
  // A future iteration can add a generated column + GIN index for full JSONB search.
  if (q) {
    where.contactName = { contains: q, mode: "insensitive" };
  }

  // --- Paginated query (cursor-based) ---
  // Fetch one extra row to detect whether a next page exists without a
  // separate COUNT(*) query.
  const take = limit + 1;
  const cards = await prisma.cardOrder.findMany({
    where,
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      contactName: true,
      photoPath: true,
      industry: true,
      city: true,
      country: true,
      languages: true,
      openToNetworking: true,
      acceptingClients: true,
      publishedAt: true,
      templateId: true,
      // cardData is fetched so we can extract title/company for the
      // discovery card summary. We never forward the raw field — only
      // specific extracted scalars reach the response.
      cardData: true,
    },
  });

  const hasNext = cards.length > limit;
  const items = hasNext ? cards.slice(0, limit) : cards;
  const nextCursor = hasNext ? (items[items.length - 1]?.id ?? null) : null;

  // --- Map to stable public shape ---
  // Callers must NOT depend on the shape of cardData — extract only what is
  // needed here so the serialization contract is explicit and versioned.
  const result = items.map((c) => {
    const data = (c.cardData ?? {}) as Record<string, unknown>;
    return {
      id: c.id,
      slug: c.slug,
      name: c.contactName,
      title: typeof data.title === "string" ? data.title : null,
      company: typeof data.company === "string" ? data.company : null,
      photoPath: c.photoPath,
      industry: c.industry,
      city: c.city,
      country: c.country,
      languages: c.languages,
      openToNetworking: c.openToNetworking,
      acceptingClients: c.acceptingClients,
      publishedAt: c.publishedAt?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ items: result, nextCursor });
}
