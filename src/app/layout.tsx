import type { Metadata } from "next";
import { headers } from "next/headers";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SITE_CONFIG } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "business automation",
    "process automation",
    "workflow systems",
    "systems integration",
    "internal tools",
    "operational infrastructure",
    "WhatsApp automation",
    "Telegram bot",
    "AI chatbot",
    "voice assistant",
    "n8n automation",
    "n8n workflows",
    "Make automation",
    "Zapier alternative",
    "CRM integration",
    "ERP integration",
    "workflow automation blog",
    "automation FAQ",
    "Germany",
    "Europe",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = headers();
  const localeHeader = headerStore.get("x-locale");
  const lang = isLocale(localeHeader) ? localeHeader : DEFAULT_LOCALE;

  return (
    <html
      lang={lang}
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased bg-paper text-ink min-h-[100svh] flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
