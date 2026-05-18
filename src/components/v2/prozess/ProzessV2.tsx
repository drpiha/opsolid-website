"use client";

/**
 * ProzessV2 — Live Process Map with mouse-reactive depth.
 *
 * Three parallax depth layers, all driven by a single normalized mouse
 * position (-1..1 on each axis) exposed as CSS vars `--mx`/`--my` on the
 * section root:
 *   Layer 0 (far)   — dot grid backdrop, lazy parallax + opposite-axis drift
 *   Layer 1 (mid)   — the BPMN diagram itself, light tilt + translate
 *   Layer 2 (near)  — token dots & active-node pulses, stronger translate
 *
 * Motion logic:
 *   - On mount each stroke draws itself in sequence (~2.6s)
 *   - Verdigris token dots ride the arrows via <animateMotion>
 *   - Two active nodes pulse with a soft glow
 *   - Mouse moves → RAF lerp eases CSS vars toward target → layers shift
 *
 * Reduced-motion: parallax disabled, draw skipped, tokens hidden.
 */

import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  V2WhatWeDo,
  V2UseCases,
  V2Process,
  V2FinalCta,
} from "@/components/v2/services/ServiceSections";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

function BpmnMap() {
  return (
    <svg
      className="v2-prozess-map"
      viewBox="0 0 1400 520"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 Z" fill="currentColor" />
        </marker>
        <radialGradient id="nodePulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-signal)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent-signal)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tokenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-signal)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--accent-signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g
        className="v2-prozess-map__draw"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* === Row 1: main horizontal flow === */}
        <circle cx="80" cy="120" r="26" className="v2-prozess-map__shape" style={{ ["--d" as string]: "0ms" }} />
        <path id="flow-1" d="M 106 120 L 230 120" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "120ms" }} />
        <rect x="240" y="92" width="170" height="56" rx="8" className="v2-prozess-map__shape" style={{ ["--d" as string]: "260ms" }} />
        <path id="flow-2" d="M 410 120 L 530 120" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "380ms" }} />
        <polygon points="540,120 590,80 640,120 590,160" className="v2-prozess-map__shape" style={{ ["--d" as string]: "520ms" }} />
        <path id="flow-3" d="M 640 120 L 760 120" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "640ms" }} />
        <rect x="770" y="92" width="180" height="56" rx="8" className="v2-prozess-map__shape v2-prozess-map__shape--active" style={{ ["--d" as string]: "780ms" }} />
        <path id="flow-4" d="M 950 120 L 1080 120" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "900ms" }} />
        <circle cx="1110" cy="120" r="26" strokeWidth="2.5" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1040ms" }} />
        <circle cx="1110" cy="120" r="20" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1040ms" }} />

        {/* === Row 2: branched lane === */}
        <path id="flow-5" d="M 590 160 L 590 250" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "1180ms" }} />
        <rect x="500" y="260" width="180" height="56" rx="8" className="v2-prozess-map__shape v2-prozess-map__shape--active" style={{ ["--d" as string]: "1320ms" }} />
        <path id="flow-6" d="M 680 288 L 800 288" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "1460ms" }} />
        <polygon points="810,288 855,248 900,288 855,328" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1600ms" }} />
        <path id="flow-7" d="M 900 288 L 1010 288" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "1740ms" }} />
        <rect x="1020" y="260" width="160" height="56" rx="8" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1880ms" }} />

        {/* === Row 3: feedback loop === */}
        <path id="flow-8" d="M 1180 288 L 1240 288 L 1240 420 L 80 420 L 80 146" markerEnd="url(#arrowhead)" className="v2-prozess-map__path v2-prozess-map__path--feedback" style={{ ["--d" as string]: "2020ms" }} />

        {/* === Top mini lane === */}
        <rect x="240" y="380" width="140" height="44" rx="6" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1500ms" }} />
        <path d="M 380 402 L 480 402" markerEnd="url(#arrowhead)" className="v2-prozess-map__path" style={{ ["--d" as string]: "1620ms" }} />
        <rect x="490" y="380" width="160" height="44" rx="6" className="v2-prozess-map__shape" style={{ ["--d" as string]: "1740ms" }} />
      </g>

      {/* Pulse glows behind active nodes */}
      <g className="v2-prozess-map__pulses">
        <circle cx="860" cy="120" r="60" fill="url(#nodePulse)" className="v2-prozess-map__pulse" />
        <circle cx="590" cy="288" r="60" fill="url(#nodePulse)" className="v2-prozess-map__pulse" />
      </g>

      {/* Tokens — each is a small core dot + a soft outer halo riding the
          same path. Halos are larger and lower-opacity so each token reads
          as a glowing pulse rather than a flat dot. */}
      <g className="v2-prozess-map__tokens">
        {[
          { path: "#flow-1", dur: 3.4, begin: 2.6 },
          { path: "#flow-2", dur: 3.0, begin: 3.0 },
          { path: "#flow-3", dur: 3.0, begin: 3.4 },
          { path: "#flow-4", dur: 3.2, begin: 3.8 },
          { path: "#flow-5", dur: 2.6, begin: 3.6 },
          { path: "#flow-6", dur: 3.0, begin: 4.0 },
          { path: "#flow-7", dur: 2.8, begin: 4.4 },
        ].map((t, i) => (
          <g key={i}>
            <circle r="11" fill="url(#tokenGlow)">
              <animateMotion dur={`${t.dur}s`} repeatCount="indefinite" begin={`${t.begin}s`}>
                <mpath xlinkHref={t.path} />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="var(--accent-signal)">
              <animateMotion dur={`${t.dur}s`} repeatCount="indefinite" begin={`${t.begin}s`}>
                <mpath xlinkHref={t.path} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ProzessV2() {
  const { locale, t } = useLocale();
  const c = getV2Content(locale);
  const data = c.prozess;
  const svc = t.v2.services.prozessautomatisierung;
  const shared = t.v2.services.shared;
  const sectionRef = useRef<HTMLElement | null>(null);

  // Mouse tracker — normalized (-1..1) cursor position on the section as
  // CSS vars. RAF lerp smooths the value so layer transforms don't jitter.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const node = sectionRef.current;
    if (!node) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      node.style.setProperty("--mx", currentX.toFixed(4));
      node.style.setProperty("--my", currentY.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    node.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main>
    <section className="v2-prozess-hero" ref={sectionRef}>
      {/* Layer 0: dot-grid backdrop, deepest parallax. */}
      <div className="v2-prozess-grid" aria-hidden="true" />

      {/* Layer 1: the BPMN diagram. */}
      <div className="v2-prozess-map-wrap" aria-hidden="true">
        <BpmnMap />
      </div>

      {/* Layer 3: cursor-following verdigris spotlight (screen blend). */}
      <div className="v2-prozess-spotlight" aria-hidden="true" />

      {/* Layer 4 (foreground content, anchored left) */}
      <div className="v2-prozess-hero__inner">
        <span className="v2-prozess-hero__eyebrow">{data.eyebrow}</span>
        <h1 className="v2-prozess-hero__headline">{data.headline}</h1>
        <p className="v2-prozess-hero__lead">{data.lead}</p>
        <div className="v2-prozess-hero__cta-row">
          <Link href="/contact" className="btn btn-primary btn-lg" data-cursor="link">
            {data.ctaPrimary}
          </Link>
          <Link
            href="/leistungen"
            className="v2-home-hero__cta-secondary"
            data-cursor="link"
          >
            {data.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>

    <V2WhatWeDo
      eyebrow={shared.whatWeDoEyebrow}
      headline={svc.whatWeDo.headline}
      bullets={svc.whatWeDo.bullets}
    />

    <V2UseCases
      eyebrow={shared.useCasesEyebrow}
      headline={svc.useCases.headline}
      items={svc.useCases.items}
    />

    <V2Process
      eyebrow={shared.processEyebrow}
      headline={svc.process.headline}
      steps={svc.process.steps}
    />

    <FaqAccordion
      eyebrow={shared.faqEyebrow}
      headline={svc.faq.headline}
      items={svc.faq.items}
      id={`${svc.slug}-faq`}
    />

    <V2FinalCta
      eyebrow={shared.finalCtaEyebrow}
      title={svc.finalCta.title}
      lead={svc.finalCta.lead}
      ctaPrimary={svc.finalCta.ctaPrimary}
      ctaSecondary={svc.finalCta.ctaSecondary}
    />
    </main>
  );
}
