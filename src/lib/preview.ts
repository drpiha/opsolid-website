/**
 * Redesign preview gate — M2+ page-family PRs ship behind `?preview=v2` so
 * live traffic stays on v1 until each page passes review. The gate is
 * removed in M9 once the v2 system is promoted to default.
 *
 * Server-side usage (page.tsx, generateMetadata):
 *   const isV2 = isPreviewV2(searchParams);
 *   return isV2 ? <PageV2 /> : <PageV1 />;
 *
 * Client-side usage: import { useIsPreviewV2 } from "@/lib/preview-client".
 * The client hook lives in its own module so this file stays
 * server-component-safe (no `"use client"` boundary).
 */

type ReadonlySearchParams = Record<string, string | string[] | undefined>;

export const PREVIEW_V2_QUERY = "preview";
export const PREVIEW_V2_VALUE = "v2";

/**
 * M9 promotion (2026-05-19): v2 is now the default. This helper always
 * returns true — every page.tsx that checks it renders the V2 component.
 * The legacy V1 code paths are kept in place for one milestone as an
 * emergency rollback (flip back to the gated logic below); M10 will
 * delete them and retire this helper.
 *
 * Original gated logic (kept below the early return for reference):
 *   if (!searchParams) return false;
 *   const raw = searchParams[PREVIEW_V2_QUERY];
 *   if (!raw) return false;
 *   if (Array.isArray(raw)) return raw.includes(PREVIEW_V2_VALUE);
 *   return raw === PREVIEW_V2_VALUE;
 */
export function isPreviewV2(_searchParams: ReadonlySearchParams | undefined): boolean {
  return true;
}
