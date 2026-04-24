"use client";

import { useEffect, useRef } from "react";

/**
 * BreathingSilhouette — Kutasia page centerpiece.
 * Ported from the Claude Design v2 bundle (components/BreathingSilhouette.jsx).
 *
 * Three-layer SVG dining-room silhouette with cursor-driven parallax
 * (0.3× / 0.8× / 1.4× depth response), a pendant-glow pulse, drifting
 * steam over the centre plate, candle flame flicker, and slow wine-glass
 * rim glints. Animations are CSS keyframes in opsolid-kutasia.css so the
 * component stays declarative. `prefers-reduced-motion` zeros the
 * parallax and the keyframes freeze via the global reduce-motion rule.
 *
 * The readout strip is decorative demo data (covers / menu / rooms) —
 * illustrates the actual Kutasia service-desk UI.
 */
export function BreathingSilhouette() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<SVGSVGElement | null>(null);
  const midRef = useRef<SVGSVGElement | null>(null);
  const frontRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 10;
      ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 6;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    const tick = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      if (bgRef.current)
        bgRef.current.style.transform = `translate(${(px * 0.3).toFixed(
          2,
        )}px, ${(py * 0.3).toFixed(2)}px)`;
      if (midRef.current)
        midRef.current.style.transform = `translate(${(px * 0.8).toFixed(
          2,
        )}px, ${(py * 0.8).toFixed(2)}px)`;
      if (frontRef.current)
        frontRef.current.style.transform = `translate(${(px * 1.4).toFixed(
          2,
        )}px, ${(py * 1.4).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="ks-stage" ref={stageRef} aria-hidden="true">
      <div className="ks-vignette" />

      {/* Back — wall, hanging pendant glow */}
      <svg
        className="ks-layer ks-bg"
        ref={bgRef}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="ksPendant" cx="0.5" cy="0.4" r="0.45">
            <stop offset="0" stopColor="rgba(233,185,137,0.55)" />
            <stop offset="0.4" stopColor="rgba(212,162,58,0.2)" />
            <stop offset="1" stopColor="rgba(212,162,58,0)" />
          </radialGradient>
          <linearGradient id="ksWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A140F" />
            <stop offset="0.6" stopColor="#0D0A07" />
            <stop offset="1" stopColor="#060503" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#ksWall)" />
        <g opacity="0.08" stroke="#3B2A1A" strokeWidth="0.5">
          {Array.from({ length: 24 }).map((_, r) => (
            <line key={r} x1="0" y1={r * 28} x2="800" y2={r * 28} />
          ))}
        </g>
        <path
          d="M 540 40 Q 640 20 740 40 L 740 220 Q 640 210 540 220 Z"
          fill="none"
          stroke="rgba(212,162,58,0.2)"
          strokeWidth="1"
        />
        <path
          d="M 540 40 Q 640 20 740 40 L 740 220 Q 640 210 540 220 Z"
          fill="rgba(80,60,40,0.25)"
        />
        <ellipse
          cx="400"
          cy="240"
          rx="340"
          ry="180"
          fill="url(#ksPendant)"
          className="ks-glow"
        />
      </svg>

      {/* Middle — dining table, plates, steam */}
      <svg
        className="ks-layer ks-mid"
        ref={midRef}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ksTable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2C2017" />
            <stop offset="0.5" stopColor="#1A110B" />
            <stop offset="1" stopColor="#0A0604" />
          </linearGradient>
          <radialGradient id="ksPlate" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#F5D9B8" />
            <stop offset="0.7" stopColor="#B8875A" />
            <stop offset="1" stopColor="#3B2818" />
          </radialGradient>
        </defs>
        <path d="M 0 400 L 800 400 L 800 600 L 0 600 Z" fill="url(#ksTable)" />
        <path
          d="M 0 400 L 800 400"
          stroke="rgba(233,185,137,0.35)"
          strokeWidth="1.2"
        />
        {[
          { x: 200, r: 48 },
          { x: 400, r: 56 },
          { x: 600, r: 48 },
        ].map((p, i) => (
          <g key={i}>
            <ellipse
              cx={p.x}
              cy="450"
              rx={p.r}
              ry={p.r * 0.35}
              fill="#0A0604"
              opacity="0.7"
            />
            <ellipse
              cx={p.x}
              cy="448"
              rx={p.r * 0.94}
              ry={p.r * 0.33}
              fill="url(#ksPlate)"
              opacity="0.85"
            />
            <ellipse
              cx={p.x}
              cy="446"
              rx={p.r * 0.55}
              ry={p.r * 0.18}
              fill="#1A0E04"
              opacity="0.55"
            />
            <circle cx={p.x + (i - 1) * 6} cy="444" r="2.5" fill="#D4A23A" />
          </g>
        ))}
        <g opacity="0.7">
          {[0, 1, 2, 3].map((k) => (
            <path
              key={k}
              d={`M ${394 + k * 3} 430 Q ${400 + k * 2} 400 ${392 + k * 3} 370 Q ${404 + k * 3} 340 ${396 + k * 2} 310`}
              fill="none"
              stroke="rgba(245,217,184,0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="ks-steam"
              style={{ animationDelay: (k * 0.6).toFixed(1) + "s" }}
            />
          ))}
        </g>
      </svg>

      {/* Front — wine glasses, candle, figures in silhouette */}
      <svg
        className="ks-layer ks-front"
        ref={frontRef}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ksWine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8A2A2F" />
            <stop offset="0.7" stopColor="#5C1A1E" />
            <stop offset="1" stopColor="#3A0F12" />
          </linearGradient>
          <radialGradient id="ksCandle" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFE9B8" />
            <stop offset="0.5" stopColor="#E9B989" />
            <stop offset="1" stopColor="rgba(233,185,137,0)" />
          </radialGradient>
        </defs>

        <g fill="#050303">
          <path d="M 60 600 L 60 420 Q 80 380 110 375 Q 140 370 155 390 Q 170 360 162 330 Q 158 310 140 305 Q 120 300 112 320 Q 108 340 120 355 Q 105 360 92 380 Q 78 395 75 420 L 75 600 Z" />
          <path d="M 740 600 L 740 420 Q 720 380 690 375 Q 660 370 645 390 Q 630 360 638 330 Q 642 310 660 305 Q 680 300 688 320 Q 692 340 680 355 Q 695 360 708 380 Q 722 395 725 420 L 725 600 Z" />
        </g>

        {[{ x: 260 }, { x: 540 }].map((g, i) => (
          <g key={i}>
            <line
              x1={g.x}
              y1="410"
              x2={g.x}
              y2="340"
              stroke="#1A110B"
              strokeWidth="1.6"
            />
            <path
              d={`M ${g.x - 20} 340 Q ${g.x - 22} 300 ${g.x} 290 Q ${g.x + 22} 300 ${g.x + 20} 340 Z`}
              fill="rgba(10,6,4,0.6)"
              stroke="rgba(245,217,184,0.5)"
              strokeWidth="1"
            />
            <path
              d={`M ${g.x - 18} 330 Q ${g.x - 20} 308 ${g.x} 304 Q ${g.x + 20} 308 ${g.x + 18} 330 Z`}
              fill="url(#ksWine)"
            />
            <path
              d={`M ${g.x - 8} 294 Q ${g.x + 4} 290 ${g.x + 12} 295`}
              fill="none"
              stroke="rgba(245,217,184,0.9)"
              strokeWidth="0.8"
              className="ks-glint"
              style={{ animationDelay: i * 1.2 + "s" }}
            />
            <ellipse cx={g.x} cy="410" rx="14" ry="3" fill="#1A110B" />
          </g>
        ))}

        <g transform="translate(400 390)">
          <rect x="-6" y="-30" width="12" height="30" fill="#F5D9B8" rx="1" />
          <line x1="0" y1="-30" x2="0" y2="-40" stroke="#1A110B" strokeWidth="1.2" />
          <path
            d="M -4 -40 Q 0 -58 4 -40 Q 2 -34 0 -33 Q -2 -34 -4 -40 Z"
            fill="#FFE9B8"
            className="ks-flame"
          />
          <circle cx="0" cy="-44" r="38" fill="url(#ksCandle)" className="ks-flame-glow" />
          <ellipse cx="0" cy="0" rx="14" ry="3" fill="#5C3B1A" />
        </g>
      </svg>

      <div className="ks-readout">
        <span className="ks-readout-row">
          <span>COVERS TONIGHT</span>
          <span className="ks-readout-val">84 / 92</span>
        </span>
        <span className="ks-readout-row">
          <span>MENU</span>
          <span className="ks-readout-val">OCT · TASTING VII</span>
        </span>
        <span className="ks-readout-row">
          <span>ROOMS</span>
          <span className="ks-readout-val">DINING · TERRACE · CHEF&rsquo;S</span>
        </span>
      </div>
    </div>
  );
}
