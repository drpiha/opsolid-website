"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { BlockOf } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";

const STAYS: Record<L3, string> = { de: "Bleibt beim Menschen", en: "Stays with people", tr: "İnsanda kalır" };

/**
 * Tabs as outlined pills from 961 px (roving tabindex, arrows, Home/End), the panel on a sheet; stacked sheets on phones.
 * Below 961 px the tablist is hidden by CSS, so the sheets drop the tabpanel role and their tab stop there (plain
 * sections); the server renders the tab pattern and the effect switches after hydration.
 */
export function SectorTabs({ block, locale }: { block: BlockOf<"sectors">; locale: L3 }) {
  const uid = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = block.items.length;
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 961px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = (i: number) => {
    const k = (i + n) % n;
    setSel(k);
    tabs.current[k]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(n - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="wk-sectors">
      <div role="tablist" aria-label={block.h} className="wk-sector-tabs">
        {block.items.map((s, i) => (
          <button
            key={s.name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={sel === i}
            aria-controls={`${uid}-p${i}`}
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
            className="wk-pill"
          >
            {s.tab ?? s.name}
          </button>
        ))}
      </div>

      <div className="wk-sector-panels">
        {block.items.map((s, i) => (
          <div
            key={s.name}
            role={wide ? "tabpanel" : undefined}
            id={`${uid}-p${i}`}
            aria-labelledby={wide ? `${uid}-t${i}` : undefined}
            tabIndex={wide ? 0 : undefined}
            className={`wk-card wk-sector-panel${sel === i ? " is-on" : ""}`}
          >
            <p className="wk-ledger-no wk-sector-name">{s.name}</p>
            <div className="wk-sector-grid">
              <div>
                <h3 className="wk-card-h">{s.h}</h3>
                <p className="wk-muted mt-4 max-w-[52ch]">{s.p}</p>
                <div className="wk-sector-stays">
                  <span className="wk-etikett is-solid">{STAYS[locale]}</span>
                  <p>{s.stays}</p>
                </div>
              </div>
              <div>
                <span className="wk-etikett">{block.tag}</span>
                <ul className="wk-sector-ideas">
                  {s.ideas.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
