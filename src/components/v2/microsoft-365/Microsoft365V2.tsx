"use client";

/**
 * Microsoft365V2 — Live constellation hub.
 *
 * Six Microsoft 365 service tiles (Outlook, Teams, SharePoint, OneDrive,
 * Forms, Planner) arranged in a circle around a central Orchestrator hub.
 * Each spoke is a curved SVG path with verdigris tokens flowing inward
 * toward the hub (messages/files/approvals being routed).
 *
 * Mouse-reactive:
 *   - Hovering a service tile dims the other tiles, highlights its
 *     spoke + the hub
 *   - Hovering the hub highlights all spokes simultaneously
 *
 * Reduced-motion: tokens hidden, hover effects swap to color-only.
 */

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

// Service positions on a 600x600 viewBox, distributed evenly on a 240px
// radius around center (300,300). Index 0 = top, clockwise.
const RADIUS = 240;
const CENTER = 300;
const ANGLES = [-90, -30, 30, 90, 150, 210]; // top, then clockwise

type ServicePos = { x: number; y: number };
function tilePos(angleDeg: number): ServicePos {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CENTER + Math.cos(a) * RADIUS, y: CENTER + Math.sin(a) * RADIUS };
}

// Curved Bezier from tile to center. Control points pulled toward the
// center on a perpendicular axis so the curves arc inward gracefully.
function spokePath(p: ServicePos): string {
  const dx = CENTER - p.x;
  const dy = CENTER - p.y;
  // Curve control: midpoint, displaced perpendicular to the spoke by
  // ~28% of spoke length. Sign alternates per spoke to avoid all curves
  // bending the same way.
  const mx = p.x + dx * 0.5;
  const my = p.y + dy * 0.5;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const offset = len * 0.18;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  return `M ${p.x} ${p.y} Q ${cx} ${cy} ${CENTER} ${CENTER}`;
}

// Service tile icons — abstract glyphs so we don't ship MS logos. Each
// represents an app intuitively (envelope, chat, sheets, cloud, form, board).
const ICONS: Record<number, React.ReactNode> = {
  0: ( // Outlook — envelope
    <g>
      <rect x="-14" y="-10" width="28" height="20" rx="3" />
      <path d="M -14 -10 L 0 4 L 14 -10" />
    </g>
  ),
  1: ( // Teams — chat bubble
    <g>
      <path d="M -12 -10 H 12 V 6 H -2 L -8 12 V 6 H -12 Z" />
    </g>
  ),
  2: ( // SharePoint — interlocked rings
    <g>
      <circle cx="-6" cy="0" r="8" />
      <circle cx="6" cy="0" r="8" />
    </g>
  ),
  3: ( // OneDrive — cloud
    <g>
      <path d="M -14 4 A 6 6 0 0 1 -8 -4 A 8 8 0 0 1 6 -8 A 6 6 0 0 1 14 0 A 5 5 0 0 1 12 6 H -10 A 6 6 0 0 1 -14 4 Z" />
    </g>
  ),
  4: ( // Forms — checked list
    <g>
      <rect x="-12" y="-10" width="24" height="20" rx="2" />
      <path d="M -8 -4 L -4 0 L 2 -6" />
      <line x1="-8" y1="5" x2="8" y2="5" />
    </g>
  ),
  5: ( // Planner — kanban columns
    <g>
      <rect x="-12" y="-10" width="6" height="20" rx="1" />
      <rect x="-3" y="-10" width="6" height="13" rx="1" />
      <rect x="6" y="-10" width="6" height="20" rx="1" />
    </g>
  ),
};

export function Microsoft365V2() {
  const { locale } = useLocale();
  const c = getV2Content(locale);
  const data = c.microsoft365 as typeof c.microsoft365;
  const services = data.services as readonly string[];
  const hubLabel = data.hubLabel as string;

  // Which spoke is highlighted: a service index, or "hub" for all-on,
  // or null for default (all active at low intensity).
  const [active, setActive] = useState<number | "hub" | null>(null);

  return (
    <section className="v2-ms-hero">
      <div className="wrap v2-ms-hero__inner">
        <div className="v2-ms-hero__copy">
          <span className="v2-ms-hero__eyebrow">{data.eyebrow}</span>
          <h1 className="v2-ms-hero__headline">{data.headline}</h1>
          <p className="v2-ms-hero__lead">{data.lead}</p>
          <div className="v2-ms-hero__cta-row">
            <Link href="/contact" className="v2-btn-primary" data-cursor="link">
              {data.ctaPrimary}
            </Link>
            <Link href="/leistungen" className="v2-btn-ghost" data-cursor="link">
              {data.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="v2-ms-hero__stage" aria-hidden="true">
          <svg
            className="v2-ms-constellation"
            viewBox="0 0 600 600"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {ANGLES.map((_, i) => (
                <path key={i} id={`ms-spoke-${i}`} d={spokePath(tilePos(ANGLES[i]))} />
              ))}
              <radialGradient id="ms-hub-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--v2-motion-trace)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--v2-motion-trace)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Spokes — drawn first so tiles + hub stack above */}
            <g className="v2-ms-spokes">
              {ANGLES.map((_, i) => {
                const on = active === i || active === "hub";
                return (
                  <use
                    key={i}
                    href={`#ms-spoke-${i}`}
                    className={"v2-ms-spoke" + (on ? " v2-ms-spoke--on" : "")}
                  />
                );
              })}
            </g>

            {/* Hub glow + ring + label */}
            <g className="v2-ms-hub">
              <circle cx={CENTER} cy={CENTER} r="120" fill="url(#ms-hub-glow)" className="v2-ms-hub__glow" />
              <circle
                cx={CENTER}
                cy={CENTER}
                r="56"
                className="v2-ms-hub__ring"
                onMouseEnter={() => setActive("hub")}
                onMouseLeave={() => setActive(null)}
              />
              <circle cx={CENTER} cy={CENTER} r="46" className="v2-ms-hub__inner" />
              <text x={CENTER} y={CENTER + 4} className="v2-ms-hub__label" textAnchor="middle">
                {hubLabel}
              </text>
            </g>

            {/* Tokens — small dots flow from each tile INTO the hub */}
            <g className="v2-ms-tokens">
              {ANGLES.map((_, i) => (
                <g key={i}>
                  <circle r="10" fill="url(#ms-hub-glow)">
                    <animateMotion dur={`${2.8 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.32}s`}>
                      <mpath xlinkHref={`#ms-spoke-${i}`} />
                    </animateMotion>
                  </circle>
                  <circle r="3.5" fill="var(--v2-motion-trace)">
                    <animateMotion dur={`${2.8 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.32}s`}>
                      <mpath xlinkHref={`#ms-spoke-${i}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}
            </g>

            {/* Service tiles — drawn last so they sit on top */}
            <g className="v2-ms-tiles">
              {ANGLES.map((deg, i) => {
                const p = tilePos(deg);
                const on = active === i;
                const dim = active !== null && active !== i && active !== "hub";
                return (
                  <g
                    key={i}
                    className={
                      "v2-ms-tile" +
                      (on ? " v2-ms-tile--on" : "") +
                      (dim ? " v2-ms-tile--dim" : "")
                    }
                    transform={`translate(${p.x}, ${p.y})`}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <circle r="44" className="v2-ms-tile__plate" />
                    <g className="v2-ms-tile__icon" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                      {ICONS[i]}
                    </g>
                    <text y="62" className="v2-ms-tile__label" textAnchor="middle">
                      {services[i]}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
