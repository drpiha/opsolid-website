import { headers } from "next/headers";

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
} as const;

type Lang = keyof typeof copy;

function detectLang(): Lang {
  const h = headers();
  const referer = h.get("referer") ?? "";
  if (referer) {
    try {
      const u = new URL(referer);
      const q = u.searchParams.get("lang");
      if (q === "de" || q === "tr" || q === "en") return q;
    } catch {
      // ignore malformed referer
    }
  }
  const accept = (h.get("accept-language") ?? "").toLowerCase();
  if (accept.startsWith("de")) return "de";
  if (accept.startsWith("tr")) return "tr";
  return "en";
}

export default function NotFound() {
  const lang = detectLang();
  const t = copy[lang];
  const homeHref = lang === "en" ? "/" : `/${lang}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center bg-bg-0">
      <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-1">
        <span aria-hidden className="text-xl text-ink-400">·</span>
      </div>
      <h1 className="font-display text-3xl font-medium text-ink">{t.title}</h1>
      <p className="max-w-md text-sm text-ink-400">{t.body}</p>
      <a
        href={homeHref}
        className="rounded-full bg-copper-500 px-6 py-2 text-sm text-white transition-colors hover:bg-copper-600"
      >
        {t.home}
      </a>
    </main>
  );
}
