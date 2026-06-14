// =============================================================================
// resolveLabels — merge a template's localized COPY table with the owner's
// per-card label overrides (`cardData.labels`).
//
// SERVER-SAFE: no "use client" directive. Imported by both the public card
// page (Server Component at /c/[slug]) and the editor live preview (client),
// so it must stay in a plain module.
//
// Contract:
//   • Iterate the BASE table's keys, never the overrides' — unknown / injected
//     override keys are ignored, and each template keeps its own `XxxCopy`
//     interface as the return type.
//   • Only a non-empty (trimmed) override wins; a cleared field falls back to
//     the localized default. This is what makes "clear the input ⇒ restore the
//     template default" work in the editor.
//
// Why `T extends object` and not `T extends Record<string, string>`: every
// template declares its copy table as an `interface` (e.g. `interface BbCopy`),
// and interfaces have no implicit string index signature, so they are NOT
// assignable to `Record<string, string>`. Constraining to `object` keeps the
// helper callable from all 96 templates while still returning the precise
// `XxxCopy` type.
// =============================================================================

export function resolveLabels<T extends object>(
  base: T,
  overrides?: Record<string, string> | null,
): T {
  if (!overrides) return base;
  const out = { ...base } as T;
  for (const key of Object.keys(base)) {
    const override = overrides[key];
    if (typeof override === "string" && override.trim()) {
      (out as Record<string, string>)[key] = override.trim();
    }
  }
  return out;
}
