"use client";

import { useLocale } from "@/context/LocaleContext";

export function TrustStrip() {
  const { t } = useLocale();
  const items = t.home.trustStrip.items;

  return (
    <section
      aria-label="Trust signals"
      className="border-t border-b border-neutral-200 bg-white"
    >
      <div className="container-wide">
        <div
          className="flex items-center justify-center md:justify-between gap-4 md:gap-6 py-5 md:py-6 overflow-x-auto snap-x [overscroll-behavior-x:contain]"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6 shrink-0">
              {i > 0 && (
                <span
                  className="hidden md:inline-block h-1 w-1 rounded-full bg-neutral-300"
                  aria-hidden="true"
                />
              )}
              <span className="snap-start text-sm font-medium text-ink/65 whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
