// -----------------------------------------------------------------------
// Verso v2 design tokens — React Native port.
// Source of truth: Project_Verso_Mobil/tokens.css (OKLch light-premium).
// OKLch → sRGB hex conversion done at build time; values cached here so
// React Native doesn't need a color-space runtime.
// Theme-aware tokens (bg, ink, line) vary by light/dark mode.
// Theme-independent (accent, signal, neutral) are static.
// -----------------------------------------------------------------------

// =======================================================================
// VERSO v2 — ACCENT (primary, theme-independent)
// Source: oklch(55% 0.18 252) → #4B5DEC (cool blue-purple).
// Use as primary CTA, links, focus rings, active tab indicator.
// =======================================================================
export const accentScale = {
  50:      '#EEF0FE',   // oklch(96% 0.025 252)
  100:     '#E0E4FD',   // oklch(94% 0.04 252) — soft accent bg
  200:     '#C2C9FC',
  300:     '#9AA4F7',
  400:     '#7480F2',
  DEFAULT: '#4B5DEC',   // oklch(55% 0.18 252)
  500:     '#4B5DEC',
  600:     '#3947D6',
  700:     '#2D38B1',
  800:     '#222B89',
  900:     '#191F62',
} as const;

// Secondary accent — violet (oklch hue=290). Used for tonal contrast.
export const accent2Scale = {
  50:      '#F4ECFB',
  100:     '#EAD9F8',
  200:     '#D4B4F1',
  300:     '#BD8FEA',
  400:     '#A571E0',
  DEFAULT: '#8957DB',   // oklch(60% 0.18 290)
  500:     '#8957DB',
  600:     '#6F3FBE',
  700:     '#54309A',
  800:     '#3D2475',
  900:     '#291850',
} as const;

// =======================================================================
// COPPER (legacy — kept ONLY for the "by OpSolid" credit badge lockup).
// Do NOT use for new buttons, links, or accents in mobile. New work
// should reach for `accent` or the semantic alias below.
// =======================================================================
export const copper = {
  50:      '#FBEFE0',
  100:     '#F5D9B8',
  200:     '#EBBE8A',
  300:     '#DDA266',
  400:     '#CF8A4E',
  DEFAULT: '#C27940',
  500:     '#C27940',
  600:     '#A46230',
  700:     '#7E4A24',
  800:     '#56321A',
  900:     '#331D10',
} as const;

// =======================================================================
// TEAL (deprecated — Verso v1 Aegean turquoise).
// Kept as named export so a stray import doesn't crash during M1–M7
// migration. New code MUST use `accent`. Remove in M7 after grep audit.
// =======================================================================
export const teal = {
  50:      '#E0F7F8',
  100:     '#B0EAEE',
  200:     '#7FDDE4',
  300:     '#4DCFD9',
  400:     '#2DC1CC',
  DEFAULT: '#1AA6B7',
  500:     '#1AA6B7',
  600:     '#157E91',
  700:     '#0F4F58',
  800:     '#0A3940',
  900:     '#062229',
} as const;

// =======================================================================
// SEMANTIC ALIASES — components import these, not raw scales.
// Brand rotations only touch this file.
// =======================================================================
export const accent = accentScale.DEFAULT;       // primary brand accent
export const accentSoft = accentScale[50];       // accent-soft tint (chip bg)
export const accentDark = accentScale[700];      // hover / depth
export const accent2 = accent2Scale.DEFAULT;     // secondary tonal accent
export const accent2Soft = accent2Scale[50];     // accent2-soft tint
export const accentCredit = copper.DEFAULT;      // ONLY for "by OpSolid" badge

// =======================================================================
// SIGNAL COLORS — light theme + dark theme luminance-aware variants.
// Source: oklch(58% 0.14 152) success, oklch(72% 0.15 75) warning,
// oklch(58% 0.20 25) error, plus their *-soft surface tints.
// =======================================================================
export const signal = {
  ok:        '#3AAA63',   // oklch(58% 0.14 152)
  okSoft:    '#DDF1E5',   // oklch(95% 0.04 152)
  warn:      '#D7A33A',   // oklch(72% 0.15 75)
  warnSoft:  '#F8EAD0',   // oklch(96% 0.05 75)
  err:       '#DA4040',   // oklch(58% 0.20 25)
  errSoft:   '#FBE7E2',   // oklch(96% 0.04 25)
} as const;

export const signalDark = {
  ok:        '#4FBE76',
  okSoft:    '#143824',
  warn:      '#E3B14F',
  warnSoft:  '#3A2B0E',
  err:       '#E26060',
  errSoft:   '#3D1614',
} as const;

// =======================================================================
// NEUTRAL — graphite, theme-independent. Used for `bg-neutral-900` style
// "dark pill on light page" intents that must stay constant across modes.
// =======================================================================
export const neutral = {
  50:  '#F4F3F0',
  100: '#D8D6D1',
  200: '#9FA2A9',
  300: '#6B717B',
  400: '#454B56',
  500: '#2A3140',
  600: '#1F2530',
  700: '#171C26',
  800: '#11151C',
  900: '#0B0E13',
  950: '#07090C',
} as const;

// =======================================================================
// SHADOWS — Verso v2 cinematic depth (light-theme tuned).
// Combine close + far rgba(15,23,42, *) shadows. For RN, expose as
// platform-friendly shadow descriptors that components can spread.
// =======================================================================
export const shadow = {
  sm: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1, // Android
  },
  md: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOpacity: 0.08,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  xl: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOpacity: 0.12,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 24 },
    elevation: 16,
  },
} as const;

