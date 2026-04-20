"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

/**
 * HeroSchematic
 * An editorial, hand-drawn-feeling workflow graph rendered as SVG.
 * Cursor-reactive 3D tilt via React state + onMouseMove.
 * Respects prefers-reduced-motion: no tilt, no dash animation.
 */
export function HeroSchematic() {
  const { t } = useLocale();
  const labels = t.home.hero.editorial.schematic;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const max = 6; // deg
    // center is (0.5, 0.5)
    const ry = (x - 0.5) * 2 * max; // left->neg, right->pos
    const rx = -(y - 0.5) * 2 * max; // top->pos, bottom->neg
    setTilt({ rx, ry });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  const dashClass = reduced ? "" : "animate-flow-dash";

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden="true"
      className="relative w-full aspect-square max-w-[520px] ml-auto"
      style={{ perspective: "1200px" }}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg
          viewBox="0 0 520 520"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <defs>
            {/* arrowheads */}
            <marker
              id="arrow-ink"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--fg)" />
            </marker>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-ink)" />
            </marker>
          </defs>

          {/* Faint baseline grid — dot grid for "blueprint" feel */}
          <g opacity="0.14">
            {Array.from({ length: 11 }).map((_, i) =>
              Array.from({ length: 11 }).map((_, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={40 + i * 44}
                  cy={40 + j * 44}
                  r="0.7"
                  fill="var(--fg)"
                />
              )),
            )}
          </g>

          {/* Corner frame marks — editorial crop marks */}
          <g stroke="var(--fg)" strokeWidth="1" fill="none">
            <path d="M 12 12 L 12 32 M 12 12 L 32 12" />
            <path d="M 508 12 L 488 12 M 508 12 L 508 32" />
            <path d="M 12 508 L 12 488 M 12 508 L 32 508" />
            <path d="M 508 508 L 488 508 M 508 508 L 508 488" />
          </g>

          {/* Caption top-left */}
          <text
            x="46"
            y="28"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.55"
          >
            {labels.caption.toUpperCase()}
          </text>
          <text
            x="474"
            y="28"
            textAnchor="end"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.55"
          >
            520 × 520
          </text>

          {/* ==============================
              CONNECTIONS (under nodes)
              ============================== */}
          {/* Node coordinate map:
             TRIGGER   center (110,  130)  box 40..180,  100..160
             PARSE     center (410,  130)  box 330..490, 100..160
             ROUTE     center (260,  260)  box 200..320, 230..290
             WRITE     center (110,  400)  box 40..180,  370..430
             NOTIFY    center (410,  400)  box 330..490, 370..430
          */}

          {/* TRIGGER -> ROUTE (down-right curve, ink dashed) */}
          <path
            d="M 110 160 C 110 210, 180 215, 220 245"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={dashClass}
            markerEnd="url(#arrow-ink)"
          />
          {/* PARSE -> ROUTE (down-left curve, ink dashed) */}
          <path
            d="M 410 160 C 410 210, 340 215, 300 245"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={dashClass}
            markerEnd="url(#arrow-ink)"
          />

          {/* ROUTE -> WRITE (down-left, amber dashed) */}
          <path
            d="M 220 275 C 180 310, 140 340, 110 370"
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={dashClass}
            markerEnd="url(#arrow-amber)"
          />
          {/* ROUTE -> NOTIFY (down-right, amber dashed) */}
          <path
            d="M 300 275 C 340 310, 380 340, 410 370"
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={dashClass}
            markerEnd="url(#arrow-amber)"
          />

          {/* Secondary: WRITE -> NOTIFY (bottom horizontal, thin orthogonal, ink) */}
          <path
            d="M 180 400 L 330 400"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className={dashClass}
            opacity="0.55"
          />

          {/* ==============================
              NODES
              ============================== */}
          {/* TRIGGER */}
          <g>
            <rect
              x="40"
              y="100"
              width="140"
              height="60"
              fill="var(--bg-warm)"
              stroke="var(--fg)"
              strokeWidth="1"
            />
            {/* tiny icon glyph: bolt inside small box */}
            <g transform="translate(54, 116)" stroke="var(--fg)" strokeWidth="1" fill="none">
              <rect x="0" y="0" width="14" height="14" />
              <path d="M 7 3 L 4 8 L 7 8 L 6 11" strokeLinejoin="round" strokeLinecap="round" />
            </g>
            <text
              x="78"
              y="124"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--fg)"
            >
              {labels.trigger.toUpperCase()}
            </text>
            <text
              x="78"
              y="144"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1"
              fill="var(--fg)"
              opacity="0.6"
            >
              {labels.triggerDetail.toUpperCase()}
            </text>
            {/* step number */}
            <text
              x="172"
              y="114"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--fg)"
              opacity="0.4"
            >
              01
            </text>
          </g>

          {/* PARSE */}
          <g>
            <rect
              x="340"
              y="100"
              width="140"
              height="60"
              fill="var(--bg-warm)"
              stroke="var(--fg)"
              strokeWidth="1"
            />
            <g transform="translate(354, 116)" stroke="var(--fg)" strokeWidth="1" fill="none">
              <rect x="0" y="0" width="14" height="14" />
              <path d="M 3 4 L 11 4 M 3 7 L 9 7 M 3 10 L 11 10" strokeLinecap="round" />
            </g>
            <text
              x="378"
              y="124"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--fg)"
            >
              {labels.parse.toUpperCase()}
            </text>
            <text
              x="378"
              y="144"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1"
              fill="var(--fg)"
              opacity="0.6"
            >
              {labels.parseDetail.toUpperCase()}
            </text>
            <text
              x="472"
              y="114"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--fg)"
              opacity="0.4"
            >
              02
            </text>
          </g>

          {/* ROUTE (amber accent) */}
          <g>
            <rect
              x="200"
              y="230"
              width="120"
              height="60"
              fill="var(--accent)"
              stroke="var(--fg)"
              strokeWidth="1"
            />
            <g transform="translate(214, 246)" stroke="var(--fg)" strokeWidth="1" fill="none">
              <path d="M 7 0 L 0 7 L 7 14 M 0 7 L 14 7" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text
              x="236"
              y="254"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--fg)"
            >
              {labels.route.toUpperCase()}
            </text>
            <text
              x="236"
              y="274"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1"
              fill="var(--fg)"
              opacity="0.75"
            >
              {labels.routeDetail.toUpperCase()}
            </text>
            <text
              x="312"
              y="244"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--fg)"
              opacity="0.55"
            >
              03
            </text>
          </g>

          {/* WRITE */}
          <g>
            <rect
              x="40"
              y="370"
              width="140"
              height="60"
              fill="var(--bg-warm)"
              stroke="var(--fg)"
              strokeWidth="1"
            />
            <g transform="translate(54, 386)" stroke="var(--fg)" strokeWidth="1" fill="none">
              <ellipse cx="7" cy="3" rx="7" ry="2.2" />
              <path d="M 0 3 L 0 11 C 0 12.5, 3 14, 7 14 C 11 14, 14 12.5, 14 11 L 14 3" />
              <path d="M 0 7 C 0 8.5, 3 10, 7 10 C 11 10, 14 8.5, 14 7" />
            </g>
            <text
              x="78"
              y="394"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--fg)"
            >
              {labels.write.toUpperCase()}
            </text>
            <text
              x="78"
              y="414"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1"
              fill="var(--fg)"
              opacity="0.6"
            >
              {labels.writeDetail.toUpperCase()}
            </text>
            <text
              x="172"
              y="384"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--fg)"
              opacity="0.4"
            >
              04
            </text>
          </g>

          {/* NOTIFY */}
          <g>
            <rect
              x="340"
              y="370"
              width="140"
              height="60"
              fill="var(--bg-warm)"
              stroke="var(--fg)"
              strokeWidth="1"
            />
            <g transform="translate(354, 386)" stroke="var(--fg)" strokeWidth="1" fill="none">
              <path d="M 0 2 L 14 2 L 14 12 L 0 12 Z" />
              <path d="M 0 2 L 7 8 L 14 2" strokeLinejoin="round" />
            </g>
            <text
              x="378"
              y="394"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--fg)"
            >
              {labels.notify.toUpperCase()}
            </text>
            <text
              x="378"
              y="414"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1"
              fill="var(--fg)"
              opacity="0.6"
            >
              {labels.notifyDetail.toUpperCase()}
            </text>
            <text
              x="472"
              y="384"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="8"
              fill="var(--fg)"
              opacity="0.4"
            >
              05
            </text>
          </g>

          {/* Bottom axis line — editorial touch */}
          <line
            x1="40"
            y1="470"
            x2="480"
            y2="470"
            stroke="var(--fg)"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <text
            x="40"
            y="486"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="8"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.5"
          >
            T → 0
          </text>
          <text
            x="480"
            y="486"
            textAnchor="end"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="8"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.5"
          >
            T → n
          </text>
        </svg>
      </div>
    </div>
  );
}
