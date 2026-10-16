"use client";

/**
 * Stage: the persistent 3D object behind every v4 marketing page.
 *
 * One object (a stack of seven plates, one per offering) re-forms as the
 * visitor scrolls. Pages mark sections with `data-scene="…"` and optional
 * `data-heat="0,1"` (plate indices to light up). All text is plain HTML; the
 * stage is decoration that loads after first paint:
 *  - three.js and GSAP ScrollTrigger are dynamic imports, started on first user
 *    intent (or after 8 s), never during first paint or hydration
 *  - no WebGL, `prefers-reduced-motion` or the footer switch → static poster
 *  - phones / touch → light mode (DPR ≤ 1.5, no reflections, no bloom, no edge lines, 30 fps)
 *  - on desktop the object lives in the free column beside the text: its scale
 *    and position are fitted to the measured text column of the scene in view,
 *    so it does not sit on readable copy; on phones the text is on opaque
 *    panels below the object.
 */

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { usePathname } from "next/navigation";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { isV4Path, stripLocalePrefix } from "@/lib/v4";
import { stepVoice, voice } from "@/lib/voice-sim";
import type { SceneId } from "@/components/v4/scenes";

/** v4-themed routes with their own layout and no scenes: no 3D object (and no 3D code) there. */
const NO_STAGE = new Set(["opso", "impressum", "privacy"]);

export const FX_STORAGE_KEY = "opsolid-fx";
export const FX_EVENT = "opsolid-fx-change";

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

