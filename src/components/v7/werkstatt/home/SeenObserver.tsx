"use client";
import { useEffect } from "react";

/**
 * Marks every `.wk-steps[data-seen]` as `.is-seen` once it first scrolls into view (the process line draws itself,
 * the numbers follow; the CSS runs only from 961 px and under no-preference). Without JS, under reduced motion and
 * on phones the CSS shows the final state, so nothing here can hide content.
 */
export function SeenObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".wk-steps[data-seen]:not(.is-seen)"));
    if (!els.length) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-seen"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-seen");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
