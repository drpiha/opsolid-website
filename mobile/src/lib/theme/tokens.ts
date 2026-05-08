// -----------------------------------------------------------------------
// OpSolid design tokens — React Native port.
// Source of truth: web's src/styles/opsolid-tokens.css + tailwind.config.ts
// Theme-independent tokens (copper, neutral, signal) are static.
// Theme-aware tokens (bg, ink, line) vary by light/dark mode.
// -----------------------------------------------------------------------

// ---------- COPPER (legacy primary accent — kept only for "by OpSolid" credit) ----------
// Verso (the mobile sub-brand) uses TEAL as its primary accent. Copper survives
// solely for the OpSolid-credit lockup. Do not introduce new copper-on-button
// usage in mobile code; reach for `teal` or the `accent` semantic alias instead.
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

// ---------- TEAL (Verso primary — theme-independent) ----------
// Aegean palette, defined in project_verso_brand.md. Use as primary CTA,
// links, focus rings, and brand surfaces. Pair with surface-light or
// surface-dark; never put copper on the same component above 8px.
export const teal = {
  50:      '#E0F7F8',
  100:     '#B0EAEE',
  200:     '#7FDDE4',
  300:     '#4DCFD9',
  400:     '#2DC1CC',
  DEFAULT: '#1AA6B7',
  500:     '#1AA6B7',
  600:     '#157E91',
  700:     '#0F4F58',  // primary-dark — depth, hover, dark-mode surfaces
  800:     '#0A3940',
  900:     '#062229',
} as const;

// ---------- VERSO SEMANTIC ALIASES ----------
// Use these instead of reaching for raw `teal[500]` so the brand can rotate
// without touching every component. Components that show the OpSolid credit
// badge use `accentCredit`.
export const accent = teal.DEFAULT;          // primary brand accent
export const accentDark = teal[700];         // hover / depth
export const accentCredit = copper.DEFAULT;  // ONLY for "by OpSolid" badge

// ---------- VERSO SURFACES (Aegean palette) ----------
// surfaceLight: warm paper, slightly cooler than the OpSolid hybrid paper.
// surfaceDark:  ink-blue-black; cool bias is intentional, premium dark apps
//               (Linear, Things 3) bias dark surfaces slightly cool.
export const surface = {
  light: '#F4F1EC',
  dark:  '#0B1A1F',
} as const;

// ---------- NEUTRAL / graphite scale (theme-independent) ----------
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

// ---------- SEMANTIC SIGNALS (sparing use only) ----------
export const signal = {
  ok:   '#7FB286',  // muted sage
  warn: '#D4A23A',  // aged gold
  err:  '#B8514B',  // oxblood
} as const;

// ---------- THEME TOKENS ----------

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
  /** Primary text — shorthand for ink[100] */
  text: string;
  /** Secondary text — shorthand for ink[200] */
  textSecondary: string;
  /** Muted text — shorthand for ink[300] */
  textMuted: string;
};

// ---------- HYBRID (warm cocoa paper — web default) ----------
// Not used on mobile; included for reference completeness.
const hybridTheme: ThemeTokens = {
  bg: {
    0: '#E8DECC',
    1: '#F4EFE6',
    2: '#FAF6EF',
    3: '#FFFFFF',
    4: '#FBF7F0',
    5: '#F4EFE6',
  },
  ink: {
    100: '#15120F',
    200: '#3A3530',
    300: '#6B6660',
    400: '#9A9591',
    500: '#BFB9B0',
  },
  line: {
    soft:    'rgba(21,18,15,0.04)',
    DEFAULT: 'rgba(21,18,15,0.08)',
    firm:    'rgba(21,18,15,0.14)',
    hot:     'rgba(194,121,64,0.40)',
  },
  pageBg:        '#F4EFE6',
  text:          '#15120F',
  textSecondary: '#3A3530',
  textMuted:     '#6B6660',
};

// ---------- LIGHT — clean, cool refined paper ----------
const lightTheme: ThemeTokens = {
  bg: {
    0: '#DCD7CC',
    1: '#FAFAF7',
    2: '#F4F3EE',
    3: '#FFFFFF',
    4: '#F8F7F2',
    5: '#ECEAE3',
  },
  ink: {
    100: '#15120F',
    200: '#3A3530',
    300: '#6B6660',
    400: '#9A9591',
    500: '#BFB9B0',
  },
  line: {
    soft:    'rgba(21,18,15,0.04)',
    DEFAULT: 'rgba(21,18,15,0.08)',
    firm:    'rgba(21,18,15,0.14)',
    hot:     'rgba(194,121,64,0.40)',
  },
  pageBg:        '#FAFAF7',
  text:          '#15120F',
  textSecondary: '#3A3530',
  textMuted:     '#6B6660',
};

// ---------- DARK — graphite ----------
const darkTheme: ThemeTokens = {
  bg: {
    0: '#07090C',
    1: '#0B0E13',
    2: '#11151C',
    3: '#171C26',
    4: '#1F2530',
    5: '#2A3140',
  },
  ink: {
    100: '#F4F3F0',
    200: '#D8D6D1',
    300: '#9FA2A9',
    400: '#6B717B',
    500: '#454B56',
  },
  line: {
    soft:    'rgba(255,255,255,0.04)',
    DEFAULT: 'rgba(255,255,255,0.08)',
    firm:    'rgba(255,255,255,0.14)',
    hot:     'rgba(212,143,88,0.35)',
  },
  pageBg:        '#0B0E13',
  text:          '#F4F3F0',
  textSecondary: '#D8D6D1',
  textMuted:     '#9FA2A9',
};

/**
 * Returns the theme token set for the given color scheme.
 * On mobile, 'light' maps to the light theme and 'dark' to the dark theme.
 * The hybrid theme (web default) is available as an export but not used
 * in mobile routing.
 */
export function getTheme(mode: 'light' | 'dark'): ThemeTokens {
  return mode === 'light' ? lightTheme : darkTheme;
}

// Named exports for direct import (e.g. for static screens)
export { lightTheme, darkTheme, hybridTheme };
