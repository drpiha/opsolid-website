// App-surface families (cards, dashboard, legacy v2/v4 chrome): IBM Plex Mono, Plus Jakarta Sans, Fira Code,
// Instrument Serif and JetBrains Mono, self-hosted so the build never contacts Google Fonts.
//
// The files are the subset files Google Fonts serves, unchanged (sources, versions and checksums in ./README.md),
// and every call below repeats one subset of Google's stylesheet: the same weight and style faces and the same
// unicode-range, so a subset is only downloaded when a page shows a character from it. One call per subset,
// because a call takes a single unicode-range; each gets its own CSS variable and globals.css joins the subsets
// of a family into the variable the styles use (--font-plex-mono, --font-v2-body, --font-v2-mono,
// --font-instrument-serif, --font-jetbrains-mono), followed by that family's metric-adjusted fallback face.
// Not preloaded: none of these is the first paint of a marketing page.
//
// Plus Jakarta Sans, Fira Code and JetBrains Mono are variable files; Google declares one face per requested
// weight on the same file, which is kept so that weight matching stays exactly as it was.
import localFont from "next/font/local";

// IBM Plex Mono (Google Fonts v20): static files, 400, 500.
const plexMonoLatin = localFont({
  src: [
    { path: "./ibm-plex-mono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500-latin.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-plex-mono-latin",
});
const plexMonoLatinExt = localFont({
  src: [
    { path: "./ibm-plex-mono-400-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500-latin-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-plex-mono-latin-ext",
});
const plexMonoVietnamese = localFont({
  src: [
    { path: "./ibm-plex-mono-400-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500-vietnamese.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-plex-mono-vietnamese",
});
const plexMonoCyrillic = localFont({
  src: [
    { path: "./ibm-plex-mono-400-cyrillic.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500-cyrillic.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-plex-mono-cyrillic",
});
const plexMonoCyrillicExt = localFont({
  src: [
    { path: "./ibm-plex-mono-400-cyrillic-ext.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-500-cyrillic-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-plex-mono-cyrillic-ext",
});

// Plus Jakarta Sans (Google Fonts v12): variable file per subset, faces 400, 500, 600, 700, 800.
const jakartaLatin = localFont({
  src: [
    { path: "./plus-jakarta-sans-latin.woff2", weight: "400", style: "normal" },
    { path: "./plus-jakarta-sans-latin.woff2", weight: "500", style: "normal" },
    { path: "./plus-jakarta-sans-latin.woff2", weight: "600", style: "normal" },
    { path: "./plus-jakarta-sans-latin.woff2", weight: "700", style: "normal" },
    { path: "./plus-jakarta-sans-latin.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-body-latin",
});
const jakartaLatinExt = localFont({
  src: [
    { path: "./plus-jakarta-sans-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./plus-jakarta-sans-latin-ext.woff2", weight: "500", style: "normal" },
    { path: "./plus-jakarta-sans-latin-ext.woff2", weight: "600", style: "normal" },
    { path: "./plus-jakarta-sans-latin-ext.woff2", weight: "700", style: "normal" },
    { path: "./plus-jakarta-sans-latin-ext.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-body-latin-ext",
});
const jakartaVietnamese = localFont({
  src: [
    { path: "./plus-jakarta-sans-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "./plus-jakarta-sans-vietnamese.woff2", weight: "500", style: "normal" },
    { path: "./plus-jakarta-sans-vietnamese.woff2", weight: "600", style: "normal" },
    { path: "./plus-jakarta-sans-vietnamese.woff2", weight: "700", style: "normal" },
    { path: "./plus-jakarta-sans-vietnamese.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-body-vietnamese",
});
const jakartaCyrillicExt = localFont({
  src: [
    { path: "./plus-jakarta-sans-cyrillic-ext.woff2", weight: "400", style: "normal" },
    { path: "./plus-jakarta-sans-cyrillic-ext.woff2", weight: "500", style: "normal" },
    { path: "./plus-jakarta-sans-cyrillic-ext.woff2", weight: "600", style: "normal" },
    { path: "./plus-jakarta-sans-cyrillic-ext.woff2", weight: "700", style: "normal" },
    { path: "./plus-jakarta-sans-cyrillic-ext.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-body-cyrillic-ext",
});

// Fira Code (Google Fonts v27): variable file per subset, faces 400, 500.
const firaCodeLatin = localFont({
  src: [
    { path: "./fira-code-latin.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-latin.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-latin",
});
const firaCodeLatinExt = localFont({
  src: [
    { path: "./fira-code-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-latin-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-latin-ext",
});
const firaCodeSymbols2 = localFont({
  src: [
    { path: "./fira-code-symbols2.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-symbols2.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+2000-2001, U+2004-2008, U+200A, U+23B8-23BD, U+2500-259F" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-symbols2",
});
const firaCodeGreek = localFont({
  src: [
    { path: "./fira-code-greek.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-greek.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-greek",
});
const firaCodeGreekExt = localFont({
  src: [
    { path: "./fira-code-greek-ext.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-greek-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+1F00-1FFF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-greek-ext",
});
const firaCodeCyrillic = localFont({
  src: [
    { path: "./fira-code-cyrillic.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-cyrillic.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-cyrillic",
});
const firaCodeCyrillicExt = localFont({
  src: [
    { path: "./fira-code-cyrillic-ext.woff2", weight: "400", style: "normal" },
    { path: "./fira-code-cyrillic-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-v2-mono-cyrillic-ext",
});

// Instrument Serif (Google Fonts v5): static files, 400, normal and italic.
const instrumentSerifLatin = localFont({
  src: [
    { path: "./instrument-serif-400-italic-latin.woff2", weight: "400", style: "italic" },
    { path: "./instrument-serif-400-latin.woff2", weight: "400", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-instrument-serif-latin",
});
const instrumentSerifLatinExt = localFont({
  src: [
    { path: "./instrument-serif-400-italic-latin-ext.woff2", weight: "400", style: "italic" },
    { path: "./instrument-serif-400-latin-ext.woff2", weight: "400", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-instrument-serif-latin-ext",
});

// JetBrains Mono (Google Fonts v24): variable file per subset, faces 400, 500, 600.
const jetBrainsMonoLatin = localFont({
  src: [
    { path: "./jetbrains-mono-latin.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-latin.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-latin.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-latin",
});
const jetBrainsMonoLatinExt = localFont({
  src: [
    { path: "./jetbrains-mono-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-latin-ext.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-latin-ext.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-latin-ext",
});
const jetBrainsMonoVietnamese = localFont({
  src: [
    { path: "./jetbrains-mono-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-vietnamese.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-vietnamese.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-vietnamese",
});
const jetBrainsMonoGreek = localFont({
  src: [
    { path: "./jetbrains-mono-greek.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-greek.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-greek.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-greek",
});
const jetBrainsMonoCyrillic = localFont({
  src: [
    { path: "./jetbrains-mono-cyrillic.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-cyrillic.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-cyrillic.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-cyrillic",
});
const jetBrainsMonoCyrillicExt = localFont({
  src: [
    { path: "./jetbrains-mono-cyrillic-ext.woff2", weight: "400", style: "normal" },
    { path: "./jetbrains-mono-cyrillic-ext.woff2", weight: "500", style: "normal" },
    { path: "./jetbrains-mono-cyrillic-ext.woff2", weight: "600", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-jetbrains-mono-cyrillic-ext",
});

/** Class names that define the per-subset variables; set on <html> next to the other font variables. */
export const subsetFontVariables = [
  plexMonoLatin.variable,
  plexMonoLatinExt.variable,
  plexMonoVietnamese.variable,
  plexMonoCyrillic.variable,
  plexMonoCyrillicExt.variable,
  jakartaLatin.variable,
  jakartaLatinExt.variable,
  jakartaVietnamese.variable,
  jakartaCyrillicExt.variable,
  firaCodeLatin.variable,
  firaCodeLatinExt.variable,
  firaCodeSymbols2.variable,
  firaCodeGreek.variable,
  firaCodeGreekExt.variable,
  firaCodeCyrillic.variable,
  firaCodeCyrillicExt.variable,
  instrumentSerifLatin.variable,
  instrumentSerifLatinExt.variable,
  jetBrainsMonoLatin.variable,
  jetBrainsMonoLatinExt.variable,
  jetBrainsMonoVietnamese.variable,
  jetBrainsMonoGreek.variable,
  jetBrainsMonoCyrillic.variable,
  jetBrainsMonoCyrillicExt.variable,
].join(" ");
