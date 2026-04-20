import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_CONFIG } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "digital business card",
    "nfc business card",
    "smart business card",
    "apple wallet card",
    "google wallet card",
    "crm sync",
    "gdpr business card",
    "germany digital card",
    "business automation",
    "process automation",
    "workflow systems",
    "systems integration",
    "internal tools",
    "n8n automation",
    "Germany",
    "Hamburg",
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
    <html lang={lang} className={inter.variable}>
      <body className="font-sans antialiased bg-white text-ink min-h-[100svh] flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