// =======================================================================
// RADII — Verso v2 (6/10/14/18/22/28).
// =======================================================================
export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  pill: 9999,
} as const;

// =======================================================================
// SPACING — 4pt grid, mapped to Verso v2 mobile.css gutters.
// =======================================================================
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 22,
  9: 24,
  10: 28,
  12: 32,
  16: 44,
  20: 56,
} as const;

// =======================================================================
// THEME-AWARE TOKENS
// =======================================================================

type InkScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
};

type BgScale = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
};

type LineScale = {
  soft: string;
  DEFAULT: string;
  firm: string;
  hot: string;
};

export type ThemeTokens = {
  bg: BgScale;
  ink: InkScale;
  line: LineScale;
  /** Page background — shorthand for bg[1] */
  pageBg: string;
  /** Surface (raised) — shorthand for bg[3] */
  surface: string;
  /** Surface-2 (subtle raised) — shorthand for bg[2] */
  surfaceMuted: string;
  /** Primary text — shorthand for ink[100] */
  text: string;
  /** Secondary text — shorthand for ink[200] */
  textSecondary: string;
  /** Muted text — shorthand for ink[300] */
  textMuted: string;
  /** Disabled/scaffold text — shorthand for ink[400] */
  textFaint: string;
  /** Luminance-aware error signal color. */
  signalErr: string;
  /** Luminance-aware success signal color. */
  signalOk: string;
  /** Luminance-aware warning signal color. */
  signalWarn: string;
  /** Soft accent surface tint (chip bg, focus halo). */
  accentSoft: string;
  /** Mode marker — useful when components need to branch (e.g. shadow). */
  mode: 'light' | 'dark';
};

// =======================================================================
// LIGHT — Verso v2 light premium (default)
// Source: Project_Verso_Mobil/tokens.css OKLch values.
// bg[1] = oklch(98.5% 0.005 250) ≈ #FCFCFE
// =======================================================================
const lightTheme: ThemeTokens = {
  bg: {
    0: '#F4F5F8',  // deepest — page background behind panels (soft cool)
    1: '#FCFCFE',  // default page background — oklch(98.5% 0.005 250)
    2: '#F8F9FB',  // bg-soft — oklch(97% 0.008 250)
    3: '#FFFFFF',  // surface — raised card
    4: '#FAFBFC',  // surface-2 — subtle raised
    5: '#F2F3F7',  // hover raise / disabled fill
  },
  ink: {
    100: '#1F2433',  // text-1 — oklch(22% 0.03 252)
    200: '#5A6379',  // text-2 — oklch(45% 0.02 252)
    300: '#828AA0',  // text-3 — oklch(60% 0.015 252)
    400: '#A8AEC1',  // text-4 — oklch(72% 0.01 252)
    500: '#C6CAD7',  // border-strong / disabled — oklch(80% 0.012 252)
  },
  line: {
    soft:    '#F2F3F7',  // hairline (very faint)
    DEFAULT: '#ECEEF3',  // border-1 — oklch(93% 0.006 252)
    firm:    '#DEE1EA',  // border-2 — oklch(88% 0.008 252)
    hot:     '#C2C9FC',  // accent-tinted (focus halo @ 30%)
  },
  pageBg:        '#FCFCFE',
  surface:       '#FFFFFF',
  surfaceMuted:  '#F8F9FB',
  text:          '#1F2433',
  textSecondary: '#5A6379',
  textMuted:     '#828AA0',
  textFaint:     '#A8AEC1',
  signalErr:     signal.err,
  signalOk:      signal.ok,
  signalWarn:    signal.warn,
  accentSoft:    accentSoft,
  mode:          'light',
};

// =======================================================================
// DARK — Verso v2 dark premium (rare-use; light is canonical for v2).
// Carries new design language into a deeper canvas without re-inventing
// the palette. Accent stays the same; backgrounds use cool ink.
// =======================================================================
const darkTheme: ThemeTokens = {
  bg: {
    0: '#0A0D14',
    1: '#0F121C',  // default
    2: '#151926',
    3: '#1B2030',  // raised card
    4: '#22283A',
    5: '#2C334A',
  },
  ink: {
    100: '#F3F4F8',
    200: '#C7CBD8',
    300: '#9298AC',
    400: '#6F7689',
    500: '#4A5165',
  },
  line: {
    soft:    'rgba(255,255,255,0.04)',
    DEFAULT: 'rgba(255,255,255,0.08)',
    firm:    'rgba(255,255,255,0.14)',
    hot:     'rgba(75,93,236,0.40)',
  },
  pageBg:        '#0F121C',
  surface:       '#1B2030',
  surfaceMuted:  '#151926',
  text:          '#F3F4F8',
  textSecondary: '#C7CBD8',
  textMuted:     '#9298AC',
  textFaint:     '#6F7689',
  signalErr:     signalDark.err,
  signalOk:      signalDark.ok,
  signalWarn:    signalDark.warn,
  accentSoft:    '#1F2548',
  mode:          'dark',
};

/**
 * Returns the theme token set for the given color scheme.
 */
export function getTheme(mode: 'light' | 'dark'): ThemeTokens {
  return mode === 'light' ? lightTheme : darkTheme;
}

export { lightTheme, darkTheme };

// =======================================================================
// LEGACY ALIASES — keep until M7 grep removes call sites.
// `surface.light` / `surface.dark` are still referenced in a few spots.
// =======================================================================
export const surface = {
  light: lightTheme.surface,
  dark:  darkTheme.surface,
} as const;

/** @deprecated — kept for reference completeness; not used on mobile. */
export const hybridTheme = lightTheme;
