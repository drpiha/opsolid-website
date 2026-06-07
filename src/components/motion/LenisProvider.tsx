"use client";

/**
 * LenisProvider — desktop smooth-scroll + GSAP ticker integration.
 *
 * Bypassed on touch devices (`pointer: coarse`) and when the user prefers
 * reduced motion. In both cases the browser's native scroll runs and no JS
 * is mounted. GSAP's ticker drives Lenis's `raf` so ScrollTrigger and
 * Lenis share one frame loop — `lagSmoothing(0)` keeps timestamps honest
 * for scroll-locked sequences in later milestones.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The card editor is a long, form-heavy page where smooth-scroll inertia
    // feels heavy and its scroll interception causes jump-to-top on edits.
    // Use the browser's native scroll there.
    if (pathname && /\/card\/edit\//.test(pathname)) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    const onRaf = (time: number) => {
      // gsap.ticker passes time in seconds; Lenis expects ms.
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
