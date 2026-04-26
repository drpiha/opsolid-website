// =============================================================================
// Card theme presets — Aurora · Editorial · Cinema.
//
// Single source of truth for the SmartCard "Style preset" selector. Each preset
// pairs a brand color combo with a `themeKey` that the SmartCard root attaches
// as `data-theme="<key>"`. The actual CSS rules live in
// `src/components/cards/smart/themes.css` and use those attribute selectors to
// override CSS custom properties + a few descendant treatments (cover gradient,
// hairline weight, accent radius, etc.). Layout DOM is not changed.
//
// `layoutKey` is recorded forward-compat for a future layout registry; it does
// not influence rendering in Phase 6.
// =============================================================================

export type CardThemeKey = "aurora" | "editorial" | "cinema";

export interface CardThemePreset {
  key: CardThemeKey;
  /** Short label used in the order form selector (untranslated; the gallery
   *  may localize via the content map if it chooses to). */
  label: string;
  /** Default `--card-primary` for this preset. Owner can override. */
  primaryHex: string;
  /** Default `--card-accent` for this preset. Owner can override. */
  accentHex: string;
  /** Forward-compat layout slug. Not used by the renderer in Phase 6. */
  layoutKey: string;
  /** Short marketing tagline shown beneath the preset option. */
  description: string;
}

export const CARD_THEMES: Record<CardThemeKey, CardThemePreset> = {
  aurora: {
    key: "aurora",
    label: "Aurora",
    primaryHex: "#7C5CFF",
    accentHex: "#1A1B26",
    layoutKey: "stack",
    description: "Deep violet with luminous accent gradient.",
  },
  editorial: {
    key: "editorial",
    label: "Editorial",
    primaryHex: "#15120F",
    accentHex: "#E8A252",
    layoutKey: "editorial",
    description: "Warm graphite + amber. Serif headline.",
  },
  cinema: {
    key: "cinema",
    label: "Cinema",
    primaryHex: "#0E0E0E",
    accentHex: "#C0A672",
    layoutKey: "cinema",
    description: "Near-black, gold accents, theatrical cover.",
  },
};

export const CARD_THEME_LIST: CardThemePreset[] = Object.values(CARD_THEMES);

export function getCardTheme(key: string | null | undefined): CardThemePreset | undefined {
  if (!key) return undefined;
  return CARD_THEMES[key as CardThemeKey];
}
