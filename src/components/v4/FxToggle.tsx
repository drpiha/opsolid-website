"use client";

import { useEffect, useState } from "react";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { FX_EVENT, FX_STORAGE_KEY } from "@/components/v4/Stage";

const T = {
  de: { label: "3D-Effekte", on: "An", off: "Aus", sys: "Aus (Systemeinstellung: weniger Bewegung)" },
  en: { label: "3D effects", on: "On", off: "Off", sys: "Off (system setting: reduced motion)" },
  tr: { label: "3D efektler", on: "Açık", off: "Kapalı", sys: "Kapalı (sistem ayarı: az hareket)" },
} as const;

export function FxToggle() {
  const { locale } = useLocale();
  const t = T[locale === "de" || locale === "tr" ? locale : "en"];
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

  if (reduced) {
    return (
      <span className="v4-fx" role="status">
        {t.label}: {t.sys}
      </span>
    );
  }
  return (
    <button type="button" className="v4-fx" onClick={toggle} aria-pressed={!off}>
      {t.label}: <b>{off ? t.off : t.on}</b>
    </button>
  );
}
