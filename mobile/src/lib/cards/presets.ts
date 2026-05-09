// -----------------------------------------------------------------------
// presets — five curated "starter packs" surfaced to design-clueless users
// during onboarding. Each preset bundles a template id, theme, and brand
// color pair that are known-good together; we intentionally keep the
// pickable count small (5) so the choice doesn't paralyse the user.
//
// The preset is a *seed* — once applied, the user can edit any field on
// the cards/edit screen. We track the source preset only loosely (no
// dedicated DB column); the values are flattened onto cardData and the
// CardOrder brand-color columns just like a manual edit.
//
// Sector mapping: the onboarding wizard knows the user's industry via a
// dropdown. We map the ~20 most-common slugs to one of the five preset
// keys; unmapped sectors fall back to `null` and the user picks manually.
// -----------------------------------------------------------------------

export type PresetKey = 'banking' | 'creative' | 'wellness' | 'tech' | 'boutique';

export type PresetPack = {
  key: PresetKey;
  /** i18n key in `t.presets.{key}.label` */
  labelKey: string;
  /** i18n key in `t.presets.{key}.subtitle` */
  subtitleKey: string;
  /** Backend template id — must exist in the seeded templates table. */
  templateId: number;
  themeKey: 'light' | 'dark';
  brandPrimaryHex: string;
  brandAccentHex: string;
  /** Sector slugs that should auto-suggest this preset. */
  recommendedSectors: string[];
};

export const PRESET_PACKS: PresetPack[] = [
  {
    key: 'banking',
    labelKey: 'presets.banking.label',
    subtitleKey: 'presets.banking.subtitle',
    templateId: 14,
    themeKey: 'dark',
    brandPrimaryHex: '#0B1A1F',
    brandAccentHex: '#1AA6B7',
    recommendedSectors: ['finance', 'banking', 'legal', 'consulting', 'accounting'],
  },
  {
    key: 'creative',
    labelKey: 'presets.creative.label',
    subtitleKey: 'presets.creative.subtitle',
    templateId: 6,
    themeKey: 'light',
    brandPrimaryHex: '#C27940',
    brandAccentHex: '#F4F1EC',
    recommendedSectors: ['design', 'photography', 'art', 'music', 'film'],
  },
  {
    key: 'wellness',
    labelKey: 'presets.wellness.label',
    subtitleKey: 'presets.wellness.subtitle',
    templateId: 84,
    themeKey: 'light',
    brandPrimaryHex: '#7FB286',
    brandAccentHex: '#1AA6B7',
    recommendedSectors: ['health', 'medical', 'fitness', 'beauty', 'therapy'],
  },
  {
    key: 'tech',
    labelKey: 'presets.tech.label',
    subtitleKey: 'presets.tech.subtitle',
    templateId: 1,
    themeKey: 'dark',
    brandPrimaryHex: '#1AA6B7',
    brandAccentHex: '#0B1A1F',
    recommendedSectors: ['tech', 'software', 'startup', 'engineering', 'data'],
  },
  {
    key: 'boutique',
    labelKey: 'presets.boutique.label',
    subtitleKey: 'presets.boutique.subtitle',
    templateId: 6,
    themeKey: 'light',
    brandPrimaryHex: '#D4A23A',
    brandAccentHex: '#F4EFE6',
    recommendedSectors: ['retail', 'hospitality', 'fashion', 'real_estate', 'food'],
  },
];

/**
 * Reverse map `sectorSlug → presetKey`. Built once at module load. Slugs
 * not in the map fall through to `suggestPresetForSector(...)` returning
 * null — caller should let the user pick manually in that case.
 */
export const SECTOR_TO_PRESET: Record<string, PresetKey> = (() => {
  const map: Record<string, PresetKey> = {};
  for (const p of PRESET_PACKS) {
    for (const s of p.recommendedSectors) map[s] = p.key;
  }
  return map;
})();

export function getPresetByKey(key: PresetKey): PresetPack {
  // The cast is safe: every PresetKey is present in PRESET_PACKS by
  // construction (TS exhaustiveness on PresetKey would catch a regression).
  return PRESET_PACKS.find((p) => p.key === key) as PresetPack;
}

export function suggestPresetForSector(sectorSlug: string): PresetPack | null {
  const k = SECTOR_TO_PRESET[sectorSlug];
  return k ? getPresetByKey(k) : null;
}
