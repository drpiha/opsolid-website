"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

/**
 * CardHeroVisual
 * Two overlapping editorial cards (physical NFC on the back, digital profile on front).
 * Ink strokes, paper-warm fill, amber accent on NFC chip.
 * Subtle cursor-reactive 3D tilt (±4deg), respects prefers-reduced-motion.
 * `aria-hidden` — it's decorative; the real content is in the page copy.
 */
export function CardHeroVisual() {
  const { t } = useLocale();
  const labels = t.products.digitalCard.hero.cardLabels;

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
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const max = 4; // deg
    const ry = (x - 0.5) * 2 * max;
    const rx = -(y - 0.5) * 2 * max;
    setTilt({ rx, ry });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden="true"
      className="relative w-full aspect-[5/4] max-w-[560px] ml-auto"
      style={{ perspective: "1400px" }}
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
          viewBox="0 0 560 450"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <defs>
            {/* Very light dot grid on physical card surface */}
            <pattern
              id="dbc-dotgrid"
              x="0"
              y="0"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="0.8" cy="0.8" r="0.55" fill="var(--fg)" opacity="0.18" />
            </pattern>
          </defs>

          {/* Corner crop marks (editorial signature) */}
          <g stroke="var(--fg)" strokeWidth="1" fill="none" opacity="0.55">
            <path d="M 10 10 L 10 26 M 10 10 L 26 10" />
            <path d="M 550 10 L 534 10 M 550 10 L 550 26" />
            <path d="M 10 440 L 10 424 M 10 440 L 26 440" />
            <path d="M 550 440 L 534 440 M 550 440 L 550 424" />
          </g>

          {/* Top-left mono caption */}
          <text
            x="40"
            y="28"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.55"
          >
            CARD · V1 · 85.60 × 53.98 MM
          </text>
          <text
            x="520"
            y="28"
            textAnchor="end"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="9"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.4"
          >
            NFC · QR
          </text>

          {/* ==============================
              BACK CARD — physical NFC card
              rotated ~-8deg behind
              ============================== */}
          <g transform="translate(70 90) rotate(-8 200 135)">
            {/* Shadow hairline to suggest depth */}
            <rect
              x="4"
              y="4"
              width="320"
              height="200"
              rx="14"
              fill="var(--fg)"
              opacity="0.06"
            />
            {/* Card body */}
            <rect
              x="0"
              y="0"
              width="320"
              height="200"
              rx="14"
              fill="var(--bg-warm)"
              stroke="var(--fg)"
              strokeWidth="1.25"
            />
            {/* Subtle dot grid overlay */}
            <rect
              x="0"
              y="0"
              width="320"
              height="200"
              rx="14"
              fill="url(#dbc-dotgrid)"
            />

            {/* NFC chip area — amber accent square with wave lines */}
            <g>
              <rect
                x="24"
                y="30"
                width="62"
                height="46"
                rx="6"
                fill="var(--accent)"
                stroke="var(--fg)"
                strokeWidth="1.25"
              />
              {/* NFC wave icon — three nested arcs */}
              <g
                transform="translate(55 53)"
                stroke="var(--fg)"
                strokeWidth="1.25"
                fill="none"
                strokeLinecap="round"
              >
                <path d="M -14 -10 Q -6 0 -14 10" />
                <path d="M -8 -7 Q -2 0 -8 7" />
                <path d="M -2 -4 Q 2 0 -2 4" />
              </g>
              {/* "NFC" mono label below chip */}
              <text
                x="55"
                y="94"
                textAnchor="middle"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="9"
                letterSpacing="2"
                fill="var(--fg)"
                opacity="0.7"
              >
                {labels.nfc.toUpperCase()}
              </text>
            </g>

            {/* Logo mark — OpSolid block (top right) */}
            <g transform="translate(260 34)" fill="none" stroke="var(--fg)" strokeWidth="1.25">
              <rect x="0" y="0" width="32" height="32" rx="4" />
              <path d="M 8 16 L 13 22 L 24 10" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Name on card */}
            <text
              x="24"
              y="130"
              fontFamily="var(--font-instrument-serif), Georgia, serif"
              fontSize="22"
              fill="var(--fg)"
              letterSpacing="-0.01em"
            >
              {labels.name}
            </text>
            <text
              x="24"
              y="152"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="10"
              fill="var(--fg)"
              opacity="0.65"
              letterSpacing="1.5"
            >
              {labels.role.toUpperCase()}
            </text>

            {/* Bottom strip — tap to share */}
            <line x1="24" y1="170" x2="296" y2="170" stroke="var(--fg)" strokeWidth="0.75" opacity="0.25" />
            <text
              x="24"
              y="186"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="2"
              fill="var(--fg)"
              opacity="0.55"
            >
              {labels.chip.toUpperCase()}
            </text>
            <text
              x="296"
              y="186"
              textAnchor="end"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="2"
              fill="var(--fg)"
              opacity="0.4"
            >
              01
            </text>
          </g>

          {/* ==============================
              FRONT CARD — digital profile
              rotated ~+6deg in front
              ============================== */}
          <g transform="translate(180 140) rotate(6 140 115)">
            {/* Shadow */}
            <rect
              x="4"
              y="4"
              width="280"
              height="230"
              rx="10"
              fill="var(--fg)"
              opacity="0.10"
            />
            {/* Phone-screen frame */}
            <rect
              x="0"
              y="0"
              width="280"
              height="230"
              rx="10"
              fill="var(--bg)"
              stroke="var(--fg)"
              strokeWidth="1.25"
            />

            {/* URL bar */}
            <g>
              <rect
                x="14"
                y="14"
                width="252"
                height="22"
                rx="4"
                fill="var(--bg-warm)"
                stroke="var(--fg)"
                strokeWidth="0.75"
                opacity="0.85"
              />
              <text
                x="24"
                y="29"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="9"
                letterSpacing="1"
                fill="var(--fg)"
                opacity="0.7"
              >
                opsolid.cards/hasan
              </text>
              <circle cx="258" cy="25" r="3" fill="none" stroke="var(--fg)" strokeWidth="0.75" opacity="0.5" />
            </g>

            {/* Avatar circle + name block */}
            <g transform="translate(20 54)">
              <circle
                cx="24"
                cy="24"
                r="24"
                fill="var(--accent)"
                stroke="var(--fg)"
                strokeWidth="1.25"
                opacity="0.55"
              />
              {/* Initials */}
              <text
                x="24"
                y="30"
                textAnchor="middle"
                fontFamily="var(--font-instrument-serif), Georgia, serif"
                fontSize="20"
                fill="var(--fg)"
              >
                HD
              </text>

              <text
                x="64"
                y="20"
                fontFamily="var(--font-instrument-serif), Georgia, serif"
                fontSize="19"
                fill="var(--fg)"
                letterSpacing="-0.01em"
              >
                {labels.name}
              </text>
              <text
                x="64"
                y="38"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="9"
                fill="var(--fg)"
                opacity="0.65"
                letterSpacing="1.2"
              >
                {labels.role.toUpperCase()}
              </text>
              <text
                x="64"
                y="52"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="9"
                fill="var(--fg)"
                opacity="0.5"
                letterSpacing="1.2"
              >
                {labels.company.toUpperCase()}
              </text>
            </g>

            {/* Fields — hairline lines */}
            <g stroke="var(--fg)" strokeWidth="0.75" opacity="0.25">
              <line x1="20" y1="126" x2="260" y2="126" />
              <line x1="20" y1="158" x2="260" y2="158" />
              <line x1="20" y1="190" x2="260" y2="190" />
            </g>
            <g
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontSize="9"
              letterSpacing="1.2"
              fill="var(--fg)"
            >
              <text x="20" y="120" opacity="0.55">EMAIL</text>
              <text x="260" y="120" textAnchor="end" opacity="0.85">hello@opsolid.de</text>

              <text x="20" y="152" opacity="0.55">PHONE</text>
              <text x="260" y="152" textAnchor="end" opacity="0.85">+49 • • • •</text>

              <text x="20" y="184" opacity="0.55">LINKEDIN</text>
              <text x="260" y="184" textAnchor="end" opacity="0.85">/in/hasan-dnmz</text>
            </g>

            {/* Primary action button */}
            <g transform="translate(20 202)">
              <rect
                x="0"
                y="0"
                width="240"
                height="18"
                rx="3"
                fill="var(--accent)"
                stroke="var(--fg)"
                strokeWidth="1"
              />
              <text
                x="120"
                y="13"
                textAnchor="middle"
                fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                fontSize="9"
                letterSpacing="2"
                fill="var(--fg)"
              >
                SAVE CONTACT
              </text>
            </g>
          </g>

          {/* Bottom axis caption */}
          <line x1="40" y1="420" x2="520" y2="420" stroke="var(--fg)" strokeWidth="0.5" opacity="0.3" />
          <text
            x="40"
            y="436"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="8"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.45"
          >
            PHYSICAL
          </text>
          <text
            x="520"
            y="436"
            textAnchor="end"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="8"
            letterSpacing="2"
            fill="var(--fg)"
            opacity="0.45"
          >
            DIGITAL
          </text>
        </svg>
      </div>
    </div>
  );
}
