import { LABEL } from "@/content/v7/site";
import { href, type L3, type PageKey } from "@/lib/v7-routes";
import { PlainHero } from "./LegalPage";
import { btnPrimary, wrap } from "./ui";

const COPY: Record<L3, { eyebrow: string; h1: [string, string]; lede: string; home: string; more: string }> = {
  de: {
    eyebrow: "Fehler 404",
    h1: ["Diese Seite", "gibt es nicht"],
    lede: "Die Seite existiert nicht oder wurde verschoben.",
    home: "Zur Startseite",
    more: "Weitere Seiten",
  },
  en: {
    eyebrow: "Error 404",
    h1: ["This page", "does not exist"],
    lede: "The page does not exist or has moved.",
    home: "Back to home",
    more: "More pages",
  },
  tr: {
    eyebrow: "Hata 404",
    h1: ["Bu sayfa", "mevcut değil"],
    lede: "Sayfa mevcut değil veya taşınmış.",
    home: "Ana sayfaya dön",
    more: "Diğer sayfalar",
  },
};

const LINKS: PageKey[] = ["beratung", "check", "kontakt"];

/** Localized v7 404 (rendered inside the site header and footer by src/app/[locale]/not-found.tsx). */
export function NotFound({ locale }: { locale: L3 }) {
  const c = COPY[locale];
  return (
    <div className="v7 pb-24 md:pb-40" lang={locale}>
      <PlainHero eyebrow={c.eyebrow} h1={`${c.h1[0]} ${c.h1[1]}`} lede={c.lede}>
        <div>
          <a href={href("home", locale)} className={`${btnPrimary} v7-link`}>
            {c.home}
          </a>
        </div>
      </PlainHero>
      <nav aria-label={c.more} className={`${wrap} mt-12 md:mt-20`}>
        <ul className="max-w-[44rem] border-t-2 border-wk-ink">
          {LINKS.map((k) => (
            <li key={k} className="border-b border-wk-line-2">
              <a href={href(k, locale)} className="group flex min-h-[44px] items-center justify-between gap-4 py-5">
                <span className="wk-h3 group-hover:text-wk-copper-deep">{LABEL[locale][k]}</span>
                <span aria-hidden="true" className="text-wk-copper-deep transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
