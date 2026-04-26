// =============================================================================
// v2 Template tokens — per-template type-scale + spacing helpers.
//
// Each Phase 7 template defines its own type scale and section rhythm. We
// expose a tiny factory so templates can declare a coherent set of tokens at
// the file scope (display, heading, body, eyebrow, micro) plus a section
// padding rhythm — without each component re-deriving the maths inline.
//
// Outputs Tailwind class strings (not raw px) so existing utilities, line
// height, and tracking come along for free. Anything that would break out of
// the system (drop caps, custom letter-spacing, etc.) goes inline in the
// template.
// =============================================================================

export interface TemplateTypeScale {
  /** Hero / display headline (the owner's name in most templates). */
  display: string;
  /** Section / sub-display headline ("Featured listings", "Bio"). */
  heading: string;
  /** Sub-heading inside cards / list items. */
  subheading: string;
  /** Default body copy. */
  body: string;
  /** Captions, labels under headlines. */
  caption: string;
  /** Eyebrow / mono-label above sections. */
  eyebrow: string;
  /** Smallest legal / legend text. */
  micro: string;
}

export interface TemplateSpacing {
  /** Outer padding on the article shell. */
  shellX: string;
  /** Vertical padding between major sections. */
  sectionY: string;
  /** Inner padding for cards / tiles inside a section. */
  tileP: string;
  /** Gap between siblings inside a list/grid. */
  stackGap: string;
}

export interface TemplateTokens {
  type: TemplateTypeScale;
  space: TemplateSpacing;
}

/**
 * Tiny factory so templates can deviate from the base scale by overriding
 * only the keys that matter — keeps each template's typography readable.
 *
 * @example
 *   const tokens = createTemplateTokens({
 *     type: { display: "text-[2.1rem] leading-[1.05] tracking-tight font-extrabold" },
 *     space: { sectionY: "py-7" },
 *   });
 */
export function createTemplateTokens(
  overrides: {
    type?: Partial<TemplateTypeScale>;
    space?: Partial<TemplateSpacing>;
  } = {},
): TemplateTokens {
  return {
    type: { ...DEFAULT_TYPE, ...(overrides.type ?? {}) },
    space: { ...DEFAULT_SPACE, ...(overrides.space ?? {}) },
  };
}

const DEFAULT_TYPE: TemplateTypeScale = {
  display: "text-[1.875rem] leading-[1.1] tracking-tight font-bold",
  heading: "text-[1.0625rem] leading-tight tracking-tight font-bold",
  subheading: "text-sm leading-snug font-semibold",
  body: "text-sm leading-relaxed",
  caption: "text-xs leading-snug",
  eyebrow: "text-[10px] uppercase tracking-[0.18em] font-semibold",
  micro: "text-[10.5px] leading-snug",
};

const DEFAULT_SPACE: TemplateSpacing = {
  shellX: "px-6",
  sectionY: "py-6",
  tileP: "p-4",
  stackGap: "gap-3",
};

/**
 * Compose a class string from a tokens object — convenience helper for
 * templates that want `tokens.heading()` instead of `tokens.type.heading`.
 * Kept as a free helper so the type interfaces stay POJO-shaped.
 */
export function classes(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
