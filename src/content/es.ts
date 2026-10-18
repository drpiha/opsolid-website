// =============================================================================
// SPANISH CONTENT — M6 minimal locale
// =============================================================================
// Spanish is not a public marketing locale; only the card surfaces (/c/*)
// use it. Translated keys go under `overrides`; EVERYTHING else falls back to
// the English content file via a structural merge at module load, so the user
// never sees a missing-key crash, just an English string for any key not yet
// localised.
//
// The proxy is built with an `as Content` cast so the whole English keyset
// stays valid at the type level. To add another translated
// key, add it under `overrides` below; it gets deep-merged with `en` at
// import time. If you need a full content rewrite, drop a wholesale
// `export const content: Content = { … } as const` block in here and remove
// the proxy.
// =============================================================================

import { content as en } from "./en";
import type { Content } from "./en";

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Deep-merge translation overrides on top of the English content tree.
// Arrays are replaced wholesale (not concat'd) — Spanish-language array
// items have to be the same length as English ones, since the rendering
// components index into them positionally.
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
