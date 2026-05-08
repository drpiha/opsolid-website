// =============================================================================
// /api/v1/templates — list of active card templates for client pickers.
//
// Read-only, bearer-authenticated. The catalog is static (compiled into the
// bundle from `src/config/card-templates.ts`) so we serve a long browser /
// edge cache header — clients can refresh on app restart at no cost.
//
// Auth: bearer-only (matches the rest of /api/v1/*).
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { getActiveTemplates } from "@/config/card-templates";

export const runtime = "nodejs";
// Catalog data is static — no DB, no per-user variance — so we let Next cache.
export const dynamic = "force-dynamic"; // we still gate on auth, no static prerender

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    await requireBearerUser(req);

    const items = getActiveTemplates().map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      sectorHint: t.sectorHint ?? null,
      previewPath: t.previewPath ?? null,
      themeKey: t.themeKey ?? null,
    }));

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
