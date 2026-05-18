"use client";

/**
 * Client-side companion to `@/lib/preview`. Kept in a separate module so
 * the server-only helper stays importable from server components without
 * dragging the `"use client"` boundary across the rest of the file.
 */

import { useSearchParams } from "next/navigation";
import { PREVIEW_V2_QUERY, PREVIEW_V2_VALUE } from "./preview";

export function useIsPreviewV2(): boolean {
  const params = useSearchParams();
  if (!params) return false;
  return params.get(PREVIEW_V2_QUERY) === PREVIEW_V2_VALUE;
}
