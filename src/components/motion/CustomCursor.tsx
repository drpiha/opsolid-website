"use client";

/**
 * CustomCursor — 24px circle with `mix-blend-mode: difference`, lerp(0.32)
 * trailing motion, and a magnetic pull (80px radius) on anchors tagged
 * `[data-cursor="link"]` and primary CTAs (`.btn-primary`).
 *
 * Mounts only on `(pointer: fine)` and when the user has NOT requested
 * reduced motion. On touch or reduced-motion, the component returns null
 * and the native cursor is unaffected.
 */

import { useEffect, useRef, useState } from "react";

const LERP = 0.32;
const MAGNETIC_RADIUS = 80;
const MAGNETIC_SELECTOR =
  '[data-cursor="link"], .btn-primary, [data-magnetic="true"]';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let rafId = 0;
    let magneticTarget: Element | null = null;

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const next = el?.closest(MAGNETIC_SELECTOR) ?? null;
      if (next !== magneticTarget) {
        magneticTarget = next;
        cursor.classList.toggle("os-cursor--magnetic", Boolean(next));
      }

      if (next) {
        const rect = (next as HTMLElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < MAGNETIC_RADIUS) {
          // Pull cursor a fraction of the way toward the element's center —
          // strongest near the edge, vanishing at the center.
          const pull = 0.45 * (1 - dist / MAGNETIC_RADIUS);
          pointerX = e.clientX - dx * pull;
          pointerY = e.clientY - dy * pull;
        }
      }
    };

    const onLeave = () => {
      cursor.classList.add("os-cursor--hidden");
    };
    const onEnter = () => {
      cursor.classList.remove("os-cursor--hidden");
    };

    const tick = () => {
      cursorX += (pointerX - cursorX) * LERP;
      cursorY += (pointerY - cursorY) * LERP;
      cursor.style.transform = `translate3d(${cursorX - 12}px, ${cursorY - 12}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("os-has-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("os-has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} aria-hidden="true" className="os-cursor" />;
}
