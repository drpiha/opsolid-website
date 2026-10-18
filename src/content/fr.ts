// =============================================================================
// FRENCH CONTENT — M6 minimal locale
// =============================================================================
// See es.ts for the proxy/fallback rationale; this file follows the same
// pattern. Translated keys override English; everything else falls back to
// `en.ts`. Add high-traffic translations under `overrides`.
// =============================================================================

import { content as en } from "./en";
import type { Content } from "./en";

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

function merge<T>(base: T, override: DeepPartial<T>): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || Array.isArray(override)) {
    return (override ?? base) as T;
  }
  if (typeof base !== "object" || base === null) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...(base as object) };
  for (const k of Object.keys(override as object) as (keyof T)[]) {
    out[k as string] = merge(
      (base as Record<string, unknown>)[k as string],
      (override as Record<string, unknown>)[k as string],
    );
  }
  return out as T;
}

const overrides: DeepPartial<Content> = {
  // No overrides yet: every key falls back to English. Translate card-surface keys here first.
};

export const content: Content = merge(en, overrides);
