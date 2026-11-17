"use client";
import { useEffect, useState, type MouseEvent } from "react";
import type { Faq as FaqData } from "@/content/v7/types";

/**
 * The C FAQ list (.wk-faq): native <details>/<summary> rows with the plus/minus square, one open at a time. Every
 * answer stays in the server HTML (crawlers and the FAQPage markup see the same text) and the rows work before
 * hydration and without JS. The server HTML has every row closed; after mount, from 961 px wide, the first answer
 * opens (phones keep all closed, so the questions read as one list). Clicks are routed through React state so the
 * one-open rule holds.
 */
export function FaqList({ items }: { items: FaqData["items"] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    try {
      if (window.matchMedia("(min-width: 961px)").matches) setOpen(0);
    } catch {
      /* no matchMedia: keep all closed */
    }
  }, []);
  const toggle = (i: number) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpen((cur) => (cur === i ? null : i));
  };
  return (
    <div className="wk-faq">
      {items.map((it, i) => (
        <details key={it.q} open={open === i}>
          <summary onClick={toggle(i)}>
            <h3 className="wk-faq-q">{it.q}</h3>
          </summary>
          <div className="wk-faq-a">
            <p>{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
