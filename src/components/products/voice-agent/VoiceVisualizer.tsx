"use client";

import { useEffect, useState } from "react";

/**
 * VoiceVisualizer — Voice Agent page centerpiece.
 *
 * Ported from the Claude Design v2 bundle (components/VoiceVisualizer.jsx).
 * Deterministic animation: a stacked, breathing audio stack — three
 * concentric ring bands whose amplitude follows a synthetic voice envelope,
 * a waveform strip, a playhead, and a transcript strip that advances in
 * sync. Click the central orb to pause / resume. Pure RAF, no Web Audio,
 * no mic access. Freezes cleanly under `prefers-reduced-motion`.
 *
 * The transcript is a bilingual DE + EN reservation demo (voice agent
 * handling a caller switching languages mid-call) — generic scenario with
 * no invented company references.
 */

const TRANSCRIPT: ReadonlyArray<{ t: number; speaker: "agent" | "caller"; text: string }> = [
  { t: 0.0, speaker: "agent", text: "Guten Tag, hier ist die digitale Rezeption. Wie kann ich helfen?" },
  { t: 6.2, speaker: "caller", text: "Hallo, I'd like to change my dinner reservation for tomorrow." },
  { t: 11.0, speaker: "agent", text: "Of course. Could you confirm the name on the reservation?" },
  { t: 16.8, speaker: "caller", text: "It's under Miller, party of four." },
  { t: 20.4, speaker: "agent", text: "Thank you. I see the 19:00 booking. Should I move it to 20:00?" },
  { t: 27.2, speaker: "caller", text: "Twenty-thirty if possible." },
  { t: 30.1, speaker: "agent", text: "Rescheduled to 20:30. Confirmation sent to your email." },
];
const LOOP = 36;
const BANDS = 28;
const BARS = 64;

function envelope(t: number, band: number): number {
  const active =
    (t > 0.1 && t < 5.8) ||
    (t > 6.4 && t < 10.6) ||
    (t > 11.2 && t < 16.4) ||
    (t > 17.0 && t < 20.0) ||
    (t > 20.6 && t < 26.8) ||
    (t > 27.4 && t < 29.8) ||
    (t > 30.3 && t < 35.4);
  const base = active ? 1 : 0.08;
  const osc =
    Math.sin(t * 6.1 + band * 0.7) * 0.5 +
    Math.sin(t * 13.4 + band * 1.3) * 0.3 +
    Math.sin(t * 27.7 + band * 2.1) * 0.2;
  return Math.max(0.04, base * (0.55 + osc * 0.45));
}

function mmss(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return m + ":" + ss;
}

export function VoiceVisualizer() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (playing) {
        setTime((t) => (t + dt) % LOOP);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const currentIdx = (() => {
    for (let i = TRANSCRIPT.length - 1; i >= 0; i--) {
      if (time >= TRANSCRIPT[i].t) return i;
    }
    return 0;
  })();
  const current = TRANSCRIPT[currentIdx];

  const bands = Array.from({ length: BANDS }, (_, i) => envelope(time, i));
  const bars = Array.from({ length: BARS }, (_, i) => {
    const localT = time - (BARS - 1 - i) * 0.12;
    return envelope(Math.max(0, localT % LOOP), i);
  });

  return (
    <div className="vv-stage" aria-hidden="true">
      <svg className="vv-scribe" viewBox="0 0 800 800">
        {(
          [
            [40, 40, 1, 1],
            [760, 40, -1, 1],
            [40, 760, 1, -1],
            [760, 760, -1, -1],
          ] as const
        ).map(([x, y, dx, dy], i) => (
          <g key={i} stroke="rgba(212,162,58,0.35)" strokeWidth="1.2" fill="none">
            <line x1={x} y1={y} x2={x + 22 * dx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 22 * dy} />
          </g>
        ))}
        <text
          x="44"
          y="28"
          fill="rgba(212,162,58,0.65)"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2"
        >
          LIVE · {current.speaker === "agent" ? "AGENT" : "CALLER"} · DE+EN
        </text>
        <text
          x="650"
          y="28"
          fill="rgba(255,255,255,0.35)"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2"
        >
          {mmss(time)} / {mmss(LOOP)}
        </text>
      </svg>

      <svg className="vv-radial" viewBox="-200 -200 400 400">
        <defs>
          <radialGradient id="vvGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(194,121,64,0.55)" />
            <stop offset="0.7" stopColor="rgba(194,121,64,0.08)" />
            <stop offset="1" stopColor="rgba(194,121,64,0)" />
          </radialGradient>
        </defs>
        <circle r="180" fill="url(#vvGlow)" opacity="0.8" />
        {[0, 1, 2].map((ring) => {
          const count = 72;
          const baseR = 78 + ring * 26;
          return (
            <g key={ring} opacity={0.92 - ring * 0.18}>
              {Array.from({ length: count }).map((_, i) => {
                const ang = (i / count) * Math.PI * 2 - Math.PI / 2;
                const bandIdx = (i + ring * 11) % BANDS;
                const amp = bands[bandIdx];
                const h = 6 + amp * (22 + ring * 8);
                const r1 = baseR;
                const r2 = baseR + h;
                const x1 = Math.cos(ang) * r1;
                const y1 = Math.sin(ang) * r1;
                const x2 = Math.cos(ang) * r2;
                const y2 = Math.sin(ang) * r2;
                const hot = amp > 0.55;
                const stroke =
                  ring === 0
                    ? hot
                      ? "rgba(233,185,137,0.95)"
                      : "rgba(221,162,102,0.7)"
                    : ring === 1
                    ? hot
                      ? "rgba(212,162,58,0.7)"
                      : "rgba(194,121,64,0.5)"
                    : hot
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(255,255,255,0.22)";
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      <button
        type="button"
        className={"vv-orb" + (playing ? " is-playing" : "")}
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause demo" : "Play demo"}
      >
        <span className="vv-orb-inner">
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M7 5v14l12-7Z" />
            </svg>
          )}
        </span>
      </button>

      <div className="vv-transcript">
        <div className="vv-tx-meta">
          <span
            className={"vv-tx-tag" + (current.speaker === "agent" ? " agent" : " caller")}
          >
            {current.speaker === "agent" ? "OPSOLID AGENT" : "CALLER"}
          </span>
          <span className="vv-tx-time">{mmss(current.t)}</span>
        </div>
        <div className="vv-tx-body">{current.text}</div>
      </div>

      <div className="vv-bars">
        {bars.map((v, i) => (
          <span
            key={i}
            className={"vv-bar" + (i === BARS - 1 ? " is-head" : "")}
            style={{ height: (6 + v * 36).toFixed(1) + "px" }}
          />
        ))}
      </div>

      <div className="vv-readouts">
        <div className="vv-readout">
          <span className="vv-readout-label">LATENCY</span>
          <span className="vv-readout-value">
            &lt;800 <em>ms p50</em>
          </span>
        </div>
        <div className="vv-readout">
          <span className="vv-readout-label">LANG</span>
          <span className="vv-readout-value">DE · EN · TR</span>
        </div>
        <div className="vv-readout">
          <span className="vv-readout-label">MODE</span>
          <span className="vv-readout-value">REAL-TIME · LIVE</span>
        </div>
      </div>
    </div>
  );
}
