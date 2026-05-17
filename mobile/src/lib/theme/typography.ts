// -----------------------------------------------------------------------
// Verso v2 typography — React Native TextStyle library.
// Source: Project_Verso_Mobil/tokens.css + verso-app/mobile.css scales.
// Geist is loaded at the root via expo-font. On platforms where Geist
// is unavailable (boot fallback, web), `system` is used.
// React Native letterSpacing is absolute (px), so em values are
// pre-computed at the canonical font size for each style.
// -----------------------------------------------------------------------

import type { TextStyle } from 'react-native';

// =======================================================================
// FONT FAMILIES — exposed names match the keys passed to expo-font.
// All weights map to the same "Geist" family with a distinct weight value;
// React Native picks the correct face at render time when the font is
// registered via useFonts.
// =======================================================================
export const fontFamily = {
  // Sans (display + body). Weight applied via fontWeight on TextStyle.
  sans:        'Geist_400Regular',
  sansMedium:  'Geist_500Medium',
  sansSemi:    'Geist_600SemiBold',
  sansBold:    'Geist_700Bold',
  sansBlack:   'Geist_800ExtraBold',
  // Mono (meta, section labels, code).
  mono:        'GeistMono_400Regular',
  monoMedium:  'GeistMono_500Medium',
  monoSemi:    'GeistMono_600SemiBold',
} as const;

// =======================================================================
// TEXT STYLES — drop-in TextStyle objects. Components consume these via
// `style={typography.display1}` rather than reaching for raw values.
// fontFamily defaults to weight-mapped face; consumer can override.
// =======================================================================
export const typography = {
  // Large hero headline — used on AppBar lg, onboarding, empty states.
  // Source: .v-appbar-lg h1 — 30px / 700 / -0.03em / line 1.1.
  display1: {
    fontFamily: fontFamily.sansBold,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.9,   // -0.03em × 30
    lineHeight: 33,
  } satisfies TextStyle,

  // Section headline — page H1 (smaller surface).
  display2: {
    fontFamily: fontFamily.sansBold,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.6,   // -0.025em × 24
    lineHeight: 28,
  } satisfies TextStyle,

  // Card / panel title.
  title1: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
    lineHeight: 26,
  } satisfies TextStyle,

  // Default AppBar title.
  title2: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.34,
    lineHeight: 22,
  } satisfies TextStyle,

  // Row title / list item primary.
  title3: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.15,
    lineHeight: 20,
  } satisfies TextStyle,

  // Body (default reading size).
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 22,
  } satisfies TextStyle,

  bodyMedium: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.15,
    lineHeight: 22,
  } satisfies TextStyle,

  // Lead / secondary body — used under display headlines.
  lead: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.07,
    lineHeight: 20,
  } satisfies TextStyle,

  // Compact body — list item subtitle, helper text.
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.065,
    lineHeight: 18,
  } satisfies TextStyle,

  // Field label — above inputs.
  fieldLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.06,
    lineHeight: 16,
  } satisfies TextStyle,

  // Caption — meta info.
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.06,
    lineHeight: 16,
  } satisfies TextStyle,

  // Button label — used by Button primitives.
  button: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 18,
  } satisfies TextStyle,

  buttonSmall: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.13,
    lineHeight: 16,
  } satisfies TextStyle,

  // Chip label.
  chip: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.06,
    lineHeight: 14,
  } satisfies TextStyle,

  // Mono — code, technical labels.
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
  } satisfies TextStyle,

  // Section label — mono uppercase eyebrow above grouped content.
  // Source: .v-section-label — 11px mono uppercase tracking 0.06em.
  sectionLabel: {
    fontFamily: fontFamily.monoMedium,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.66,   // 0.06em × 11
    lineHeight: 14,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  // Tab bar label (BottomNav).
  tabLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,    // 0.02em × 10
    lineHeight: 12,
  } satisfies TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;

/**
 * Returns whether Geist has been loaded. When false, callers should fall
 * back to `system` family. The hook in app/_layout.tsx flips this when
 * useFonts() resolves.
 */
let geistLoaded = false;
export function markGeistLoaded(): void {
  geistLoaded = true;
}
export function isGeistLoaded(): boolean {
  return geistLoaded;
}
