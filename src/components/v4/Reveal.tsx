"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal: opacity + translate only, once per element, no-op without JS
 * or under prefers-reduced-motion (the CSS keeps content visible).
 */
export function Reveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "ul" | "li" | "p" }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.documentElement.classList.add("v4-js");
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`v4-rv ${className}`.trim()}>
      {children}
    </Comp>
  );
}
