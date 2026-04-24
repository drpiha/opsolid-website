"use client";

import { useEffect, useRef, useState } from "react";

/**
 * KineticMechanism — homepage centerpiece.
 * Machined rings + dilating central lens; rings rotate autonomously and
 * add subtle cursor-tracking tilt, central lens dilates toward cursor
 * position. 60fps via a single RAF loop. Freezes under prefers-reduced-motion.
 */
export function KineticMechanism() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const outerRingRef = useRef<HTMLDivElement | null>(null);
  const midRingRef = useRef<HTMLDivElement | null>(null);
  const coreRingRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetDilation = 0.5;
    let dilation = 0.5;
    let targetLensX = 0;
    let targetLensY = 0;
    let lensX = 0;
    let lensY = 0;

    let rotOuter = 0;
    let rotMid = 0;
    let rotCore = 0;

    const clamp = (v: number) => Math.max(-1.2, Math.min(1.2, v));

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      targetTiltX = clamp(dy) * 6;
      targetTiltY = clamp(dx) * 8;
      targetLensX = clamp(dx) * 10;
      targetLensY = clamp(dy) * 10;
      const dist = Math.min(1.6, Math.hypot(dx, dy));
      targetDilation = 0.25 + (1 - Math.min(1, dist / 1.2)) * 0.55;
    };

    const onLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      targetLensX = 0;
      targetLensY = 0;
      targetDilation = 0.5;
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    const tick = () => {
      const ease = 0.08;
      const easeLens = 0.11;
      const easeDil = 0.07;

      tiltX += (targetTiltX - tiltX) * ease;
      tiltY += (targetTiltY - tiltY) * ease;
      lensX += (targetLensX - lensX) * easeLens;
      lensY += (targetLensY - lensY) * easeLens;
      dilation += (targetDilation - dilation) * easeDil;

      if (!reduceMotion) {
        rotOuter += 0.08;
        rotMid -= 0.14;
        rotCore += 0.22;
      }

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotOuter}deg)`;
      }
      if (midRingRef.current) {
        midRingRef.current.style.transform = `rotateX(${tiltX * 1.4}deg) rotateY(${tiltY * 1.4}deg) rotateZ(${rotMid}deg)`;
      }
      if (coreRingRef.current) {
        coreRingRef.current.style.transform = `rotateX(${tiltX * 1.8}deg) rotateY(${tiltY * 1.8}deg) rotateZ(${rotCore}deg)`;
      }
      if (lensRef.current) {
        const iris = 0.3 + dilation * 0.7;
        const pupil = 1 - dilation * 0.55;
        lensRef.current.style.setProperty("--iris", iris.toFixed(3));
        lensRef.current.style.setProperty("--pupil", pupil.toFixed(3));
        lensRef.current.style.setProperty("--lens-x", lensX.toFixed(2) + "px");
        lensRef.current.style.setProperty("--lens-y", lensY.toFixed(2) + "px");
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const cornerBrackets: Array<[number, number]> = [
    [40, 40],
    [760, 40],
    [40, 760],
    [760, 760],
  ];

  return (
    <div
      ref={stageRef}
      className={"km-stage" + (mounted ? " is-mounted" : "")}
      aria-hidden="true"
    >
      <div className="km-aurora" />

      <svg className="km-scribe" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="kmScribeFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(255,255,255,0)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="400"
          x2="800"
          y2="400"
          stroke="url(#kmScribeFade)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <line
          x1="400"
          y1="0"
          x2="400"
          y2="800"
          stroke="url(#kmScribeFade)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        {cornerBrackets.map(([x, y], i) => {
          const dx = x < 400 ? 1 : -1;
          const dy = y < 400 ? 1 : -1;
          return (
            <g key={i} stroke="rgba(212,162,58,0.38)" strokeWidth="1.2" fill="none">
              <line x1={x} y1={y} x2={x + 22 * dx} y2={y} />
              <line x1={x} y1={y} x2={x} y2={y + 22 * dy} />
            </g>
          );
        })}
        <g opacity="0.5">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = 378;
            const r2 = i % 5 === 0 ? 366 : 372;
            const x1 = 400 + Math.cos(a) * r1;
            const y1 = 400 + Math.sin(a) * r1;
            const x2 = 400 + Math.cos(a) * r2;
            const y2 = 400 + Math.sin(a) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
            );
          })}
        </g>
        <text
          x="44"
          y="28"
          fill="rgba(212,162,58,0.65)"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2"
        >
          OPS-01 · SYNC 0000
        </text>
        <text
          x="710"
          y="28"
          fill="rgba(255,255,255,0.35)"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2"
        >
          FRA · DE
        </text>
      </svg>

      <div className="km-ring km-ring-outer" ref={outerRingRef}>
        <svg viewBox="0 0 400 400">
          <defs>
            <linearGradient id="kmOuterRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3D434F" />
              <stop offset="0.45" stopColor="#1A1E26" />
              <stop offset="1" stopColor="#0C0E13" />
            </linearGradient>
            <linearGradient id="kmOuterHi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,230,200,0.5)" />
              <stop offset="0.5" stopColor="rgba(255,230,200,0.04)" />
              <stop offset="1" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="198" fill="url(#kmOuterRim)" />
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="url(#kmOuterHi)"
            strokeWidth="1"
          />
          <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.2">
            {Array.from({ length: 120 }).map((_, i) => {
              const a = (i / 120) * Math.PI * 2;
              const r1 = 192;
              const r2 = 198;
              return (
                <line
                  key={i}
                  x1={200 + Math.cos(a) * r1}
                  y1={200 + Math.sin(a) * r1}
                  x2={200 + Math.cos(a) * r2}
                  y2={200 + Math.sin(a) * r2}
                />
              );
            })}
          </g>
          {[0, 90, 180, 270].map((deg, i) => {
            const a = ((deg - 45) * Math.PI) / 180;
            const cx = 200 + Math.cos(a) * 170;
            const cy = 200 + Math.sin(a) * 170;
            return (
              <g key={i} transform={`translate(${cx} ${cy})`}>
                <circle r="6" fill="#0A0C10" stroke="rgba(0,0,0,0.7)" strokeWidth="1" />
                <circle r="5.2" fill="url(#kmOuterRim)" />
                <line x1="-3" y1="0" x2="3" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              </g>
            );
          })}
          <path id="kmArcLabel" d="M 70 230 A 130 130 0 0 0 330 230" fill="none" />
          <text
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="9"
            fill="rgba(212,162,58,0.8)"
            letterSpacing="6"
          >
            <textPath href="#kmArcLabel" startOffset="4%">
              OPSOLID · PRECISION AUTOMATION · FRA-01
            </textPath>
          </text>
        </svg>
      </div>

      <div className="km-ring km-ring-mid" ref={midRingRef}>
        <svg viewBox="0 0 300 300">
          <defs>
            <linearGradient id="kmMidBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#50565F" />
              <stop offset="0.5" stopColor="#272B33" />
              <stop offset="1" stopColor="#15181E" />
            </linearGradient>
          </defs>
          <circle cx="150" cy="150" r="148" fill="url(#kmMidBase)" />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="rgba(0,0,0,0.7)"
            strokeWidth="2"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="rgba(255,230,200,0.2)"
            strokeWidth="0.8"
          />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2;
            const major = i % 3 === 0;
            const r1 = 128;
            const r2 = major ? 116 : 122;
            return (
              <line
                key={i}
                x1={150 + Math.cos(a) * r1}
                y1={150 + Math.sin(a) * r1}
                x2={150 + Math.cos(a) * r2}
                y2={150 + Math.sin(a) * r2}
                stroke={major ? "rgba(212,162,58,0.7)" : "rgba(255,255,255,0.35)"}
                strokeWidth={major ? 1.4 : 0.9}
              />
            );
          })}
          <g>
            <polygon
              points="150,12 144,28 156,28"
              fill="url(#kmMidBase)"
              stroke="rgba(212,162,58,0.9)"
              strokeWidth="1.2"
            />
            <circle cx="150" cy="20" r="2" fill="#E9B989" />
          </g>
        </svg>
      </div>

      <div className="km-ring km-ring-core" ref={coreRingRef}>
        <svg viewBox="0 0 220 220">
          <defs>
            <radialGradient id="kmCoreShadow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.45" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.7" />
            </radialGradient>
            <linearGradient id="kmCoreBevel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6B7280" />
              <stop offset="0.5" stopColor="#30343D" />
              <stop offset="1" stopColor="#13161C" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="108" fill="url(#kmCoreBevel)" />
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="#0A0C10"
            stroke="rgba(0,0,0,0.9)"
            strokeWidth="2"
          />
          <circle cx="110" cy="110" r="90" fill="url(#kmCoreShadow)" />
          {Array.from({ length: 6 }).map((_, i) => {
            const deg = i * 60;
            return (
              <g key={i} transform={`rotate(${deg} 110 110)`}>
                <path
                  d="M 110 22 L 120 36 L 100 36 Z"
                  fill="#C27940"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="0.8"
                />
                <circle cx="110" cy="30" r="2.2" fill="#F4D9A8" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="km-lens" ref={lensRef}>
        <div className="km-lens-iris" />
        <div className="km-lens-pupil" />
        <div className="km-lens-glint" />
        <div className="km-lens-flare" />
      </div>

      <div className="km-readout">
        <span className="km-readout-dot" />
        <span className="km-readout-text">LIVE · 42 WORKFLOWS · 3.4M EVENTS</span>
      </div>
    </div>
  );
}
