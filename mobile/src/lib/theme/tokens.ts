// -----------------------------------------------------------------------
// OpSolid design tokens — React Native port.
// Source of truth: web's src/styles/opsolid-tokens.css + tailwind.config.ts
// Theme-independent tokens (copper, neutral, signal) are static.
// Theme-aware tokens (bg, ink, line) vary by light/dark mode.
// -----------------------------------------------------------------------

// ---------- COPPER (primary accent — theme-independent) ----------
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
