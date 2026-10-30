"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/v7/Logo";
import { FOOTER_COLS, LABEL, SITE_STR, standDate } from "@/content/v7/site";
import { SITE_CONFIG } from "@/lib/constants";
import { href, type L3 } from "@/lib/v7-routes";
import { FX_EVENT, FX_STORAGE_KEY } from "./fx";
import { wrap } from "./ui";

/** The "Hintergrundvideo" switch: stores opsolid-fx=off and tells every video slot to show its poster only. */
function FxSwitch({ locale }: { locale: L3 }) {
  const t = SITE_STR[locale].fx;
  const [off, setOff] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      setOff(window.localStorage.getItem(FX_STORAGE_KEY) === "off");
    } catch {
      /* storage unavailable */
    }
  }, []);
  const toggle = () => {
    const next = !off;
    setOff(next);
    try {
      window.localStorage.setItem(FX_STORAGE_KEY, next ? "off" : "on");
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(FX_EVENT));
  };
  const cls = "inline-flex min-h-[44px] items-center text-[14px] text-[#F6F2EC]/90";
  if (reduced) {
    return (
      <span role="status" className={cls}>
        {t.label}: {t.sys}
      </span>
    );
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={!off} className={`${cls} text-left hover:text-white hover:underline hover:decoration-[#B5623A] hover:underline-offset-4`}>
      {t.label}: <b className="ml-1 font-medium">{off ? t.off : t.on}</b>
    </button>
  );
}

export function V7Footer({ locale }: { locale: L3 }) {
  const t = SITE_STR[locale];
  return (
    <footer className="v7 on-ink bg-[#16191D] text-[#F6F2EC]">
      <div className={`${wrap} py-14 md:py-20`}>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href={href("home", locale)} aria-label={t.homeAria} className="inline-flex min-h-[44px] items-center text-[#F6F2EC] [&_svg]:h-[24px] [&_svg]:w-auto">
              <Logo />
            </Link>
            <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.6] text-[#C9C2B8]">{t.tagline}</p>
            <p className="mt-5 flex flex-col text-[15px]">
              <a href={`mailto:${SITE_CONFIG.email}`} className="inline-flex min-h-[44px] items-center text-[#F6F2EC] underline decoration-[#B5623A] underline-offset-[6px]">
                {SITE_CONFIG.email}
              </a>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="inline-flex min-h-[44px] items-center text-[#F6F2EC]/90 hover:text-white">
                {SITE_CONFIG.phone}
              </a>
            </p>
          </div>
          <nav aria-label={t.footerNav} className="grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-8 md:grid-cols-4">
            {FOOTER_COLS.map((col) => (
              <div key={col.id}>
                <h2 className="f-mono text-[12px] font-normal uppercase text-[#E3B79C]">{t.footer[col.id]}</h2>
                <ul className="mt-4 space-y-0.5">
                  {col.keys.map((k) => (
                    <li key={k}>
                      <Link href={href(k, locale)} className="inline-flex min-h-[44px] items-center text-[15px] text-[#F6F2EC]/90 hover:text-white hover:underline hover:decoration-[#B5623A] hover:underline-offset-4">
                        {LABEL[locale][k]}
                      </Link>
                    </li>
                  ))}
                  {col.id === "legal" && (
                    <li>
                      <FxSwitch locale={locale} />
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 space-y-1 border-t border-[#F6F2EC]/15 pt-6 text-[13px] leading-[1.6] text-[#C9C2B8]">
          <p>{t.priceNote}</p>
          <p>{t.topsolid}</p>
          <p>{t.placeLine}</p>
          <p>
            {t.stand}: {standDate(locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
