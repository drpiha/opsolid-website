"use client";

/**
 * Stage — the persistent 3D object behind every v4 marketing page.
 *
 * One object (a stack of seven plates, one per offering) re-forms as the
 * visitor scrolls. Pages mark sections with `data-scene="…"` and optional
 * `data-heat="0,1"` (plate indices to light up). All text is plain HTML; the
 * stage is decoration that loads after first paint:
 *  - three.js and GSAP ScrollTrigger are dynamic imports, started when idle
 *  - no WebGL, `prefers-reduced-motion` or the footer switch → static poster
 *  - small screens / touch → light mode (DPR 1, no reflections, 30 fps)
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { isV4Path } from "@/lib/v4";
import { stepVoice, voice } from "@/lib/voice-sim";

export const FX_STORAGE_KEY = "opsolid-fx";
export const FX_EVENT = "opsolid-fx-change";

import type { SceneId } from "@/components/v4/scenes";
type Pose = [number, number, number, number, number, number, number, number, number];

const LABELS: Record<"de" | "en" | "tr", { n: string; t: string }[]> = {
  de: [
    { n: "Agents", t: "Stimme · Video" },
    { n: "Websites", t: "Bau · Miete" },
    { n: "Prozessautomatisierung", t: "Abläufe" },
    { n: "Microsoft 365", t: "Outlook · Teams" },
    { n: "Interne Tools", t: "statt Tabelle" },
    { n: "KI-Beratung", t: "KI-Check" },
    { n: "KI-Schulungen", t: "Team" },
  ],
  en: [
    { n: "Agents", t: "Voice · Video" },
    { n: "Websites", t: "Build · Rent" },
    { n: "Process automation", t: "Workflows" },
    { n: "Microsoft 365", t: "Outlook · Teams" },
    { n: "Internal tools", t: "not a sheet" },
    { n: "AI consulting", t: "AI check" },
    { n: "AI training", t: "Team" },
  ],
  tr: [
    { n: "Agent'lar", t: "Ses · Video" },
    { n: "Web siteleri", t: "Kur · Kirala" },
    { n: "Süreç otomasyonu", t: "Akışlar" },
    { n: "Microsoft 365", t: "Outlook · Teams" },
    { n: "Dahili araçlar", t: "tablo yerine" },
    { n: "YZ danışmanlığı", t: "YZ kontrolü" },
    { n: "YZ eğitimleri", t: "Ekip" },
  ],
};

const sm = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const wrap = (a: number) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

function pose(scene: SceneId, i: number, t: number): Pose {
  const c = i - 3;
  switch (scene) {
    case "stack":
      return [0, -c * 0.4, 0, 0, c * 0.09, 0, 1, 1, 1];
    case "agents": {
      const a = (i / 7) * Math.PI * 2 + t * 0.25;
      return [Math.cos(a) * 2.1, Math.sin(a * 2 + i) * 0.1, Math.sin(a) * 2.1, 0, wrap(-(a + Math.PI / 2)), 0, 0.62, 0.8, 0.5];
    }
    case "websites":
      return [c * 0.64, 0.05 * (3 - Math.abs(c)), -Math.abs(c) * 0.3, Math.PI / 2, 0, c * -0.18, 0.55, 0.45, 0.72];
    case "flow":
      return [c * 0.8, 0, 0, 0, 0, 0, 0.34, 0.7, 0.5];
    case "steps":
      return [c * 0.56, c * 0.3, 0, 0, -0.35, 0, 0.45, 1, 0.65];
    case "cards":
      return [c * 0.34, 0, c * 0.16, Math.PI / 2, 0, c * 0.3, 0.6, 0.22, 0.62];
    case "offset":
      return [i % 2 ? 0.14 : -0.14, -c * 0.4, 0, 0, c * 0.05, 0, 1, 1, 1];
    default:
      return [0, -c * 0.37, 0, 0, 0, 0, 1, 0.95, 1];
  }
}

const GY: Record<SceneId, number> = { stack: -0.55, agents: 0, websites: 0, flow: 0, steps: -0.35, cards: -0.3, offset: -0.6, tight: 0.35 };
const GX: Record<SceneId, number> = { stack: 0.12, agents: 0.4, websites: 0.05, flow: 0.1, steps: 0.1, cards: 0.05, offset: 0.1, tight: 0.1 };
const GS: Record<SceneId, number> = { stack: 1, agents: 0.88, websites: 0.95, flow: 0.72, steps: 0.72, cards: 1, offset: 1, tight: 1 };
const GXO: Record<SceneId, number> = { stack: 0, agents: 0.05, websites: 0, flow: -0.01, steps: 0.07, cards: 0, offset: 0, tight: 0 };

const POSTER_SLABS = [
  ["#c27940", "#e0a070", "#8f4f1e"],
  ["#25231f", "#34312b", "#1c1a17"],
  ["#25231f", "#34312b", "#1c1a17"],
  ["#25231f", "#34312b", "#1c1a17"],
  ["#25231f", "#34312b", "#1c1a17"],
  ["#25231f", "#34312b", "#1c1a17"],
  ["#25231f", "#34312b", "#1c1a17"],
];

function Poster() {
  return (
    <div className="v4-poster" aria-hidden="true">
      <svg viewBox="0 0 320 330" role="presentation" focusable="false">
        <defs>
          <g id="v4sl">
            <polygon className="p-top" points="0,0 60,-22 300,-22 240,0" />
            <polygon className="p-side" points="240,0 300,-22 300,12 240,34" />
            <rect className="p-front" x="0" y="0" width="240" height="34" />
          </g>
        </defs>
        {POSTER_SLABS.map((c, i) => (
          <use
            key={i}
            href="#v4sl"
            x="10"
            y={60 + i * 38}
            style={{ ["--sf" as string]: c[0], ["--st" as string]: c[1], ["--ss" as string]: c[2] }}
          />
        ))}
      </svg>
    </div>
  );
}

type Core = {
  dispose: () => void;
  setLabels: (locale: "de" | "en" | "tr") => void;
  setScenes: (els: HTMLElement[]) => void;
};

async function createCore(host: HTMLElement, quality: "full" | "light", onFirstFrame: () => void): Promise<Core | null> {
  const THREE = await import("three");
  const gsapMod = await import("gsap");
  const stMod = await import("gsap/ScrollTrigger");
  const gsap = gsapMod.gsap ?? gsapMod.default;
  const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
  gsap.registerPlugin(ScrollTrigger);

  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: quality === "full", alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(quality === "full" ? Math.min(window.devicePixelRatio || 1, 2) : 1);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 9.5);
  scene.add(new THREE.AmbientLight(0xffffff, 1.3));
  const key = new THREE.DirectionalLight(0xffd8b0, 4.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xc27940, 90, 30, 2);
  rim.position.set(-5, -2, -4);
  scene.add(rim);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T): T => {
    disposables.push(o);
    return o;
  };

  // Environment reflections (full quality only)
  if (quality === "full") {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0d0c0a";
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#fff1dc";
    g.fillRect(60, 40, 120, 60);
    g.fillRect(330, 30, 100, 40);
    g.fillStyle = "#c27940";
    g.fillRect(230, 150, 50, 70);
    g.fillStyle = "#3a362f";
    g.fillRect(0, 200, 512, 56);
    const et = new THREE.CanvasTexture(c);
    et.mapping = THREE.EquirectangularReflectionMapping;
    et.colorSpace = THREE.SRGBColorSpace;
    const pm = new THREE.PMREMGenerator(renderer);
    const rt = pm.fromEquirectangular(et);
    scene.environment = rt.texture;
    track(rt);
    et.dispose();
    pm.dispose();
  }

  const group = new THREE.Group();
  scene.add(group);
  const box = track(new THREE.BoxGeometry(2.4, 0.34, 1.6));
  const egeo = track(new THREE.EdgesGeometry(box));

  const cs = getComputedStyle(document.body);
  const stack = (a: string, b: string, fb: string) => [cs.getPropertyValue(a).trim(), cs.getPropertyValue(b).trim(), fb].filter(Boolean).join(", ");
  const fontFamily = stack("--font-archivo", "--font-archivo-ext", "Archivo, sans-serif");
  const monoFamily = stack("--font-plex-mono", "--font-plex-mono-ext", "monospace");
  try {
    await Promise.race([
      Promise.all([document.fonts.load(`800 62px ${fontFamily}`), document.fonts.load(`500 24px ${monoFamily}`)]),
      new Promise((r) => setTimeout(r, 1200)),
    ]);
  } catch {
    /* fall back to whatever is available */
  }

  const topCanvas = document.createElement("canvas");
  topCanvas.width = 512;
  topCanvas.height = 340;
  {
    const g = topCanvas.getContext("2d")!;
    g.fillStyle = "#25231f";
    g.fillRect(0, 0, 512, 340);
    g.fillStyle = "#c27940";
    g.fillRect(0, 0, 512, 26);
    g.fillStyle = "#1d1b18";
    [14, 30, 46].forEach((x) => {
      g.beginPath();
      g.arc(x, 13, 4, 0, 6.3);
      g.fill();
    });
    g.strokeStyle = "rgba(194,121,64,.55)";
    g.lineWidth = 1.5;
    for (let x = 0; x <= 512; x += 16) {
      g.beginPath();
      g.moveTo(x, 340);
      g.lineTo(x, x % 80 === 0 ? 312 : 326);
      g.stroke();
    }
    g.strokeStyle = "rgba(194,121,64,.25)";
    g.beginPath();
    g.moveTo(256, 70);
    g.lineTo(256, 270);
    g.moveTo(156, 170);
    g.lineTo(356, 170);
    g.stroke();
    g.strokeRect(176, 110, 160, 120);
  }
  const topTex = track(new THREE.CanvasTexture(topCanvas));
  topTex.colorSpace = THREE.SRGBColorSpace;
  topTex.anisotropy = 4;

  const envI = quality === "full" ? 0.5 : 0;
  type Slab = {
    m: InstanceType<typeof THREE.Mesh>;
    mats: InstanceType<typeof THREE.MeshStandardMaterial>[];
    lab: InstanceType<typeof THREE.MeshStandardMaterial>;
    edge: InstanceType<typeof THREE.LineBasicMaterial>;
    heat: number;
  };
  const slabs: Slab[] = [];
  for (let i = 0; i < 7; i++) {
    const body = track(new THREE.MeshStandardMaterial({ color: 0x1f1d1a, metalness: 0.55, roughness: 0.45, envMapIntensity: envI }));
    const lab = track(new THREE.MeshStandardMaterial({ metalness: 0.35, roughness: 0.5, envMapIntensity: envI }));
    const tp = track(new THREE.MeshStandardMaterial({ map: topTex, metalness: 0.35, roughness: 0.5, envMapIntensity: envI }));
    const m = new THREE.Mesh(box, [body, body, tp, body, lab, lab]);
    const edge = track(new THREE.LineBasicMaterial({ color: 0xe0a070, transparent: true, opacity: 0.45 }));
    const lines = new THREE.LineSegments(egeo, edge);
    lines.visible = quality === "full";
    m.add(lines);
    group.add(m);
    slabs.push({ m, mats: [body, lab, tp], lab, edge, heat: 0 });
  }

  const labelTextures: InstanceType<typeof THREE.CanvasTexture>[] = [];
  const setLabels = (locale: "de" | "en" | "tr") => {
    labelTextures.splice(0).forEach((t) => t.dispose());
    LABELS[locale].forEach((d, i) => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 145;
      const g = c.getContext("2d")!;
      g.fillStyle = "#1d1b18";
      g.fillRect(0, 0, 1024, 145);
      g.fillStyle = "#c27940";
      g.font = `800 62px ${fontFamily}`;
      g.textBaseline = "middle";
      g.fillText(d.n, 34, 74);
      g.fillStyle = "#8a8378";
      g.font = `500 24px ${monoFamily}`;
      g.textAlign = "right";
      g.fillText(d.t.toUpperCase(), 990, 76);
      g.fillStyle = "#c27940";
      g.fillRect(0, 0, 1024, 3);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      slabs[i].lab.map = t;
      slabs[i].lab.needsUpdate = true;
      labelTextures.push(t);
    });
  };

  const rail = new THREE.Mesh(track(new THREE.BoxGeometry(6.4, 0.05, 0.9)), track(new THREE.MeshStandardMaterial({ color: 0x1d1b18, metalness: 0.5, roughness: 0.5 })));
  rail.position.y = -0.36;
  rail.scale.x = 0.001;
  group.add(rail);
  const railEdge = track(new THREE.LineBasicMaterial({ color: 0xc27940 }));
  rail.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(rail.geometry)), railEdge));

  // Agent head
  const head = new THREE.Group();
  group.add(head);
  head.add(new THREE.Mesh(track(new THREE.SphereGeometry(0.95, 48, 32)), track(new THREE.MeshStandardMaterial({ color: 0x2b2925, metalness: 0.5, roughness: 0.32, envMapIntensity: envI }))));
  head.add(
    new THREE.Mesh(
      track(new THREE.SphereGeometry(0.965, 40, 12, Math.PI / 2 - 0.95, 1.9, 1.05, 0.45)),
      track(new THREE.MeshStandardMaterial({ color: 0xc27940, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide, envMapIntensity: envI })),
    ),
  );
  const eyeM = track(new THREE.MeshBasicMaterial({ color: 0xffe3c4 }));
  const eyeG = track(new THREE.CircleGeometry(0.065, 20));
  [-1, 1].forEach((s) => {
    const e = new THREE.Mesh(eyeG, eyeM);
    e.position.set(s * 0.3, 0.2, Math.sqrt(0.965 * 0.965 - 0.09 - 0.04) + 0.01);
    head.add(e);
  });
  const mouthM = track(new THREE.MeshBasicMaterial({ color: 0xe0a070 }));
  const mouthG = track(new THREE.BoxGeometry(0.05, 0.1, 0.04));
  const mouth: InstanceType<typeof THREE.Mesh>[] = [];
  for (let k = 0; k < 9; k++) {
    const x = (k - 4) * 0.11;
    const mb = new THREE.Mesh(mouthG, mouthM);
    mb.position.set(x, -0.33, Math.sqrt(0.965 * 0.965 - x * x - 0.33 * 0.33) + 0.01);
    head.add(mb);
    mouth.push(mb);
  }
  const halo = new THREE.Mesh(track(new THREE.TorusGeometry(1.4, 0.014, 8, 100)), track(new THREE.MeshBasicMaterial({ color: 0xc27940, transparent: true, opacity: 0.8 })));
  halo.rotation.x = Math.PI / 2.15;
  head.add(halo);
  head.scale.setScalar(0.0001);
  head.visible = false;

  // ---- layout + sizing
  const layout = { x: 0, y: 0, s: 1, w: 0 };
  const small = () => window.innerWidth < 760;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * 9.5 * Math.tan((17.5 * Math.PI) / 180);
    const visW = visH * (w / h);
    if (small()) {
      layout.x = 0;
      layout.y = visH * 0.2;
      layout.s = Math.min(1, visW / 5.4);
      layout.w = 0;
    } else {
      layout.x = visW * 0.2;
      layout.y = 0;
      layout.s = Math.min(1.15, visH / 5.6);
      layout.w = visW;
    }
  };
  resize();
  window.addEventListener("resize", resize);

  // ---- scenes (DOM-driven)
  let sceneEls: HTMLElement[] = [];
  let triggers: InstanceType<typeof ScrollTrigger>[] = [];
  let activeIdx = 0;
  const progress: number[] = [];
  let fA: SceneId = "stack";
  let fB: SceneId = "stack";
  let fU = 0;
  let heatNow: number[] = [];
  const parseHeat = (el: HTMLElement | undefined): number[] =>
    (el?.dataset.heat ?? "").split(",").map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n));
  const sceneOf = (el: HTMLElement | undefined): SceneId => ((el?.dataset.scene as SceneId) ?? "stack");
  const recompute = () => {
    const i = Math.min(activeIdx, Math.max(0, sceneEls.length - 1));
    const p = progress[i] ?? 0;
    const cur = sceneEls[i];
    const nxt = sceneEls[i + 1];
    fA = sceneOf(cur);
    fB = nxt ? sceneOf(nxt) : fA;
    fU = nxt ? sm((p - 0.5) / 0.5) : 0;
    heatNow = parseHeat(fU > 0.5 && nxt ? nxt : cur);
    const dimEl = fU > 0.5 && nxt ? nxt : cur;
    if (dimEl?.dataset.dim) document.documentElement.setAttribute("data-dim", "1");
    else document.documentElement.removeAttribute("data-dim");
  };
  const setScenes = (els: HTMLElement[]) => {
    triggers.forEach((t) => t.kill());
    triggers = [];
    sceneEls = els;
    activeIdx = 0;
    if (els.length === 0) document.documentElement.setAttribute("data-dim", "2");
    else document.documentElement.removeAttribute("data-dim");
    els.forEach((el, i) => {
      progress[i] = 0;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              activeIdx = i;
              recompute();
            }
          },
          onUpdate: (self) => {
            progress[i] = self.progress;
            if (self.isActive) {
              activeIdx = i;
              recompute();
            }
          },
        }),
      );
    });
    recompute();
    ScrollTrigger.refresh();
  };

  // ---- render loop
  let running = true;
  let raf = 0;
  let T = 0;
  let last = performance.now();
  let frame = 0;
  let first = false;
  const pointer = { x: 0, y: 0 };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });
  const onVis = () => {
    last = performance.now();
  };
  document.addEventListener("visibilitychange", onVis);

  // current blended parameters, eased
  const cur = { gy: 0, gx: 0, gs: 1, gxo: 0 };
  let curHeadW = 0;
  let curRailW = 0;

  const update = (dt: number) => {
    const u = fU;
    const w = (id: SceneId) => (fA === fB ? (fA === id ? 1 : 0) : (fA === id ? 1 - u : 0) + (fB === id ? u : 0));
    slabs.forEach((s, i) => {
      const a = pose(fA, i, T);
      const b = pose(fB, i, T);
      s.m.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u));
      s.m.rotation.set(lerp(a[3], b[3], u), lerp(a[4], b[4], u), lerp(a[5], b[5], u));
      s.m.scale.set(lerp(a[6], b[6], u), lerp(a[7], b[7], u), lerp(a[8], b[8], u));
      s.m.position.y += Math.sin(T * 2.2 - i * 0.9) * 0.1 * w("flow");
      const tg = heatNow.includes(i) ? 1 : 0;
      s.heat += (tg - s.heat) * Math.min(1, dt * 5);
      const e = s.heat * 0.32;
      s.mats.forEach((mt) => mt.emissive.setRGB(0.76 * e, 0.47 * e, 0.25 * e));
      s.edge.opacity = 0.45 + 0.5 * s.heat;
    });
    const headW = w("agents");
    const railW = w("flow");
    curHeadW += (headW - curHeadW) * Math.min(1, dt * 6);
    curRailW += (railW - curRailW) * Math.min(1, dt * 6);
    rail.scale.x = Math.max(0.001, sm(curRailW));
    head.visible = curHeadW > 0.02;
    head.scale.setScalar(Math.max(0.0001, sm(curHeadW)));
    if (head.visible) {
      const amp = stepVoice(T);
      mouth.forEach((mb, i) => {
        mb.scale.y = 0.12 + amp * (0.5 + 0.5 * Math.sin(T * 11 + i * 1.3)) * 1.9;
      });
      head.rotation.y = Math.sin(T * 0.8) * 0.18 + pointer.x * 0.3;
      head.rotation.x = Math.sin(T * 1.3) * 0.04 + (amp > 0.3 ? 0.04 : 0) - pointer.y * 0.15;
      const ps = 1 + amp * 0.08 + (voice.mode === "listen" ? 0.03 * Math.sin(T * 4) : 0);
      halo.scale.set(ps, ps, ps);
      halo.rotation.z = T * 0.4;
    }
    const tgt = {
      gy: lerp(GY[fA], GY[fB], u),
      gx: lerp(GX[fA], GX[fB], u),
      gs: lerp(GS[fA], GS[fB], u),
      gxo: lerp(GXO[fA], GXO[fB], u),
    };
    const k = Math.min(1, dt * 5);
    cur.gy += (tgt.gy - cur.gy) * k;
    cur.gx += (tgt.gx - cur.gx) * k;
    cur.gs += (tgt.gs - cur.gs) * k;
    cur.gxo += (tgt.gxo - cur.gxo) * k;
    group.rotation.y = cur.gy + Math.sin(T * 0.35) * 0.07 + (coarse ? 0 : pointer.x * 0.22);
    group.rotation.x = cur.gx - (coarse ? 0 : pointer.y * 0.1);
    group.position.set(layout.x + cur.gxo * layout.w, layout.y + Math.sin(T * 0.6) * 0.05, 0);
    group.scale.setScalar(layout.s * cur.gs);
  };

  const loop = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    frame++;
    if (quality === "light" && frame % 2) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    T += dt;
    update(dt);
    renderer.render(scene, camera);
    if (!first) {
      first = true;
      onFirstFrame();
    }
  };
  raf = requestAnimationFrame(loop);

  return {
    setLabels,
    setScenes,
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      triggers.forEach((t) => t.kill());
      labelTextures.forEach((t) => t.dispose());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function Stage() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const hostRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<Core | null>(null);
  const [ready, setReady] = useState(false);
  const v4 = isV4Path(pathname);
  const loc: "de" | "en" | "tr" = locale === "de" || locale === "tr" ? locale : "en";

  // Start the 3D core once, after first paint and when the browser is idle.
  useEffect(() => {
    if (!v4) return;
    let cancelled = false;
    let idleId = 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let off = false;
    try {
      off = window.localStorage.getItem(FX_STORAGE_KEY) === "off";
    } catch {
      /* storage unavailable */
    }
    const gl = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    const stop = () => {
      coreRef.current?.dispose();
      coreRef.current = null;
      setReady(false);
      document.documentElement.removeAttribute("data-stage");
      document.documentElement.removeAttribute("data-dim");
    };
    const start = () => {
      if (coreRef.current || !hostRef.current) return;
      const quality = window.innerWidth < 760 || window.matchMedia("(pointer: coarse)").matches ? "light" : "full";
      createCore(hostRef.current, quality, () => {
        if (cancelled) return;
        setReady(true);
        document.documentElement.setAttribute("data-stage", quality);
      })
        .then((core) => {
          if (cancelled || !core) {
            core?.dispose();
            return;
          }
          coreRef.current = core;
          core.setLabels(loc);
          core.setScenes(Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")));
        })
        .catch(() => {
          /* poster stays */
        });
    };

    // The static poster is the first frame. The 3D core (three.js + GSAP, ~210 kB gz) starts on the
    // first sign of a person (pointer, scroll, touch, key), or after 8 s for someone just watching,
    // so it never competes with first paint, hydration or an automated audit's quiet window.
    const INTENT = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;
    const onIntent = () => {
      INTENT.forEach((e) => window.removeEventListener(e, onIntent));
      window.clearTimeout(idleId);
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(start, { timeout: 600 });
      else window.setTimeout(start, 50);
    };
    if (!prefersReduced && !off && gl) {
      INTENT.forEach((e) => window.addEventListener(e, onIntent, { passive: true, once: true }));
      idleId = window.setTimeout(onIntent, 8000);
    }
    const onFx = () => {
      let nowOff = false;
      try {
        nowOff = window.localStorage.getItem(FX_STORAGE_KEY) === "off";
      } catch {
        /* ignore */
      }
      if (nowOff) stop();
      else if (!prefersReduced && gl) start();
    };
    window.addEventListener(FX_EVENT, onFx);
    return () => {
      cancelled = true;
      if (idleId) window.clearTimeout(idleId);
      INTENT.forEach((e) => window.removeEventListener(e, onIntent));
      window.removeEventListener(FX_EVENT, onFx);
      stop();
    };
    // locale handled in its own effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v4]);

  useEffect(() => {
    coreRef.current?.setLabels(loc);
  }, [loc]);

  // Re-collect scene sections whenever the route changes.
  useEffect(() => {
    if (!v4) return;
    const id = window.setTimeout(() => {
      coreRef.current?.setScenes(Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")));
    }, 250);
    return () => window.clearTimeout(id);
  }, [pathname, v4]);

  if (!v4) return null;
  return (
    <>
      <Poster />
      <div ref={hostRef} className={`v4-stage${ready ? " is-on" : ""}`} aria-hidden="true" />
    </>
  );
}
