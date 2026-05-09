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
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { normalizeTagSlug } from "@/lib/discover/tags";

export const runtime = "nodejs";

// Maximum page size a caller can request. Hard-capped to prevent
// accidentally returning unbounded result sets.
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

// Row shape returned by both the raw-SQL search path and the Prisma
// findMany path. Kept to a single shape so the mapper can stay simple.
type DiscoverRow = {
  id: string;
  slug: string | null;
  contactName: string;
  photoPath: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
  languages: string[];
  openToNetworking: boolean;
  acceptingClients: boolean;
  publishedAt: Date | null;
  templateId: number;
  cardData: Prisma.JsonValue;
};

// GET /api/discover/cards
// Query params:
//   q                — free-text search (max 100 chars). Matches across the
//                      six trigram-indexed cardData fields: name, company,
//                      title, industry, city, bio. ILIKE substring across
//                      every one — the new pg_trgm GIN indexes (migration
//                      20260510000000_pg_trgm_search) accelerate it.
//   tag              — single sector tag (kebab-case, ≤24 chars). When set,
//                      only cards whose `cardData.tags` array contains this
//                      tag are returned (JSONB `?` operator).
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
  const tagRaw = searchParams.get("tag")?.trim().slice(0, 24) ?? "";
  const tag = tagRaw ? normalizeTagSlug(tagRaw) : null;
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

  const take = limit + 1;
  let cards: DiscoverRow[];

  // M2 — when `q` is set we use a raw SQL query so the planner picks up the
  // pg_trgm GIN indexes added in 20260510000000_pg_trgm_search. Prisma's
  // string_contains JsonFilter would generate `cast(... as text) like` which
  // does NOT use the gin_trgm_ops indexes; raw `ILIKE` does.
  //
  // Note on cursor pagination + raw SQL: at the current scale (16 cards on
  // prod, growing), the search-result page count is ~1, so cursor pagination
  // for `q` is unlikely to fire. We keep the same offset-style cursor by
  // ordering published_at DESC, id DESC and asking for "anything strictly
  // older than the seen row". `cursor` here is a card id from the previous
  // page — we resolve its (publishedAt, id) and filter on it.
  if (q) {
    const like = `%${escapeLike(q)}%`;

    // Resolve cursor row's (published_at, id) so we can express "next page".
    // Single-row lookup; cheap and only executed on cursor pages.
    let cursorPublishedAt: Date | null = null;
    if (cursor) {
      const seen = await prisma.cardOrder.findUnique({
        where: { id: cursor },
        select: { publishedAt: true },
      });
      cursorPublishedAt = seen?.publishedAt ?? null;
    }

    const tagJson = tag ? JSON.stringify([tag]) : null;

    cards = await prisma.$queryRaw<DiscoverRow[]>`
      SELECT
        co.id,
        co.slug,
        co.contact_name      AS "contactName",
        co.photo_path        AS "photoPath",
        co.industry,
        co.city,
        co.country,
        co.languages,
        co.open_to_networking AS "openToNetworking",
        co.accepting_clients  AS "acceptingClients",
        co.published_at      AS "publishedAt",
        co.template_id       AS "templateId",
        co.card_data         AS "cardData"
      FROM card_orders co
      WHERE co.status = ${OrderStatus.PUBLISHED}
        AND co.visibility = 'public'
        AND ${cursorPublishedAt ? Prisma.sql`(co.published_at < ${cursorPublishedAt} OR (co.published_at = ${cursorPublishedAt} AND co.id < ${cursor}))` : Prisma.sql`TRUE`}
        AND ${industry ? Prisma.sql`co.industry = ${industry}` : Prisma.sql`TRUE`}
        AND ${country ? Prisma.sql`co.country = ${country}` : Prisma.sql`TRUE`}
        AND ${language ? Prisma.sql`${language} = ANY(co.languages)` : Prisma.sql`TRUE`}
        AND ${openToNetworking !== undefined ? Prisma.sql`co.open_to_networking = ${openToNetworking}` : Prisma.sql`TRUE`}
        AND ${acceptingClients !== undefined ? Prisma.sql`co.accepting_clients = ${acceptingClients}` : Prisma.sql`TRUE`}
        AND ${city ? Prisma.sql`co.city ILIKE ${`%${escapeLike(city)}%`}` : Prisma.sql`TRUE`}
        AND ${tagJson ? Prisma.sql`co.card_data -> 'tags' @> ${tagJson}::jsonb` : Prisma.sql`TRUE`}
        AND (
          co.contact_name ILIKE ${like}
          OR (co.card_data->>'name')     ILIKE ${like}
          OR (co.card_data->>'company')  ILIKE ${like}
          OR (co.card_data->>'title')    ILIKE ${like}
          OR (co.card_data->>'industry') ILIKE ${like}
          OR (co.card_data->>'city')     ILIKE ${like}
          OR (co.card_data->>'bio')      ILIKE ${like}
        )
      ORDER BY co.published_at DESC NULLS LAST, co.id DESC
      LIMIT ${take}
    `;
  } else {
    // --- No-search path: regular Prisma findMany (covered by indexes). ---
    const where: Prisma.CardOrderWhereInput = {
      status: OrderStatus.PUBLISHED,
      visibility: "public",
    };
    if (industry) where.industry = industry;
    if (country) where.country = country;
    if (language) where.languages = { has: language };
    if (openToNetworking !== undefined) where.openToNetworking = openToNetworking;
    if (acceptingClients !== undefined) where.acceptingClients = acceptingClients;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (tag) {
      where.cardData = {
        path: ["tags"],
        array_contains: [tag],
      } as Prisma.JsonFilter<"CardOrder">;
    }

    const rows = await prisma.cardOrder.findMany({
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
        cardData: true,
      },
    });
    cards = rows as DiscoverRow[];
  }

  const hasNext = cards.length > limit;
  const items = hasNext ? cards.slice(0, limit) : cards;
  const nextCursor = hasNext ? (items[items.length - 1]?.id ?? null) : null;

  // --- Map to stable public shape ---
  // Callers must NOT depend on the shape of cardData — extract only what is
  // needed here so the serialization contract is explicit and versioned.
  const result = items.map((c) => {
    const data = (c.cardData ?? {}) as Record<string, unknown>;
    const tags = Array.isArray(data.tags)
      ? (data.tags as unknown[]).filter(
          (t): t is string => typeof t === "string",
        )
      : [];
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
      tags,
    };
  });

  return NextResponse.json({ items: result, nextCursor });
}

/** Escape % and _ so user input cannot bleed into the LIKE pattern. */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (m) => `\\${m}`);
}
