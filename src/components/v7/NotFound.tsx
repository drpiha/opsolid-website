import Link from "next/link";
import { LABEL } from "@/content/v7/site";
import { href, type L3, type PageKey } from "@/lib/v7-routes";
import { MotionRoot } from "./MotionRoot";
import { PlainHero } from "./LegalPage";
import { btnPrimary, wrap } from "./ui";

const COPY: Record<L3, { eyebrow: string; h1: [string, string]; lede: string; home: string; more: string }> = {
  de: {
    eyebrow: "Fehler 404",
    h1: ["Diese Seite", "gibt es nicht."],
    lede: "Die Seite existiert nicht oder wurde verschoben. Von hier kommen Sie zu den wichtigsten Seiten.",
    home: "Zur Startseite",
    more: "Weitere Seiten",
  },
  en: {
    eyebrow: "Error 404",
    h1: ["This page", "does not exist."],
    lede: "The page does not exist or has moved. From here you can reach the main pages.",
    home: "Back to home",
    more: "More pages",
  },
  tr: {
    eyebrow: "Hata 404",
    h1: ["Bu sayfa", "mevcut değil."],
    lede: "Sayfa mevcut değil veya taşınmış. Buradan ana sayfalara ulaşabilirsiniz.",
    home: "Ana sayfaya dön",
    more: "Diğer sayfalar",
  },
};

const LINKS: PageKey[] = ["beratung", "check", "kontakt"];

/** Localized v7 404 (rendered inside the site header and footer by src/app/[locale]/not-found.tsx). */
export function NotFound({ locale }: { locale: L3 }) {
  const c = COPY[locale];
  return (
    <MotionRoot>
      <div className="v7 pb-24 md:pb-40" lang={locale}>
        <PlainHero eyebrow={c.eyebrow} h1={<>{c.h1[0]} <em className="font-light italic text-[#B5623A]">{c.h1[1]}</em></>} lede={c.lede}>
          <div className="v7-rise mt-10" style={{ ["--d" as string]: "240ms" }}>
            <Link href={href("home", locale)} className={btnPrimary}>
              {c.home}
            </Link>
          </div>
        </PlainHero>
        <nav aria-label={c.more} className={`${wrap} mt-16 md:mt-24`}>
          <ul className="max-w-[44rem] border-t border-[#16191D]">
            {LINKS.map((k) => (
              <li key={k} className="border-b border-[#E3DCD1]">
                <Link href={href(k, locale)} className="group flex min-h-[44px] items-center justify-between gap-4 py-5">
                  <span className="f-display text-[1.375rem] leading-[1.2] md:text-[1.625rem]">{LABEL[locale][k]}</span>
                  <span aria-hidden="true" className="text-[#8A4524] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </MotionRoot>
  );
}
