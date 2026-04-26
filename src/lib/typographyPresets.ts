// Phase 7.9 — typography presets the customer can pick to override the chosen
// template's built-in fonts. Each preset declares a display + body family that
// gets injected as the global CSS variables --tpl-font-display / --tpl-font-body
// at the LivePreview wrapper. Templates that opt-in read these variables in
// their own font CSS.
//
// We deliberately ship CSS strings (not next/font references) so that the build
// never has to download anything from Google at compile time — fonts load at
// runtime via a stylesheet link rendered once on the digital card page.

import type { TypographyPreset } from "@/lib/validation";

export interface TypographyPresetDef {
  key: TypographyPreset;
  label: string;
  // Description for the picker tile.
  description: string;
  // CSS font-family stack injected as --tpl-font-display.
  displayFamily: string;
  // CSS font-family stack injected as --tpl-font-body.
  bodyFamily: string;
  // Sample text rendered inside the picker tile.
  sample: string;
  // Google Fonts query fragment to load these fonts at runtime. Omit for default.
  googleFontParam?: string;
}

export const TYPOGRAPHY_PRESET_LIST: TypographyPresetDef[] = [
  {
    key: "default",
    label: "Şablon varsayılanı",
    description: "Şablonun kendi tipografisini kullanır.",
    displayFamily: "",
    bodyFamily: "",
    sample: "Aa",
  },
  {
    key: "modern",
    label: "Modern",
    description: "Inter + Manrope — minimalist, kurumsal.",
    displayFamily: "'Manrope', system-ui, sans-serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    sample: "Aa",
    googleFontParam:
      "family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800",
  },
  {
    key: "classic",
    label: "Klasik",
    description: "Cormorant Garamond + Source Sans 3 — zarif, geleneksel.",
    displayFamily: "'Cormorant Garamond', Georgia, serif",
    bodyFamily: "'Source Sans 3', system-ui, sans-serif",
    sample: "Aa",
    googleFontParam:
      "family=Cormorant+Garamond:wght@500;600;700&family=Source+Sans+3:wght@400;500;600",
  },
  {
    key: "editorial",
    label: "Editöryel",
    description: "Playfair Display + Inter — dergi havası.",
    displayFamily: "'Playfair Display', Georgia, serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    sample: "Aa",
    googleFontParam:
      "family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400",
  },
  {
    key: "bold",
    label: "Cesur",
    description: "Bebas Neue + Inter — etkileyici, sportif.",
    displayFamily: "'Bebas Neue', Impact, sans-serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    sample: "Aa",
    googleFontParam:
      "family=Bebas+Neue&family=Inter:wght@400;500;600",
  },
];

export function getTypographyPreset(key: TypographyPreset | undefined): TypographyPresetDef {
  return (
    TYPOGRAPHY_PRESET_LIST.find((p) => p.key === key) ??
    TYPOGRAPHY_PRESET_LIST[0]
  );
}

/**
 * Build the runtime <link> href that loads every preset's Google Fonts in one
 * request. Used by the digital card page so fonts are available the moment the
 * customer flips presets.
 */
export function buildTypographyFontsHref(): string {
  const params = TYPOGRAPHY_PRESET_LIST.flatMap((p) =>
    p.googleFontParam ? p.googleFontParam.split("&") : []
  )
    .filter(Boolean)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
