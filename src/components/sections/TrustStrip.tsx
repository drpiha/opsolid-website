"use client";

import { Star } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function TrustStrip() {
  const { t } = useLocale();
  const items = t.home.trustStrip.items;

  // First item is the rating, remaining are supporting claims.
  const [rating, ...rest] = items;

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
          {/* Rating */}
          <div className="snap-start flex items-center gap-2 shrink-0">
            <span
              className="flex items-center gap-0.5 text-brand"
              aria-hidden="true"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            <span className="text-sm font-semibold text-ink whitespace-nowrap">
              {rating}
            </span>
          </div>

          {/* Remaining items with separators */}
          {rest.map((item, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6 shrink-0">
              <span
                className="hidden md:inline-block h-1 w-1 rounded-full bg-neutral-300"
                aria-hidden="true"
              />
              <span className="snap-start text-sm font-medium text-ink/60 whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
