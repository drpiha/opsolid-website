"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { demoPersonas } from "./demoPersonas";

/**
 * FoilCard — Digital Card page centerpiece.
 *
 * Cursor-reactive 3D tilt + holographic foil sheen. Hover the right half of
 * the card to flip to the QR back; hover left to return. Click/keyboard also
 * toggle as a fallback for touch users. Mouse-driven flip uses a 350 ms
 * debounce so casual cursor passes don't trigger it.
 */
export function FoilCard() {
  const { locale } = useLocale();
  const persona = demoPersonas[locale];
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = useState(false);
  // Refs so the useEffect closure always sees current values without re-running.
  const flippedRef = useRef(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleFlip = (to: boolean) => {
    flippedRef.current = to;
    setFlipped(to);
  };

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let rx = 0;
    let ry = 0;
    let tgtRx = 0;
    let tgtRy = 0;
    let glare = 50;
    let tgtGlare = 50;

    const scheduleFlip = (to: boolean) => {
      if (flipTimerRef.current !== null) return;
      flipTimerRef.current = setTimeout(() => {
        flipTimerRef.current = null;
        if (flippedRef.current !== to) {
          flippedRef.current = to;
          setFlipped(to);
        }
      }, 350);
    };

    const cancelFlip = () => {
      if (flipTimerRef.current !== null) {
        clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
    };

    const applyFromPoint = (clientX: number, clientY: number) => {
      const r = stage.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (clientX - cx) / (r.width / 2);
      const dy = (clientY - cy) / (r.height / 2);
      tgtRy = Math.max(-1, Math.min(1, dx)) * 14;
      tgtRx = Math.max(-1, Math.min(1, -dy)) * 10;
      tgtGlare = 50 + dx * 35;

      if (!reduceMotion) {
        if (dx > 0.6 && !flippedRef.current) {
          scheduleFlip(true);
        } else if (dx < -0.6 && flippedRef.current) {
          scheduleFlip(false);
        } else if (dx < 0.4 && dx > -0.4) {
          cancelFlip();
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => applyFromPoint(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) applyFromPoint(touch.clientX, touch.clientY);
    };
    const onLeave = () => {
      tgtRx = 0;
      tgtRy = 0;
      tgtGlare = 50;
      cancelFlip();
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      stage.addEventListener("mouseleave", onLeave);
      stage.addEventListener("touchend", onLeave);
    }

    let raf = 0;
    const tick = () => {
      rx += (tgtRx - rx) * 0.09;
      ry += (tgtRy - ry) * 0.09;
      glare += (tgtGlare - glare) * 0.1;
      card.style.setProperty("--rx", rx.toFixed(2) + "deg");
      card.style.setProperty("--ry", ry.toFixed(2) + "deg");
      card.style.setProperty("--glare-x", glare.toFixed(1) + "%");
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelFlip();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("touchend", onLeave);
    };
  }, []);

  // Deterministic pseudo-random QR-like pattern (decorative, not a real code).
  const qrCells = Array.from({ length: 25 * 25 }).map((_, i) => {
    const r = Math.floor(i / 25);
    const c = i % 25;
    const seed = (r * 37 + c * 83) % 17;
    const on = seed < 8;
    const inFinder = (rr: number, cc: number) =>
      (rr < 7 && cc < 7) || (rr < 7 && cc > 17) || (rr > 17 && cc < 7);
    const finder =
      inFinder(r, c) &&
      (r === 0 ||
        r === 6 ||
        (r > 17 && r === 18) ||
        c === 0 ||
        c === 6 ||
        (c > 17 && c === 18) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= 20 && c <= 22) ||
        (r >= 20 && r <= 22 && c >= 2 && c <= 4));
    const fill = inFinder(r, c)
      ? finder
        ? "#1A0E04"
        : "transparent"
      : on
      ? "#1A0E04"
      : "transparent";
    return <span key={i} style={{ background: fill }} />;
  });

  return (
    <div className="fc-stage" ref={stageRef}>
      <div className="fc-shadow" aria-hidden="true" />
      <div
        className={"fc-card" + (flipped ? " is-flipped" : "")}
        ref={cardRef}
        onClick={() => toggleFlip(!flippedRef.current)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Flip card to front" : "Hover right side or tap to flip"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip(!flippedRef.current);
          }
        }}
      >
        {/* FRONT */}
        <div className="fc-face fc-front">
          <div className="fc-foil" aria-hidden="true" />
          <div className="fc-bevel" aria-hidden="true" />
          <div className="fc-top">
            <div className="fc-brand">
              <span className="fc-mark" />
              <span className="fc-brandname">OpSolid</span>
            </div>
            <div className="fc-chip">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 2a10 10 0 0 1 0 20" />
                <path d="M12 6a6 6 0 0 1 0 12" />
                <path d="M12 10a2 2 0 0 1 0 4" />
              </svg>
              <span>QR</span>
            </div>
          </div>
          <div className="fc-person">
            <div className="fc-name">{persona.name}</div>
            <div className="fc-role">{persona.role}</div>
          </div>
          <div className="fc-contacts">
            <div className="fc-contact-row">
              <span className="fc-label">MAIL</span>
              <span className="fc-value">{persona.email}</span>
            </div>
            <div className="fc-contact-row">
              <span className="fc-label">TEL</span>
              <span className="fc-value">{persona.phone}</span>
            </div>
            <div className="fc-contact-row">
              <span className="fc-label">BASED</span>
              <span className="fc-value">{persona.location}</span>
            </div>
          </div>
          <div className="fc-glare" aria-hidden="true" />
          <div className="fc-hint">SCAN TO SHARE · HOVER TO FLIP</div>
        </div>

        {/* BACK */}
        <div className="fc-face fc-back">
          <div className="fc-bevel" aria-hidden="true" />
          <div className="fc-qr-wrap">
            <div className="fc-qr-ring" aria-hidden="true" />
            <div className="fc-qr" aria-hidden="true">
              <div className="fc-qr-inner">{qrCells}</div>
            </div>
          </div>
          <div className="fc-back-copy">
            <div className="fc-back-title">Scan to open</div>
            <div className="fc-back-sub">vCard · calendar · portfolio</div>
            <div className="fc-back-url">{`opsolid.de/c/${persona.slug}`}</div>
          </div>
        </div>
      </div>
      <div className="fc-ripple" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
