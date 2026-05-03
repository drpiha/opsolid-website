"use client";

// =============================================================================
// /c/[slug] not-found — locale-aware 404 for missing card slugs.
// Reads ?lang= query param; falls back to "en". B6 acceptance: locale-aware
// error messages for de / tr / en.
// =============================================================================

import { useSearchParams } from "next/navigation";

const copy = {
  de: {
    title: "Karte nicht gefunden",
    body: "Diese digitale Visitenkarte existiert nicht oder wurde entfernt.",
    home: "Zur Startseite",
  },
  en: {
    title: "Card not found",
    body: "This digital business card does not exist or has been removed.",
    home: "Go to homepage",
  },
  tr: {
    title: "Kart bulunamadı",
    body: "Bu dijital kartvizit mevcut değil veya kaldırılmış.",
    home: "Ana sayfaya dön",
  },
};

type Lang = keyof typeof copy;

export default function NotFound() {
  const params = useSearchParams();
  const lang = (params.get("lang") ?? "en") as Lang;
  const t = copy[lang] ?? copy.en;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center bg-bg-0">
      <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-1">
        <span aria-hidden className="text-xl text-ink-400">·</span>
      </div>
      <h1 className="font-display text-3xl font-medium text-ink">{t.title}</h1>
      <p className="max-w-md text-sm text-ink-400">{t.body}</p>
      <a
        href={lang === "en" ? "/" : `/${lang}`}
        className="rounded-full bg-copper-500 px-6 py-2 text-sm text-white hover:bg-copper-600 transition-colors"
      >
        {t.home}
      </a>
    </main>
  );
}
