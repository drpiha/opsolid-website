import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ConditionalAnalytics } from "@/components/shared/ConditionalAnalytics";
import { SITE_CONFIG } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE, directionForLocale } from "@/lib/i18n";
import { ConsentBanner } from "@/components/shared/ConsentBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Geist isn't a Google Font at this time; Vercel ships it as a static file
// in the `geist` npm package. We keep it optional — if the package is
// missing, the CSS stack falls back to Inter for display.
let geistVariable = "";
try {
  // Dynamic require so missing dep in CI doesn't break the build.
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { GeistSans } = require("geist/font/sans");
  geistVariable = GeistSans.variable;
} catch {
  geistVariable = "";
}

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "KI Beratung Mittelstand",
    "KI Beratung für Unternehmen",
    "Automatisierung Beratung",
    "Prozessautomatisierung Unternehmen",
    "Geschäftsprozesse automatisieren",
    "Microsoft 365 Automatisierung",
    "Power Automate Beratung",
    "KI Schulung Unternehmen",
    "Digitalisierung Mittelstand",
    "Workflow Automatisierung",
    "KI Prozessoptimierung",
    "AI consulting",
    "AI automation",
    "SME automation",
    "Germany",
    "Mittelstand",
    "B2B",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E13" },
  ],
};

// Applied inline in <head> before hydration so the first paint already has
// the correct palette — avoids flash-of-wrong-theme. Mirrors
// src/context/ThemeContext.tsx (DEFAULT_THEME = "hybrid", key = "opsolid-theme").
const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('opsolid-theme');if(t!=='light'&&t!=='hybrid'&&t!=='dark'){t='hybrid';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','hybrid');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = headers();
  const localeHeader = headerStore.get("x-locale");
  const lang = isLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;
  const dir = directionForLocale(lang);

  const fontClasses = [
    inter.variable,
    instrumentSerif.variable,
    jetBrainsMono.variable,
    geistVariable,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang={lang}
      dir={dir}
      className={fontClasses}
      data-theme="hybrid"
      suppressHydrationWarning
    >
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }}
        />
      </head>
      <body className="grain font-sans antialiased bg-bg-1 text-ink-200 min-h-[100svh] flex flex-col">
        {children}
        {/* C5 — ConsentBanner sets the localStorage flag; ConditionalAnalytics
            (a client component) watches it and only mounts <Analytics /> after
            the user accepts. We can't pass `beforeSend` from this server layout
            because RSC cannot serialize functions across the boundary. */}
        <ConsentBanner />
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
