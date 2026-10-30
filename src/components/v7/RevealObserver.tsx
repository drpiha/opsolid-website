"use client";
import { useEffect } from "react";

/**
 * After hydration every Reveal that is still below the fold is hidden and released once it scrolls into view
 * (once: it never hides again, so full-page captures and scrolling back up stay complete). Elements that
 * are already on screen at load are never touched, reduced motion skips all of it, and without JS the page
 * simply stays fully visible.
 */
export function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".v7-reveal")).filter((el) => {
      if (el.closest(".v7-still")) return false;
      const r = el.getBoundingClientRect();
      return r.top > window.innerHeight * 0.94;
    });
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("v7-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    for (const el of els) {
      el.classList.add("v7-pre");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}
