"use client";

/**
 * NodeGraphBackdrop — quiet 12-node graph rendered to a full-bleed canvas
 * behind the Home V2 hero. Packets travel along edges in the v2 motion-trace
 * teal (`--v2-motion-trace` = #14B8A6). ~3 KB gz, no three.js — matches
 * Round-0 motion-stack decision (docs/research/decisions.md §3).
 *
 * Bypassed entirely on `prefers-reduced-motion: reduce` (returns null) and
 * paused when the document tab is hidden (Page Visibility).
 */

import { useEffect, useRef, useState } from "react";

const NODE_COUNT = 12;
const EDGE_PER_NODE = 2; // nearest-neighbour edges per node
const PACKET_INTERVAL_MS = 1800;
const PACKET_SPEED = 0.00045; // progress per ms
const NODE_RADIUS = 3;
const GRAPH_OPACITY = 0.42;

type Node = { x: number; y: number };
type Edge = { a: number; b: number };
type Packet = { edge: number; t: number; reverse: boolean };

/** Mulberry32 — tiny deterministic PRNG so layout is stable across renders. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(w: number, h: number, seed = 73): { nodes: Node[]; edges: Edge[] } {
  const r = rng(seed);
  const nodes: Node[] = [];
  // Poisson-ish: place nodes in cells with jitter so layout reads organic but
  // never clusters.
  const cols = 4;
  const rows = 3;
  const cellW = w / cols;
  const cellH = h / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      nodes.push({
        x: cellW * (col + 0.25 + r() * 0.5),
        y: cellH * (row + 0.25 + r() * 0.5),
      });
      if (nodes.length === NODE_COUNT) break;
    }
  }

  // Each node links to its k-nearest neighbours; dedupe to a single direction.
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const distances = nodes
      .map((n, j) => ({ j, d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, EDGE_PER_NODE);
    for (const { j } of distances) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ a: Math.min(i, j), b: Math.max(i, j) });
    }
  }
  return { nodes, edges };
}

export function NodeGraphBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    const packets: Packet[] = [];
    let lastSpawn = performance.now();
    let lastFrame = performance.now();
    let dpr = window.devicePixelRatio || 1;
    let cssWidth = 0;
    let cssHeight = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const built = buildGraph(cssWidth, cssHeight);
      nodes = built.nodes;
      edges = built.edges;
    };

    /** Resolve the v2 motion-trace teal from CSS. */
    const resolveAccent = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--v2-motion-trace")
        .trim();
      return v || "#14B8A6";
    };

    let accent = resolveAccent();

    const draw = (now: number) => {
      const dt = now - lastFrame;
      lastFrame = now;

      // Spawn new packets on random edges.
      if (now - lastSpawn > PACKET_INTERVAL_MS && edges.length > 0) {
        const edge = Math.floor(Math.random() * edges.length);
        packets.push({ edge, t: 0, reverse: Math.random() < 0.5 });
        lastSpawn = now;
      }

      // Advance + cull packets.
      for (let i = packets.length - 1; i >= 0; i--) {
        packets[i].t += dt * PACKET_SPEED;
        if (packets[i].t >= 1) packets.splice(i, 1);
      }

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Edges — thin, low-opacity strokes.
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(127,127,127,${GRAPH_OPACITY * 0.32})`;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Nodes — small circles, dimmer than packets.
      ctx.fillStyle = `rgba(127,127,127,${GRAPH_OPACITY * 0.85})`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // Packets — verdigris, with a soft trail behind.
      for (const p of packets) {
        const e = edges[p.edge];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const t = p.reverse ? 1 - p.t : p.t;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;

        // Glow underlay
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    };

    let rafId = 0;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (rafId === 0) {
        lastFrame = performance.now();
        rafId = requestAnimationFrame(draw);
      }
    };

    const onResize = () => resize();
    const themeObserver = new MutationObserver(() => {
      accent = resolveAccent();
    });

    resize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-preview"],
    });
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="v2-node-graph"
    />
  );
}
