import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { subsetFontVariables } from "./fonts/subset-families";
import { isV4Path } from "@/lib/v4";
import { SITE_CONFIG } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE, directionForLocale } from "@/lib/i18n";
import "./globals.css";
// Loaded after globals.css (which pulls in the legacy v4 marketing CSS) so the v7 base wins at equal specificity.
import "../styles/opsolid-v7.css";
import "../styles/opsolid-v7-motion.css";

// v4: Archivo (display + body, variable width axis) and IBM Plex Mono (labels)
// serve the marketing site. The legacy families below still serve app
// surfaces (cards, dashboard) but are not preloaded.
// Archivo is self-hosted as one preloaded file, pre-instanced to the axis
// ranges the v4 CSS uses (wght 400–800, wdth 100–118 %) and subset to latin
// plus the Turkish letters (Ğ ğ İ Ş ş; ı is in latin) and the punctuation the
// copy uses, so de, en and tr all paint from the same ~57 kB file. Built from
// the google/fonts Archivo[wdth,wght].ttf with fontTools (varLib.instancer,
// then subset to woff2); licence in ./fonts/archivo-OFL.txt.
const archivo = localFont({
  src: "./fonts/archivo-v4.woff2",
  weight: "400 800",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "100% 118%" }],
  display: "swap",
  preload: false,
  variable: "--font-archivo",
});

// Every font is a file in this repository: the build makes no request to Google Fonts. IBM Plex Mono (v4 mono
// labels), Plus Jakarta Sans and Fira Code (v2 app stack), Instrument Serif and JetBrains Mono (app tokens and
// card templates) are declared per subset in ./fonts/subset-families.ts and joined into --font-plex-mono,
// --font-v2-body, --font-v2-mono, --font-instrument-serif and --font-jetbrains-mono in globals.css.

// v7 marketing body font, also used by app surfaces: Inter, variable (all weights in one file), self-hosted.
// inter-latin.woff2 is Google Fonts' own latin subset of Inter v20 (byte-identical to the file Google Fonts
// serves), preloaded as the LCP text face. The five Turkish letters outside latin (Ğ ğ İ Ş ş; ı is in latin)
// come from inter-tr.woff2, a ~4 KiB Google Fonts text= subset declared by unicode-range, so /tr no longer
// downloads the 85 KiB latin-ext file. globals.css joins both into --font-inter. Licence: ./fonts/inter-OFL.txt.
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter-latin",
});
const interTr = localFont({
  src: "./fonts/inter-tr.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+011E-011F, U+0130, U+015E-015F" }],
  variable: "--font-inter-tr",
});

// v7 display face: Fraunces as two pre-instanced static files (weight 300, normal + italic, SOFT 50, WONK 0,
// one display optical size of 72), subset to latin + latin-ext and the punctuation the copy uses, as WOFF.
// ~63 KiB for both styles together (the old variable Google files were ~146 KiB, ~290 KiB with latin-ext
// on /tr). Built from google/fonts ofl/fraunces with fontTools (varLib.instancer, then subset); licence in
// ./fonts/fraunces-OFL.txt. Only weight 300 exists: every use sets font-weight 300 (.f-display, font-light).
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-300.woff", weight: "300", style: "normal" },
    { path: "./fonts/fraunces-300-italic.woff", weight: "300", style: "italic" },
  ],
  display: "swap",
  variable: "--font-fraunces",
});

// v7 mono labels (eyebrows, figure captions): Geist Mono, static weight 400, latin + latin-ext (~13 KiB).
// Subset from the geist package's GeistMono-Variable.ttf, instanced at wght 400. Not preloaded: labels are
// never the LCP, so they should not compete with the display and body faces.
const geistMono = localFont({
  src: "./fonts/geist-mono-400.woff",
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  weight: "400",
});

// Geist ships as a file in the `geist` npm package. It only serves legacy card
// templates and app surfaces, so it is declared without preload.
const geist = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  preload: false,
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name}: ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  // No root robots default: indexable pages need no tag, and a default here was merged next to the
  // not-found page's "noindex" ("index, follow" plus "noindex" in one document).
  // Favicon set generated by scripts/generate-favicons.ts from the in-site
  // brand mark (favicon.ico packs its 16/32/48 PNGs). Re-run that script if the mark changes.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { rel: "mask-icon", url: "/icon.svg", color: "#C27940" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    // Marketing surface (v7): porcelain browser chrome in both UA schemes.
    { media: "(prefers-color-scheme: light)", color: "#F6F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#F6F2EC" },
  ],
};

// Applied inline in <head> before hydration so the first paint already has
// the correct palette — avoids flash-of-wrong-theme. Mirrors
// src/context/ThemeContext.tsx (DEFAULT_THEME = "light", key = "opsolid-theme").
const NO_FLASH_THEME_SCRIPT = `(function(){try{if(document.documentElement.hasAttribute('data-v4')){document.documentElement.setAttribute('data-theme','light');return;}var t=localStorage.getItem('opsolid-theme');if(t==='hybrid'){t='light';localStorage.setItem('opsolid-theme','light');}if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = headers();
  const localeHeader = headerStore.get("x-locale");
  const lang = isLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;
  const dir = directionForLocale(lang);

  const requestPath = headerStore.get("x-pathname");
  const v4 = isV4Path(requestPath);

  const fontClasses = [
    archivo.variable,
    inter.variable,
    interTr.variable,
    fraunces.variable,
    geistMono.variable,
    geist.variable,
    subsetFontVariables,
  ]
    .filter(Boolean)
    .join(" ");

  // M9 promotion (2026-05-19): v2 is now the default. The legacy gated
  // logic is kept commented for emergency rollback — flip back by
  // restoring the requestPath check and removing the constant.
  //   const requestPath = headerStore.get("x-pathname") ?? "";
  //   const previewV2 =
  //     requestPath.includes("preview=v2") ||
  //     requestPath.includes("preview%3Dv2");
  const previewV2 = true;

  return (
    <html
      lang={lang}
      dir={dir}
      className={fontClasses}
      data-preview={previewV2 && !v4 ? "v2" : undefined}
      data-v4={v4 ? "1" : undefined}
      data-theme={v4 ? "light" : undefined}
      suppressHydrationWarning
    >
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }}
        />
      </head>
      <body className="grain font-sans antialiased bg-bg-1 text-ink-200 min-h-[100svh] flex flex-col">
        {/* No analytics and no consent banner: the site stores only technically
            necessary or user-chosen settings (language cookie on an explicit
            switch, the footer's background-video switch), which need no consent. */}
        {children}
      </body>
    </html>
  );
}
