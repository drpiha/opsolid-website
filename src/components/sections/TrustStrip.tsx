"use client";

import { useLocale } from "@/context/LocaleContext";

export function TrustStrip() {
  const { t } = useLocale();
  const items = t.home.capabilities;

  return (
    <section className="hairline-t hairline-b bg-paper-cool/60 overflow-hidden max-w-full">
      <div
        className="relative ticker-scroll max-w-full"
        role="presentation"
        aria-hidden="true"
      >
        <div className="group flex">
          <div className="flex shrink-0 animate-ticker group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
            <TickerRow items={items} />
            <TickerRow items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TickerRow({ items }: { items: readonly string[] }) {
  return (
    <div className="flex items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-amber shrink-0 mx-6"
          />
          <span className="mono-label text-ink/70 whitespace-nowrap">
            {item}
          </span>
        </span>
      ))}
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full bg-amber shrink-0 mx-6"
      />
    </div>
  );
}
