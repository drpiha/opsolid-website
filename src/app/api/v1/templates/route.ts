// =============================================================================
// /api/v1/templates — list of active card templates for client pickers.
//
// Read-only, bearer-authenticated. The catalog is static (compiled into the
// bundle) so we serve a long browser / edge cache header — clients can refresh
// on app restart at no cost.
//
// Single source of truth — IMPORTANT:
//   Card visuals are painted by `templateRegistry`
//   (`src/components/cards/templates/v2/registry.ts`). That registry is the
//   authority for what gets rendered for any given `templateId`. Historically
//   this endpoint sourced names/slugs from `src/config/card-templates.ts`,
//   which drifted from the registry for `id >= 2` — users picked one design
//   in the mobile picker and got a different one rendered on `/c/[slug]`.
//
//   This handler now derives `name` + `slug` + `sectorHint` from the registry
//   when an id is registered there, falling back to the catalog only for
//   legacy SmartCard ids (e.g. id=100 Linktree) that have no v2 component.
//   `previewPath`, `themeKey`, and the active-flag filter still come from the
//   catalog — those are billing/SEO metadata the registry doesn't carry, and
//   the preview PNGs are themselves generated from the registry (see
//   `scripts/generate-template-previews.ts`) so they are already correct.
//
// Auth: bearer-only (matches the rest of /api/v1/*).
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import {
  getActiveTemplates,
  type CardTemplateDef,
} from "@/config/card-templates";
import {
  getTemplateEntry,
  plannedLineup,
  type PlannedSector,
} from "@/components/cards/templates/v2/registry";

export const runtime = "nodejs";
// Catalog data is static — no DB, no per-user variance — so we let Next cache.
export const dynamic = "force-dynamic"; // we still gate on auth, no static prerender

/**
 * Maps the registry's `plannedLineup.sector` strings to the catalog's
 * `CardTemplateDef.sectorHint` enum. The mobile picker uses `sectorHint` to
 * group filter chips, and the catalog's enum casing is the API contract —
 * registry sectors must be normalised before they leave this endpoint or
 * existing client filters will silently miss matches.
 *
 * Anything not listed flows through verbatim if it already matches the
 * catalog enum (most do).
 */
const SECTOR_REMAP: Partial<Record<PlannedSector, CardTemplateDef["sectorHint"]>> = {
  "real-estate": "realEstate",
  "event-planner": "eventPlanner",
};

function plannedSectorToHint(
  sector: PlannedSector | undefined,
): CardTemplateDef["sectorHint"] | null {
  if (!sector) return null;
  const remapped = SECTOR_REMAP[sector];
  if (remapped) return remapped;
  // The remaining PlannedSector values (`lawyer`, `restaurant`, `creator`, …)
  // are all valid CardTemplateDef sectorHint members verbatim. Cast through
  // the catalog enum so TypeScript narrows correctly at the call-site.
  return sector as CardTemplateDef["sectorHint"];
}

const plannedById: ReadonlyMap<number, (typeof plannedLineup)[number]> = new Map(
  plannedLineup.map((p) => [p.id, p] as const),
);

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    await requireBearerUser(req);

    // Catalog drives the active-flag filter, sort order, preview path, and
    // theme key. Registry overrides name + slug + sector when an id has a
    // v2 component wired up (the authoritative renderer).
    const items = getActiveTemplates().map((t) => {
      const registryEntry = getTemplateEntry(t.id);
      const planned = plannedById.get(t.id);

      const name = registryEntry?.name ?? t.name;
      // Registry's `key` is the canonical url-safe identifier; falls back to
      // the catalog `slug` for legacy SmartCard-only templates (e.g. id=100).
      const slug = registryEntry?.key ?? t.slug;
      // Prefer the registry-derived sector — when a registered template's
      // industry/role disagrees with the catalog, the registry is right.
      const sectorHint = registryEntry
        ? plannedSectorToHint(planned?.sector) ?? t.sectorHint ?? null
        : t.sectorHint ?? null;

      return {
        id: t.id,
        slug,
        name,
        sectorHint,
        previewPath: t.previewPath ?? null,
        themeKey: t.themeKey ?? null,
      };
    });

    return applyCors(
      NextResponse.json(
        { items },
        {
          status: 200,
          headers: {
            // Templates rarely change; clients can hold a stale list briefly.
            "Cache-Control": "public, max-age=300, s-maxage=600",
          },
        },
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
