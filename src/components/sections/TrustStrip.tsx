"use client";

import { useLocale } from "@/context/LocaleContext";

export function TrustStrip() {
  const { t } = useLocale();
  const items = t.home.capabilities;

  return (
    <section className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 overflow-hidden">
      <div className="py-5 md:py-6">
        <div className="flex animate-scroll-x" style={{ width: "max-content" }}>
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 px-6 md:px-8 text-xs md:text-sm font-medium text-white/80 tracking-wide uppercase whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-400 to-teal-400 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