/** Real screenshots on the window planes (Websites / Produkte scenes). Plate index → file. */
const SHOTS: Record<number, string> = {
  3: "/img/v4/shot-opsolid.webp",
  2: "/img/v4/shot-card.webp",
  4: "/img/v4/shot-kutasia.webp",
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
/** Cubic in/out: slow start, decisive middle, slow settle. */
const easeInOut = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const wrap = (a: number) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

const HP = Math.PI / 2;
// Websites: a cascade of three real-screenshot panels (plates 3, 2, 4); the other four as thin blueprint sheets behind.
const WEB: Pose[] = [
  [-1.65, 1.15, -1.7, HP, 0, 0.2, 0.42, 0.3, 0.42],
  [-1.15, 1.6, -2.1, HP, 0, 0.14, 0.42, 0.3, 0.42],
  [0.25, 0.1, 0.15, HP, 0, 0.12, 0.88, 0.3, 0.88],
  [-0.65, 1.3, -0.55, HP, 0, 0.12, 0.88, 0.3, 0.88],
  [0.95, -1.15, 0.85, HP, 0, 0.12, 0.88, 0.3, 0.88],
  [1.65, 1.15, -1.7, HP, 0, -0.2, 0.42, 0.3, 0.42],
  [1.15, 1.6, -2.1, HP, 0, -0.14, 0.42, 0.3, 0.42],
];
// Produkte: OpSo and Kutasia as two large cards on a diagonal, opsolid.de behind, the rest as thin sheets.
const CARD: Pose[] = [
  [-1.9, -0.9, -1.6, HP, 0, 0.22, 0.4, 0.2, 0.4],
  [-1.55, 1.25, -1.9, HP, 0, 0.18, 0.4, 0.2, 0.4],
  [-0.75, 0.75, 0.2, HP, 0, 0.16, 0.95, 0.3, 0.95],
  [0.05, 0.1, -1.4, HP, 0, 0, 0.62, 0.25, 0.62],
  [0.75, -0.75, 0.7, HP, 0, 0.16, 0.95, 0.3, 0.95],
  [1.55, 1.25, -1.9, HP, 0, -0.18, 0.4, 0.2, 0.4],
  [1.9, -0.9, -1.6, HP, 0, -0.22, 0.4, 0.2, 0.4],
];

function pose(scene: SceneId, i: number, t: number): Pose {
  const c = i - 3;
  switch (scene) {
    case "stack":
      return [0, -c * 0.4, 0, 0, c * 0.09, 0, 1, 1, 1];
    case "agents": {
      const a = (i / 7) * Math.PI * 2 + t * 0.2;
      return [Math.cos(a) * 2.35, Math.sin(a * 2 + i) * 0.12, Math.sin(a) * 2.35, 0, wrap(-(a + HP)), 0, 0.56, 0.7, 0.44];
    }
    case "websites":
      return WEB[i];
    case "flow":
      return [c * 0.8, 0, 0, 0, 0, 0, 0.34, 0.7, 0.5];
    case "steps":
      return [c * 0.56, c * 0.3, 0, 0, -0.35, 0, 0.45, 1, 0.65];
    case "cards":
      return CARD[i];
    case "offset":
      return [i % 2 ? 0.14 : -0.14, -c * 0.4, 0, 0, c * 0.05, 0, 1, 1, 1];
    default:
      return [0, -c * 0.37, 0, 0, 0, 0, 1, 0.95, 1];
  }
}

/** Half width of each scene at scale 1 (world units), used to fit it into the free column. */
const HALF_W: Record<SceneId, number> = { stack: 1.7, agents: 3.1, websites: 2.35, flow: 3.35, steps: 2.45, cards: 2.4, offset: 1.75, tight: 1.7 };
/** Half height at scale 1, to keep tall scenes inside the viewport. */
const HALF_H: Record<SceneId, number> = { stack: 2.1, agents: 2.2, websites: 2.35, flow: 1.4, steps: 2.0, cards: 2.0, offset: 2.0, tight: 2.0 };
/** Camera per scene: distance, height, field of view. Scene changes are deliberate dolly / crane moves. */
const CAM: Record<SceneId, { z: number; y: number; fov: number }> = {
  stack: { z: 9.5, y: 0.1, fov: 35 },
  agents: { z: 10.4, y: 1.0, fov: 34 },
  websites: { z: 8.6, y: 0, fov: 36 },
  flow: { z: 10.2, y: 0.5, fov: 34 },
  steps: { z: 9.4, y: 0.9, fov: 35 },
  cards: { z: 8.8, y: 0, fov: 37 },
  offset: { z: 9.8, y: -0.2, fov: 35 },
  tight: { z: 11.2, y: 0.4, fov: 33 },
};
const GY: Record<SceneId, number> = { stack: -0.55, agents: 0, websites: 0, flow: 0, steps: -0.35, cards: 0, offset: -0.6, tight: 0.35 };
const GX: Record<SceneId, number> = { stack: 0.12, agents: 0.35, websites: 0.02, flow: 0.12, steps: 0.12, cards: 0.02, offset: 0.1, tight: 0.1 };

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

// Agent particles: a Fibonacci sphere whose radius swells with the (simulated) voice amplitude.
const PARTICLE_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uPx;
attribute float aSeed;
varying float vA;
void main() {
  vec3 p = position;
  float n = sin(dot(p, vec3(3.1, 2.3, 1.7)) + uTime * 1.4 + aSeed * 6.2831);
  float d = uAmp * 0.5 * (0.55 + 0.45 * n);
  vec3 pos = p * (1.0 + d);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (0.02 + 0.024 * aSeed + uAmp * 0.035) * uPx / -mv.z;
  vA = 0.5 + 0.5 * n * uAmp + 0.35 * uAmp;
}`;
const PARTICLE_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(uColor * (0.42 + vA * 1.0), a * 0.9);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

type Composer = { render: (dt: number) => void; setSize: (w: number, h: number) => void; setPixelRatio: (r: number) => void; dispose: () => void };

async function createCore(host: HTMLElement, quality: "full" | "light", onFirstFrame: () => void): Promise<Core | null> {
  const T = await import("three");
  const gsapMod = await import("gsap");
  const stMod = await import("gsap/ScrollTrigger");
  const gsap = gsapMod.gsap ?? gsapMod.default;
  const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
  gsap.registerPlugin(ScrollTrigger);
  const full = quality === "full";
  const qs = new URLSearchParams(window.location.search);
  const debug = qs.has("debug");

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: !full, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // Full quality renders an opaque canvas (bloom needs it); the page grid is drawn above it.
  renderer.setClearColor(0x12110f, full ? 1 : 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  // The backdrop is a scene colour rather than the clear colour: EffectComposer's RenderPass clears
  // before it binds its target, with a clear colour still in output space, which lifts the page
  // graphite to a grey. #23221f lands on the page graphite (#12110f) after ACES + sRGB output.
  if (full) scene.background = new T.Color(0x23221f);
  const camera = new T.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 9.5);
  scene.add(new T.AmbientLight(0xffffff, 1.3));
  const key = new T.DirectionalLight(0xffd8b0, 4.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new T.PointLight(0xc27940, 90, 30, 2);
  rim.position.set(-5, -2, -4);
  scene.add(rim);

  const disposables: { dispose: () => void }[] = [];
  const track = <D extends { dispose: () => void }>(o: D): D => {
    disposables.push(o);
    return o;
  };

  if (full) {
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
    const et = new T.CanvasTexture(c);
    et.mapping = T.EquirectangularReflectionMapping;
    et.colorSpace = T.SRGBColorSpace;
    const pm = new T.PMREMGenerator(renderer);
    const rt = pm.fromEquirectangular(et);
    scene.environment = rt.texture;
    track(rt);
    et.dispose();
    pm.dispose();
  }

  const group = new T.Group();
  scene.add(group);
  const box = track(new T.BoxGeometry(2.4, 0.34, 1.6));
  const egeo = track(new T.EdgesGeometry(box));

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

  // Blueprint top face (default). Window planes swap in real screenshots.
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
  const topTex = track(new T.CanvasTexture(topCanvas));
  topTex.colorSpace = T.SRGBColorSpace;
  topTex.anisotropy = 4;

  const envI = full ? 0.5 : 0;
  type Slab = {
    m: THREE.Mesh;
    mats: THREE.MeshStandardMaterial[];
    lab: THREE.MeshStandardMaterial;
    top: THREE.MeshStandardMaterial;
    shot: THREE.MeshBasicMaterial | null;
    edge: THREE.LineBasicMaterial;
    heat: number;
  };
  const slabs: Slab[] = [];
  for (let i = 0; i < 7; i++) {
    const body = track(new T.MeshStandardMaterial({ color: 0x1f1d1a, metalness: 0.55, roughness: 0.45, envMapIntensity: envI }));
    const lab = track(new T.MeshStandardMaterial({ metalness: 0.35, roughness: 0.5, envMapIntensity: envI }));
    const tp = track(new T.MeshStandardMaterial({ map: topTex, metalness: 0.2, roughness: 0.55, envMapIntensity: envI }));
    const m = new T.Mesh(box, [body, body, tp, body, lab, lab]);
    const edge = track(new T.LineBasicMaterial({ transparent: true, opacity: 0.8 }));
    edge.color.setRGB(0.9, 0.5, 0.2);
    const lines = new T.LineSegments(egeo, edge);
    lines.visible = full;
    m.add(lines);
    group.add(m);
    slabs.push({ m, mats: [body, lab, tp], lab, top: tp, shot: null, edge, heat: 0 });
  }

  // Screenshots (~80 kB webp in total) are fetched only on pages that have a Websites / Produkte
  // scene, and after the core is running; the blueprint face shows until they arrive. They are unlit
  // (basic material) so that the real page colours read as screens, slightly under the bloom threshold.
  const loader = new T.TextureLoader();
  let shotsRequested = false;
  const loadShots = () => {
    if (shotsRequested) return;
    shotsRequested = true;
    Object.entries(SHOTS).forEach(([idx, src]) => {
      loader.load(
        src,
        (t) => {
          t.colorSpace = T.SRGBColorSpace;
          t.anisotropy = 4;
          const mat = track(new T.MeshBasicMaterial({ map: t }));
          mat.color.setRGB(0.9, 0.9, 0.9);
          slabs[+idx].shot = mat;
          track(t);
        },
        undefined,
        () => {
          /* keep the blueprint face */
        },
      );
    });
  };

  const labelTextures: THREE.CanvasTexture[] = [];
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
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      t.anisotropy = 4;
      slabs[i].lab.map = t;
      slabs[i].lab.needsUpdate = true;
      labelTextures.push(t);
    });
  };

  const rail = new T.Mesh(track(new T.BoxGeometry(6.4, 0.05, 0.9)), track(new T.MeshStandardMaterial({ color: 0x1d1b18, metalness: 0.5, roughness: 0.5 })));
  rail.position.y = -0.36;
  rail.scale.x = 0.001;
  group.add(rail);
  const railEdge = track(new T.LineBasicMaterial({ color: 0xc27940 }));
  railEdge.color.setRGB(2.4, 1.2, 0.5);
  const railLines = new T.LineSegments(track(new T.EdgesGeometry(rail.geometry)), railEdge);
  railLines.visible = full;
  rail.add(railLines);

  // ---- Agent: an abstract, voice-reactive form. A particle sphere that swells with the voice, a
  // glowing core, three rings and (full quality) a faint wireframe shell. No face, no eyes, no mouth.
  const head = new T.Group();
  group.add(head);
  const N = full ? 1100 : 500;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const gold = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < N; k++) {
    const y = 1 - (k / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = gold * k;
    pos[k * 3] = Math.cos(th) * r;
    pos[k * 3 + 1] = y;
    pos[k * 3 + 2] = Math.sin(th) * r;
    seed[k] = ((k * 9301 + 49297) % 233280) / 233280;
  }
  const pgeo = track(new T.BufferGeometry());
  pgeo.setAttribute("position", new T.BufferAttribute(pos, 3));
  pgeo.setAttribute("aSeed", new T.BufferAttribute(seed, 1));
  const pmat = track(
    new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAmp: { value: 0.05 }, uPx: { value: 600 }, uColor: { value: new T.Color(1.6, 0.9, 0.4) } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  );
  const cloud = new T.Points(pgeo, pmat);
  cloud.scale.setScalar(1.05);
  cloud.frustumCulled = false;
  head.add(cloud);
  const coreMat = track(new T.MeshBasicMaterial({ color: 0xffffff }));
  coreMat.color.setRGB(2.6, 1.45, 0.65);
  const core = new T.Mesh(track(new T.SphereGeometry(0.17, 24, 16)), coreMat);
  head.add(core);
  const rings: THREE.Mesh[] = [];
  [1.25, 1.52, 1.78].forEach((rad, k) => {
    const mat = track(new T.MeshBasicMaterial({ transparent: true, opacity: 0.85 - k * 0.2 }));
    mat.color.setRGB(2.0 - k * 0.3, 1.0 - k * 0.1, 0.4);
    const ring = new T.Mesh(track(new T.TorusGeometry(rad, 0.012, 8, 120)), mat);
    ring.rotation.set(Math.PI / 2.2 + k * 0.5, k * 0.7, k * 1.1);
    head.add(ring);
    rings.push(ring);
  });
  if (full) {
    const wireMat = track(new T.LineBasicMaterial({ transparent: true, opacity: 0.16 }));
    wireMat.color.setRGB(1.2, 0.7, 0.35);
    head.add(new T.LineSegments(track(new T.WireframeGeometry(new T.IcosahedronGeometry(0.98, 2))), wireMat));
  }
  head.scale.setScalar(0.0001);
  head.visible = false;

  // ---- bloom (full quality only): copper edges, the voice core and the particles glow
  let composer: Composer | null = null;
  if (full && !qs.has("nobloom")) {
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
        import("three/examples/jsm/postprocessing/OutputPass.js"),
      ]);
      const pr = renderer.getPixelRatio();
      const target = new T.WebGLRenderTarget(window.innerWidth * pr, window.innerHeight * pr, { type: T.HalfFloatType, samples: 4 });
      const c = new EffectComposer(renderer, target);
      c.setPixelRatio(pr);
      c.addPass(new RenderPass(scene, camera));
      c.addPass(new UnrealBloomPass(new T.Vector2(window.innerWidth / 2, window.innerHeight / 2), 0.5, 0.5, 0.9));
      c.addPass(new OutputPass());
      composer = c;
    } catch {
      composer = null;
    }
  }

  // ---- layout + sizing
  const mobile = () => window.innerWidth < 760;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  // ---- scenes (DOM-driven)
  type Info = { scene: SceneId; heat: number[]; textRight: number; dim: boolean };
  let sceneEls: HTMLElement[] = [];
  let infos: Info[] = [];
  let triggers: InstanceType<typeof ScrollTrigger>[] = [];
  let activeIdx = 0;
  const progress: number[] = [];
  let fA: SceneId = "stack";
  let fB: SceneId = "stack";
  let fU = 0;
  let iA: Info | null = null;
  let iB: Info | null = null;
  let heatNow: number[] = [];

  const measure = (el: HTMLElement): Info => {
    const col = el.querySelector<HTMLElement>(".v4-col") ?? el.querySelector<HTMLElement>(".v4-band-in > div") ?? el;
    const r = col.getBoundingClientRect();
    return {
      scene: (el.dataset.scene as SceneId) ?? "stack",
      heat: (el.dataset.heat ?? "").split(",").map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n)),
      textRight: r.right,
      dim: !!el.dataset.dim,
    };
  };
  const recompute = () => {
    if (!infos.length) {
      fA = fB = "stack";
      fU = 0;
      iA = iB = null;
      heatNow = [];
      return;
    }
    const i = Math.min(activeIdx, infos.length - 1);
    const p = progress[i] ?? 0;
    const nxt = infos[i + 1];
    iA = infos[i];
    iB = nxt ?? infos[i];
    fA = iA.scene;
    fB = iB.scene;
    // The morph runs over the last 60 % of a section with a cubic ease, so the move reads as deliberate.
    fU = nxt ? easeInOut((p - 0.4) / 0.6) : 0;
    const pick = fU > 0.5 ? iB : iA;
    heatNow = pick.heat;
    if (pick.dim) document.documentElement.setAttribute("data-dim", "1");
    else document.documentElement.removeAttribute("data-dim");
  };
  const remeasure = () => {
    infos = sceneEls.map(measure);
    recompute();
  };
  const setScenes = (els: HTMLElement[]) => {
    triggers.forEach((t) => t.kill());
    triggers = [];
    sceneEls = els;
    activeIdx = 0;
    snapped = false; // a new page is a cut: place the object at its new column at once
    if (els.some((e) => e.dataset.scene === "websites" || e.dataset.scene === "cards")) loadShots();
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
          onRefresh: i === 0 ? () => remeasure() : undefined,
        }),
      );
    });
    remeasure();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", remeasure);

  // ---- render loop
  let running = true;
  let raf = 0;
  let Tm = 0;
  let last = performance.now();
  let frame = 0;
  let first = false;
  let slow = 0;
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

  const cur = { gy: 0, gx: 0, s: 1, x: 0, y: 0, cz: 9.5, cy: 0.1, fov: 35 };
  let curHeadW = 0;
  let curRailW = 0;
  let snapped = false;

  const update = (dt: number) => {
    const firstFrame = !snapped;
    snapped = true;
    const u = fU;
    const w = (id: SceneId) => (fA === fB ? (fA === id ? 1 : 0) : (fA === id ? 1 - u : 0) + (fB === id ? u : 0));
    const small = mobile();
    const useShots = w("websites") + w("cards") > 0.5;

    slabs.forEach((s, i) => {
      const a = pose(fA, i, Tm);
      const b = pose(fB, i, Tm);
      s.m.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u));
      s.m.rotation.set(lerp(a[3], b[3], u), lerp(a[4], b[4], u), lerp(a[5], b[5], u));
      s.m.scale.set(lerp(a[6], b[6], u), lerp(a[7], b[7], u), lerp(a[8], b[8], u));
      s.m.position.y += Math.sin(Tm * 2.2 - i * 0.9) * 0.1 * w("flow");
      const tg = heatNow.includes(i) ? 1 : 0;
      s.heat += (tg - s.heat) * Math.min(1, dt * 5);
      // Lighting all plates at once would flatten the stack to beige; keep it to a glow.
      const hv = s.heat * (heatNow.length > 3 ? 0.2 : 1);
      const e = hv * 0.32;
      s.mats.forEach((mt) => mt.emissive.setRGB(0.76 * e, 0.47 * e, 0.25 * e));
      // Edges glow harder on lit plates (HDR colour; blooms on desktop).
      s.edge.color.setRGB(0.9 + hv * 2.4, 0.5 + hv * 1.2, 0.2 + hv * 0.5);
      s.edge.opacity = 0.7 + 0.3 * hv;
      // Real screenshots on the window planes while the Websites / Produkte scenes are in view.
      const want = useShots && s.shot ? s.shot : s.top;
      const mats = s.m.material as THREE.Material[];
      if (mats[2] !== want) mats[2] = want;
    });

    const railW = w("flow");
    curRailW += (railW - curRailW) * Math.min(1, dt * 6);
    rail.scale.x = Math.max(0.001, sm(curRailW));
    const headW = w("agents");
    curHeadW += (headW - curHeadW) * Math.min(1, dt * 6);
    head.visible = curHeadW > 0.02;
    head.scale.setScalar(Math.max(0.0001, sm(curHeadW)));
    if (head.visible) {
      const amp = stepVoice(Tm);
      pmat.uniforms.uTime.value = Tm;
      pmat.uniforms.uAmp.value = amp;
      pmat.uniforms.uPx.value = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
      core.scale.setScalar(1 + amp * 1.4 + (voice.mode === "listen" ? 0.12 * Math.sin(Tm * 4) : 0));
      head.rotation.y = Tm * 0.25 + pointer.x * 0.3;
      head.rotation.x = Math.sin(Tm * 0.7) * 0.08 - pointer.y * 0.12;
      rings.forEach((r, k) => {
        r.scale.setScalar(1 + amp * (0.05 + k * 0.035) * (0.7 + 0.3 * Math.sin(Tm * (3 + k) - k)));
        r.rotation.z += dt * (0.25 + k * 0.18) * (k % 2 ? -1 : 1);
      });
    }

    // camera: eased between the per-scene dolly / crane positions
    const cA = CAM[fA];
    const cB = CAM[fB];
    const kc = firstFrame ? 1 : Math.min(1, dt * 3.5);
    cur.cz += (lerp(cA.z, cB.z, u) - cur.cz) * kc;
    cur.cy += (lerp(cA.y, cB.y, u) - cur.cy) * kc;
    cur.fov += (lerp(cA.fov, cB.fov, u) - cur.fov) * kc;
    if (Math.abs(camera.fov - cur.fov) > 0.01) {
      camera.fov = cur.fov;
      camera.updateProjectionMatrix();
    }
    camera.position.set(0, cur.cy + Math.cos(Tm * 0.14) * 0.12, cur.cz + Math.sin(Tm * 0.18) * 0.2);
    camera.lookAt(0, cur.cy * 0.25, 0);

    // fit the object into the free column beside the text (desktop) or above it (phones)
    const vw = window.innerWidth;
    const visH = 2 * cur.cz * Math.tan((cur.fov * Math.PI) / 360);
    const visW = visH * (vw / window.innerHeight);
    const hw = lerp(HALF_W[fA], HALF_W[fB], u);
    const hh = lerp(HALF_H[fA], HALF_H[fB], u);
    let tx: number;
    let ty: number;
    let ts: number;
    if (small) {
      tx = 0;
      ty = visH * 0.2;
      ts = Math.min(1, visW / (2 * hw + 0.45));
    } else {
      const trA = iA?.textRight ?? vw * 0.45;
      const trB = iB?.textRight ?? trA;
      const textRight = lerp(trA, trB, u);
      const L = Math.min(vw * 0.62, textRight + 44);
      const R = vw - 24;
      const wpp = visW / vw;
      tx = ((L + R) / 2 - vw / 2) * wpp;
      ty = 0;
      ts = Math.min(1.15, (visH * 0.9) / (2 * hh), ((R - L) * wpp) / (2 * hw * 1.05));
    }
    // First frame: start at the target, not at the viewport centre, so the object never glides across the text.
    const kl = firstFrame ? 1 : Math.min(1, dt * 4);
    cur.x += (tx - cur.x) * kl;
    cur.y += (ty - cur.y) * kl;
    cur.s += (ts - cur.s) * kl;
    cur.gy += (lerp(GY[fA], GY[fB], u) - cur.gy) * kl;
    cur.gx += (lerp(GX[fA], GX[fB], u) - cur.gx) * kl;
    group.rotation.y = cur.gy + Math.sin(Tm * 0.35) * 0.07 + (coarse ? 0 : pointer.x * 0.2);
    group.rotation.x = cur.gx - (coarse ? 0 : pointer.y * 0.09);
    group.position.set(cur.x, cur.y + Math.sin(Tm * 0.6) * 0.05, 0);
    group.scale.setScalar(Math.max(0.05, cur.s));
  };

  // Layout-audit hook (`?debug` only): projected screen box of everything visible in the group.
  if (debug) {
    const tb = new T.Box3();
    const tv = new T.Vector3();
    (window as unknown as Record<string, unknown>).__v4stage = {
      bounds: () => {
        group.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        let l = Infinity;
        let t = Infinity;
        let r = -Infinity;
        let b = -Infinity;
        const add = (o: THREE.Object3D) => {
          tb.setFromObject(o);
          if (tb.isEmpty()) return;
          for (const x of [tb.min.x, tb.max.x])
            for (const y of [tb.min.y, tb.max.y])
              for (const z of [tb.min.z, tb.max.z]) {
                tv.set(x, y, z).project(camera);
                const px = (tv.x * 0.5 + 0.5) * window.innerWidth;
                const py = (-tv.y * 0.5 + 0.5) * window.innerHeight;
                l = Math.min(l, px);
                r = Math.max(r, px);
                t = Math.min(t, py);
                b = Math.max(b, py);
              }
        };
        slabs.forEach((s) => add(s.m));
        if (head.visible) add(cloud);
        if (rail.scale.x > 0.05) add(rail);
        return { l, t, r, b, from: fA, to: fB, u: fU, scale: cur.s, frames: frame };
      },
    };
  }

  const loop = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    frame++;
    if (!full && frame % 2) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    // Frame-time guard: if bloom cannot hold ~20 fps, fall back to the plain renderer for good.
    if (composer && !debug && (now - last) / 1000 > 0.05) {
      slow++;
      if (slow > 40) {
        composer.dispose();
        composer = null;
      }
    } else if (slow > 0) slow--;
    last = now;
    Tm += dt;
    update(dt);
    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
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
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      triggers.forEach((t) => t.kill());
      labelTextures.forEach((t) => t.dispose());
      disposables.forEach((d) => d.dispose());
      composer?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete (window as unknown as Record<string, unknown>).__v4stage;
    },
  };
}

export function Stage() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const hostRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<Core | null>(null);
  const [ready, setReady] = useState(false);
  const first = stripLocalePrefix(pathname ?? "").split("/").filter(Boolean)[0] ?? "";
  const v4 = isV4Path(pathname) && !NO_STAGE.has(first);
  const loc: "de" | "en" | "tr" = locale === "de" || locale === "tr" ? locale : "en";

  // Start the 3D core once, after first paint and on first user intent.
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

    // The static poster is the first frame. The 3D core (three.js + GSAP) starts on the first sign of
    // a person (pointer, scroll, touch, key), or after 8 s for someone just watching, so it never
    // competes with first paint, hydration or an automated audit's quiet window.
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
