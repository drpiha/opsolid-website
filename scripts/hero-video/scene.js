// OpSolid hero background · "Sieben Platten aus Glas" (Licht & Kupfer)
//
// Every value on screen is a pure function of t (seconds). Nothing reads the
// clock and nothing uses requestAnimationFrame, so a frame can be rendered in
// any order and t = 12 is identical to t = 0 (seamless loop):
//   - periodic motion uses periods that divide 12 s (12, 6, 4)
//   - one-shot events (light sweep, camera drift, copper thread) are built
//     from smootherstep ramps that start and end at exactly zero.
//
// No people, no faces, no text, no logos. Etched motifs are line drawings only.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const LOOP = 12;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- helpers
const clamp01 = (x) => Math.min(1, Math.max(0, x));
// smootherstep: zero 1st and 2nd derivative at both ends (no visible "kick")
const ramp = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const srgb = (hex) => new THREE.Color(hex); // THREE.Color(hex) converts sRGB -> linear working space
const srgbVec = (hex) => {
  // raw sRGB components (0..1) for shaders that mix in sRGB space
  const c = new THREE.Color();
  c.setHex(hex, THREE.LinearSRGBColorSpace); // keep the numbers untouched
  return new THREE.Vector3(c.r, c.g, c.b);
};

// ---------------------------------------------------------------- palette
const COL = {
  base: 0xece8e1,
  white: 0xffffff,
  edge: 0xe6e1d8,
  copper: 0xc27940,
  copperHi: 0xf0b27a,
  edgeGrey: 0xd6cdc2,
  glass: 0xfbf9f6,
  motif: 0xb3977b,
};

// ---------------------------------------------------------------- layouts
// sx/sy: where the stack centre lands on screen (0..1 from top-left).
// spot:  daylight spot in screen uv (from top-left).
const LAYOUTS = {
  landscape: {
    fov: 24, dist: 11.2, az: 0.0, el: 0.16,
    sx: 0.72, sy: 0.50,
    spot: [0.70, 0.38], spotR: 0.42,
    driftBack: 0.13, driftAz: 0.05,
  },
  portrait: {
    fov: 34, dist: 13.6, az: -0.17, el: 0.22,
    sx: 0.52, sy: 0.26,
    spot: [0.62, 0.22], spotR: 0.36,
    driftBack: 0.10, driftAz: 0.04,
  },
};

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(srgb(COL.base), 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.85;

const camera = new THREE.PerspectiveCamera(24, 16 / 9, 0.5, 140);

// ---------------------------------------------------------------- plates
const PW = 1.5;       // plate width
const PH = 1.0;       // plate height (3:2)
const TH = 0.036;     // thickness (2.4 % of width)
const PR = 0.085;     // corner radius
const N_PLATES = 7;
const FLOOR_Y = -1.32;

const STEP = new THREE.Vector3(0.46, 0.13, -0.40); // diagonal between plates
const BASE_YAW = -0.50;  // faces slightly toward the headline (left)
const BASE_TILT = -0.10; // leans back a little

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

const plateShape = roundedRectShape(PW, PH, PR);
const glassGeo = new THREE.ExtrudeGeometry(plateShape, {
  depth: TH, bevelEnabled: false, curveSegments: 20,
});
glassGeo.translate(0, 0, -TH / 2);
glassGeo.computeVertexNormals();

// Rim ribbon: wraps the side wall plus a hair-thin lip on both faces.
// aLocal = plate-local xy (used for the travelling glint).
function rimGeometry() {
  const N = 480;
  const pts = plateShape.getSpacedPoints(N); // CCW
  const LIP = 0.0105, OUT = 0.0012, EZ = 0.0009;
  const rows = [
    { inset: LIP, z: TH / 2 + EZ, nz: 1.0, nn: 0.25 },
    { inset: -OUT, z: TH / 2 + EZ * 0.5, nz: 0.55, nn: 0.85 },
    { inset: -OUT, z: -TH / 2 - EZ * 0.5, nz: -0.55, nn: 0.85 },
    { inset: LIP, z: -TH / 2 - EZ, nz: -1.0, nn: 0.25 },
  ];
  const pos = [], nor = [], loc = [], idx = [];
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
    const tx = b.x - a.x, ty = b.y - a.y;
    const tl = Math.hypot(tx, ty) || 1;
    const nx = ty / tl, ny = -tx / tl; // outward for CCW
    for (const r of rows) {
      const x = p.x - nx * r.inset, y = p.y - ny * r.inset;
      pos.push(x, y, r.z);
      const v = new THREE.Vector3(nx * r.nn, ny * r.nn, r.nz).normalize();
      nor.push(v.x, v.y, v.z);
      loc.push(x, y);
    }
  }
  const R = rows.length;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    for (let k = 0; k < R - 1; k++) {
      const a = i * R + k, b = j * R + k, c = j * R + k + 1, d = i * R + k + 1;
      idx.push(a, b, c, a, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('aLocal', new THREE.Float32BufferAttribute(loc, 2));
  g.setIndex(idx);
  return g;
}
const rimGeo = rimGeometry();

const LIGHT_DIR = new THREE.Vector3(0.75, 1.0, 0.55).normalize();

function makeRimMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    uniforms: {
      uCopper: { value: srgb(COL.copper) },
      uCopperHi: { value: srgb(COL.copperHi) },
      uEdgeGrey: { value: srgb(COL.edgeGrey) },
      uLightDir: { value: LIGHT_DIR.clone() },
      uCamPos: { value: new THREE.Vector3() },
      uGlintX: { value: -10 },
      uGlintAmt: { value: 0 },
      uBoost: { value: 0 },
      uGhost: { value: 0 },
      uGhostCol: { value: srgb(0xf1ece6) },
    },
    vertexShader: /* glsl */`
      attribute vec2 aLocal;
      varying vec3 vNormalW;
      varying vec3 vWorld;
      varying vec2 vLocal;
      void main() {
        vLocal = aLocal;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uCopper, uCopperHi, uEdgeGrey, uLightDir, uCamPos;
      uniform float uGlintX, uGlintAmt, uBoost, uGhost;
      uniform vec3 uGhostCol;
      varying vec3 vNormalW;
      varying vec3 vWorld;
      varying vec2 vLocal;
      void main() {
        vec3 n = normalize(vNormalW);
        vec3 v = normalize(uCamPos - vWorld);
        if (dot(n, v) < 0.0) n = -n;
        float facing = max(dot(n, uLightDir), 0.0);
        vec3 h = normalize(uLightDir + v);
        float spec = pow(max(dot(n, h), 0.0), 18.0);
        // edges that face the daylight catch copper; the rest stays glass-grey
        float hl = 0.10 + 0.55 * pow(facing, 2.2) + 0.55 * spec;
        float g = exp(-pow((vLocal.x - uGlintX) / 0.17, 2.0)) * uGlintAmt;
        hl += g * (1.1 + 1.1 * facing) + uBoost;
        vec3 col = mix(uEdgeGrey, uCopper, clamp(hl, 0.0, 1.0));
        col = mix(col, uCopperHi, clamp(hl - 1.0, 0.0, 0.85));
        col += vec3(1.0, 0.95, 0.9) * spec * 0.35;
        // seen through frosted glass (transmission pass): only a faint ghost edge
        col = mix(col, uGhostCol, uGhost * 0.72);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- motifs
// One subtle etched line drawing per offering. Line art only, no letters.
function motifTexture(kind) {
  const W = 1024, H = 683;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, W, H);
  c.strokeStyle = '#fff'; c.fillStyle = '#fff';
  c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
  const cx = W / 2, cy = H / 2;
  const S = 150; // motif half-size
  const rr = (x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.stroke(); };
  switch (kind) {
    case 'wave': { // agents: sound wave
      c.beginPath();
      for (let i = 0; i <= 240; i++) {
        const u = i / 240, x = cx - S * 1.35 + u * S * 2.7;
        const env = Math.pow(Math.sin(Math.PI * u), 1.6);
        const y = cy + Math.sin(u * TAU * 3.2) * S * 0.62 * env;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.stroke();
      c.globalAlpha = 0.6; c.beginPath();
      for (let i = 0; i <= 240; i++) {
        const u = i / 240, x = cx - S * 1.35 + u * S * 2.7;
        const env = Math.pow(Math.sin(Math.PI * u), 2.2);
        const y = cy + Math.sin(u * TAU * 3.2 + 1.3) * S * 0.36 * env;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.stroke(); c.globalAlpha = 1;
      break;
    }
    case 'browser': { // websites: browser window outline
      rr(cx - S * 1.3, cy - S * 0.85, S * 2.6, S * 1.7, 22);
      c.beginPath(); c.moveTo(cx - S * 1.3, cy - S * 0.45); c.lineTo(cx + S * 1.3, cy - S * 0.45); c.stroke();
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(cx - S * 1.08 + i * 30, cy - S * 0.65, 7, 0, TAU); c.fill(); }
      c.globalAlpha = 0.6;
      rr(cx - S * 1.05, cy - S * 0.22, S * 0.95, S * 0.82, 10);
      c.beginPath(); c.moveTo(cx + S * 0.15, cy - S * 0.12); c.lineTo(cx + S * 1.05, cy - S * 0.12); c.stroke();
      c.beginPath(); c.moveTo(cx + S * 0.15, cy + S * 0.18); c.lineTo(cx + S * 0.85, cy + S * 0.18); c.stroke();
      c.globalAlpha = 1;
      break;
    }
    case 'flow': { // automation: nodes and arrows
      const xs = [-1.15, 0, 1.15].map((k) => cx + k * S);
      for (const x of xs) { c.beginPath(); c.arc(x, cy, 30, 0, TAU); c.stroke(); }
      for (let i = 0; i < 2; i++) {
        const a = xs[i] + 46, b = xs[i + 1] - 46;
        c.beginPath(); c.moveTo(a, cy); c.lineTo(b, cy); c.stroke();
        c.beginPath(); c.moveTo(b - 18, cy - 14); c.lineTo(b, cy); c.lineTo(b - 18, cy + 14); c.stroke();
      }
      c.globalAlpha = 0.6;
      c.beginPath(); c.moveTo(xs[2], cy + 46); c.quadraticCurveTo(xs[2], cy + S * 0.85, cx, cy + S * 0.85);
      c.quadraticCurveTo(xs[0], cy + S * 0.85, xs[0], cy + 46); c.stroke();
      c.beginPath(); c.moveTo(xs[0] - 14, cy + 64); c.lineTo(xs[0], cy + 46); c.lineTo(xs[0] + 14, cy + 64); c.stroke();
      c.globalAlpha = 1;
      break;
    }
    case 'grid': { // Microsoft 365: 2x2 grid
      const g = S * 0.62, gap = 26;
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        rr(cx - g - gap / 2 + i * (g + gap), cy - g - gap / 2 + j * (g + gap), g, g, 12);
      }
      break;
    }
    case 'toggle': { // internal tools: toggle + list
      rr(cx - S * 1.2, cy - S * 0.78, S * 0.95, S * 0.48, S * 0.24);
      c.beginPath(); c.arc(cx - S * 1.2 + S * 0.71, cy - S * 0.54, S * 0.16, 0, TAU); c.fill();
      c.globalAlpha = 0.65;
      for (let i = 0; i < 3; i++) {
        const y = cy - S * 0.05 + i * S * 0.36;
        c.beginPath(); c.arc(cx - S * 1.08, y, 8, 0, TAU); c.fill();
        c.beginPath(); c.moveTo(cx - S * 0.86, y); c.lineTo(cx + S * (1.2 - i * 0.3), y); c.stroke();
      }
      c.globalAlpha = 1;
      break;
    }
    case 'check': { // AI check: checkmark in a ring
      c.beginPath(); c.arc(cx, cy, S * 0.78, 0, TAU); c.stroke();
      c.lineWidth = 9;
      c.beginPath(); c.moveTo(cx - S * 0.36, cy + S * 0.02); c.lineTo(cx - S * 0.09, cy + S * 0.3); c.lineTo(cx + S * 0.42, cy - S * 0.3); c.stroke();
      break;
    }
    case 'book': { // training: open book
      const top = cy - S * 0.62, bot = cy + S * 0.66;
      c.beginPath();
      c.moveTo(cx, top + 26); c.quadraticCurveTo(cx - S * 0.55, top - 18, cx - S * 1.25, top + 10);
      c.lineTo(cx - S * 1.25, bot - 10); c.quadraticCurveTo(cx - S * 0.55, bot - 38, cx, bot); c.stroke();
      c.beginPath();
      c.moveTo(cx, top + 26); c.quadraticCurveTo(cx + S * 0.55, top - 18, cx + S * 1.25, top + 10);
      c.lineTo(cx + S * 1.25, bot - 10); c.quadraticCurveTo(cx + S * 0.55, bot - 38, cx, bot); c.stroke();
      c.beginPath(); c.moveTo(cx, top + 26); c.lineTo(cx, bot); c.stroke();
      c.globalAlpha = 0.55;
      for (let i = 0; i < 3; i++) {
        const y = top + S * (0.42 + i * 0.3);
        c.beginPath(); c.moveTo(cx - S * 0.98, y + 4); c.quadraticCurveTo(cx - S * 0.5, y - 12, cx - S * 0.2, y + 2); c.stroke();
        c.beginPath(); c.moveTo(cx + S * 0.2, y + 2); c.quadraticCurveTo(cx + S * 0.5, y - 12, cx + S * 0.98, y + 4); c.stroke();
      }
      c.globalAlpha = 1;
      break;
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// order front -> back
const MOTIFS = ['wave', 'browser', 'flow', 'grid', 'toggle', 'check', 'book'];

const glassMat = new THREE.MeshPhysicalMaterial({
  color: srgb(COL.glass),
  metalness: 0,
  roughness: 0.17,
  transmission: 1,
  thickness: 0.2,
  ior: 1.5,
  specularIntensity: 1,
  clearcoat: 0.6,
  clearcoatRoughness: 0.06,
  side: THREE.DoubleSide,
  dithering: true,
});

// motifs sit in the upper-right area of each plate, the part left visible by the plate in front
const MOTIF_POS = new THREE.Vector2(0.43, 0.16);
const motifGeo = new THREE.PlaneGeometry(PW * 0.72, PW * 0.72 * (683 / 1024));

const plates = [];
for (let i = 0; i < N_PLATES; i++) {
  const group = new THREE.Group();
  const glass = new THREE.Mesh(glassGeo, glassMat);
  const rimMat = makeRimMaterial();
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.onBeforeRender = (r) => {
    rimMat.uniforms.uGhost.value = r.getRenderTarget() ? 1 : 0;
    rimMat.uniformsNeedUpdate = true;
  };
  const motifMat = new THREE.MeshBasicMaterial({
    map: motifTexture(MOTIFS[i]),
    color: srgb(COL.motif),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const motif = new THREE.Mesh(motifGeo, motifMat);
  motif.position.set(MOTIF_POS.x, MOTIF_POS.y, TH / 2 + 0.0016);
  group.add(glass, rim, motif);
  scene.add(group);
  plates.push({
    group, rimMat,
    phase: i * 0.93,
    jitter: new THREE.Vector3(Math.sin(i * 2.1) * 0.05, Math.sin(i * 1.3 + 1) * 0.035, Math.cos(i * 1.7) * 0.05),
    yawJ: Math.sin(i * 1.9 + 0.4) * 0.05,
    tiltJ: Math.cos(i * 2.3) * 0.035,
    rollJ: Math.sin(i * 2.7 + 0.8) * 0.03,
  });
}

// ---------------------------------------------------------------- backdrop
// Screen-space porcelain gradient (static, so it costs the encoder nothing)
// with analytic soft contact shadows on the invisible floor.
const bgUniforms = {
  uRes: { value: new THREE.Vector2(1920, 1080) },
  uSpot: { value: new THREE.Vector2(0.7, 0.38) },
  uSpotR: { value: 0.42 },
  uBase: { value: srgbVec(COL.base) },
  uWhite: { value: srgbVec(COL.white) },
  uEdge: { value: srgbVec(COL.edge) },
  uPlates: { value: Array.from({ length: N_PLATES }, () => new THREE.Vector4()) },
  uShadowOn: { value: 0 },
};
const bgVert = /* glsl */`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const bgFrag = /* glsl */`
  uniform vec2 uRes, uSpot;
  uniform float uSpotR, uShadowOn;
  uniform vec3 uBase, uWhite, uEdge;
  uniform vec4 uPlates[${N_PLATES}]; // x, z, height above floor, yaw
  varying vec3 vWorld;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  vec3 toLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    uv.y = 1.0 - uv.y;
    float asp = uRes.x / uRes.y;
    vec2 d = (uv - uSpot) * vec2(asp, 1.0);
    float spot = exp(-dot(d, d) / (2.0 * uSpotR * uSpotR));
    vec3 col = mix(uBase, uWhite, spot);
    vec2 e = (uv - 0.5) * vec2(1.0, 1.0);
    float edge = smoothstep(0.30, 0.78, length(e));
    col = mix(col, uEdge, edge * (1.0 - spot));

    if (uShadowOn > 0.5) {
      float lit = 1.0;
      for (int i = 0; i < ${N_PLATES}; i++) {
        vec4 P = uPlates[i];
        vec2 p = vWorld.xz - P.xy;
        float c = cos(P.w), s = sin(P.w);
        vec2 q = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
        float h = P.z;
        vec2 ext = vec2(${(PW * 0.5).toFixed(3)} * 0.86, 0.10);
        float blur = 0.16 + 0.42 * h;
        vec2 dd = abs(q) - ext;
        float sd = length(max(dd, 0.0)) + min(max(dd.x, dd.y), 0.0);
        float sh = 1.0 - smoothstep(-blur, blur * 1.6, sd);
        sh *= 0.42 / (1.0 + 1.4 * h);
        lit *= 1.0 - sh;
      }
      vec3 tint = vec3(0.86, 0.80, 0.72);
      col *= mix(tint, vec3(1.0), lit);
    }
    col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(toLinear(clamp(col, 0.0, 1.0)), 1.0);
    #include <colorspace_fragment>
  }`;

const bgMat = new THREE.ShaderMaterial({
  uniforms: bgUniforms, vertexShader: bgVert, fragmentShader: bgFrag,
  side: THREE.BackSide, depthWrite: false,
});
const floorMat = new THREE.ShaderMaterial({
  uniforms: { ...bgUniforms, uShadowOn: { value: 1 } },
  vertexShader: bgVert, fragmentShader: bgFrag,
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16), bgMat);
sky.renderOrder = -10;
scene.add(sky);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = FLOOR_Y;
scene.add(floor);

// ---------------------------------------------------------------- lights
const key = new THREE.DirectionalLight(srgb(0xfff3e4), 2.2);
scene.add(key, key.target);
const fill = new THREE.HemisphereLight(srgb(0xffffff), srgb(0xe2d8cb), 0.6);
scene.add(fill);

// ---------------------------------------------------------------- copper thread
// Tapered comet line, opaque (so it is seen softly through the frosted glass).
const TN = 320, RING = 6;
const threadGeo = new THREE.BufferGeometry();
const tPos = new Float32Array(TN * RING * 3);
const tDir = new Float32Array(TN * RING * 3);
const tU = new Float32Array(TN * RING);
const tIdx = [];
for (let i = 0; i < TN; i++) {
  for (let k = 0; k < RING; k++) tU[i * RING + k] = i / (TN - 1);
  if (i < TN - 1) for (let k = 0; k < RING; k++) {
    const a = i * RING + k, b = i * RING + (k + 1) % RING, c = (i + 1) * RING + (k + 1) % RING, d = (i + 1) * RING + k;
    tIdx.push(a, b, c, a, c, d);
  }
}
threadGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
threadGeo.setAttribute('aDir', new THREE.BufferAttribute(tDir, 3));
threadGeo.setAttribute('aU', new THREE.BufferAttribute(tU, 1));
threadGeo.setIndex(tIdx);
const threadMat = new THREE.ShaderMaterial({
  uniforms: {
    uHead: { value: -1 }, uLen: { value: 0.24 }, uRadius: { value: 0.012 },
    uCopper: { value: srgb(COL.copper) }, uCopperHi: { value: srgb(COL.copperHi) },
  },
  vertexShader: /* glsl */`
    attribute vec3 aDir;
    attribute float aU;
    uniform float uHead, uLen, uRadius;
    varying float vW;
    void main() {
      float d = uHead - aU;
      float w = 0.0;
      if (d >= 0.0 && d <= uLen) {
        w = smoothstep(0.0, 0.012, d) * pow(1.0 - d / uLen, 1.4);
      }
      vW = w;
      vec3 p = position + aDir * uRadius * (0.25 + 0.75 * w) * step(0.002, w);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }`,
  fragmentShader: /* glsl */`
    uniform vec3 uCopper, uCopperHi;
    varying float vW;
    void main() {
      if (vW < 0.002) discard;
      vec3 col = mix(uCopper, uCopperHi, smoothstep(0.55, 1.0, vW));
      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }`,
});
const thread = new THREE.Mesh(threadGeo, threadMat);
thread.frustumCulled = false;
scene.add(thread);

// soft halo at the thread head
function haloTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,214,170,1)');
  g.addColorStop(0.25, 'rgba(240,170,110,0.55)');
  g.addColorStop(1, 'rgba(194,121,64,0)');
  c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const halo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: haloTexture(), transparent: true, depthWrite: false, opacity: 0,
}));
halo.scale.setScalar(0.16);
scene.add(halo);

// ---------------------------------------------------------------- animation
const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();

function phases(t) {
  // 0-3 s light sweep, 3-6 drift back, 6-9 thread, 9-12 settle
  const sweep = ramp(0, 3.2, t) - ramp(9, 12, t);
  const back = ramp(3, 6, t) - ramp(9, 12, t);
  return { sweep, back };
}

function poseScene(t, layout) {
  const { sweep, back } = phases(t);
  const spread = 1 + 0.10 * back;

  // plates
  const centres = [];
  for (let i = 0; i < N_PLATES; i++) {
    const P = plates[i];
    const k = i - (N_PLATES - 1) / 2;
    const g = P.group;
    g.position.copy(STEP).multiplyScalar(k * spread).add(P.jitter);
    g.position.y -= 0.022 * (k * k - 4); // gentle arch: a loose stack, not a file box
    g.position.y += 0.045 * Math.sin(TAU * t / 6 + P.phase)
                  + 0.012 * Math.sin(TAU * t / 4 + P.phase * 1.7);
    g.position.x += 0.010 * Math.sin(TAU * t / 12 + P.phase * 0.6);
    _e.set(
      BASE_TILT + P.tiltJ + 0.016 * Math.sin(TAU * t / 6 + P.phase + 1.1),
      BASE_YAW + P.yawJ - 0.028 * k + 0.022 * Math.sin(TAU * t / 12 + P.phase * 1.3) + 0.03 * back * (k / 3),
      P.rollJ + 0.012 * Math.sin(TAU * t / 4 + P.phase * 0.7),
      'YXZ',
    );
    g.quaternion.setFromEuler(_e);
    g.updateMatrixWorld(true);
    centres.push(g.position.clone());

    // contact shadow parameters
    const bottom = g.position.y - (PH / 2) * Math.cos(_e.x) - FLOOR_Y;
    // shift a little away from the light (light comes from upper right/front)
    const sx = g.position.x - 0.10 - 0.12 * bottom;
    const sz = g.position.z - 0.06 - 0.10 * bottom;
    bgUniforms.uPlates.value[i].set(sx, sz, Math.max(0, bottom), _e.y);
  }

  // light sweep: environment and key light rotate a little, then return
  scene.environmentRotation.set(0, -0.5 + 0.85 * sweep, 0);
  const la = 0.65 - 0.55 * sweep;
  key.position.set(Math.sin(la) * 6, 7.5, Math.cos(la) * 6);
  key.target.position.set(0, 0, 0);
  _v.copy(key.position).normalize();

  // camera: slow drift back during 3-6 s, return during 9-12 s
  const dist = layout.dist * (1 + layout.driftBack * back);
  const az = layout.az + layout.driftAz * back + 0.012 * Math.sin(TAU * t / 12);
  const el = layout.el + 0.02 * back + 0.006 * Math.sin(TAU * t / 6 + 0.5);
  const target = new THREE.Vector3(0, 0.02 + 0.03 * back, 0);
  camera.position.set(
    target.x + dist * Math.sin(az) * Math.cos(el),
    target.y + dist * Math.sin(el),
    target.z + dist * Math.cos(az) * Math.cos(el),
  );
  camera.lookAt(target);

  // rim glint (0-3 s) staggered front -> back, plus thread boost (6-9 s)
  const threadEnv = ramp(5.6, 6.1, t) * (1 - ramp(9.0, 10.6, t));
  const head = -0.02 + 1.30 * ramp(6.0, 9.0, t);

  // copper thread path: just in front of each plate face, arcing between plates
  const pts = [];
  const normalOf = (i) => _n.set(0, 0, 1).applyQuaternion(plates[i].group.quaternion).clone();
  {
    const n0 = normalOf(0);
    pts.push(centres[0].clone().addScaledVector(STEP, -0.9).add(new THREE.Vector3(0.05, -0.22, 0)).addScaledVector(n0, 0.25));
  }
  const platePtIdx = [];
  for (let i = 0; i < N_PLATES; i++) {
    const n = normalOf(i);
    const local = new THREE.Vector3(MOTIF_POS.x + 0.05 * Math.sin(i * 2.4), MOTIF_POS.y + 0.04 * Math.cos(i * 1.9), TH / 2 + 0.07);
    const p = local.applyMatrix4(plates[i].group.matrixWorld);
    platePtIdx.push(pts.length);
    pts.push(p);
    if (i < N_PLATES - 1) {
      const m = p.clone().lerp(new THREE.Vector3(MOTIF_POS.x, MOTIF_POS.y, TH / 2 + 0.07).applyMatrix4(plates[i + 1].group.matrixWorld), 0.5).addScaledVector(n, 0.12);
      m.y += 0.16 + 0.04 * Math.sin(i * 1.3);
      pts.push(m);
    }
  }
  {
    const n6 = normalOf(N_PLATES - 1);
    pts.push(centres[N_PLATES - 1].clone().addScaledVector(STEP, 0.9).add(new THREE.Vector3(0.1, 0.25, 0)).addScaledVector(n6, -0.1));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  // arc-length u of each plate point
  const plateU = [];
  {
    const lens = curve.getLengths(400);
    const L = lens[lens.length - 1];
    for (const idx of platePtIdx) {
      const tp = idx / (pts.length - 1);
      const li = Math.round(tp * 400);
      plateU.push(lens[li] / L);
    }
  }
  if (threadEnv > 0) {
    for (let i = 0; i < TN; i++) {
      const u = i / (TN - 1);
      curve.getPointAt(u, _a);
      curve.getTangentAt(u, _b);
      const nrm = _v.crossVectors(_b, _up);
      if (nrm.lengthSq() < 1e-6) nrm.set(1, 0, 0);
      nrm.normalize();
      const bin = _n.crossVectors(_b, nrm).normalize();
      for (let k = 0; k < RING; k++) {
        const ang = (k / RING) * TAU;
        const o = (i * RING + k) * 3;
        tPos[o] = _a.x; tPos[o + 1] = _a.y; tPos[o + 2] = _a.z;
        tDir[o] = Math.cos(ang) * nrm.x + Math.sin(ang) * bin.x;
        tDir[o + 1] = Math.cos(ang) * nrm.y + Math.sin(ang) * bin.y;
        tDir[o + 2] = Math.cos(ang) * nrm.z + Math.sin(ang) * bin.z;
      }
    }
    threadGeo.attributes.position.needsUpdate = true;
    threadGeo.attributes.aDir.needsUpdate = true;
    thread.visible = true;
    threadMat.uniforms.uHead.value = head;
    const hu = Math.min(1, Math.max(0, head));
    curve.getPointAt(hu, halo.position);
    const inRange = head >= 0 && head <= 1 ? 1 : Math.max(0, 1 - Math.abs(head - hu) * 12);
    halo.material.opacity = 0.75 * inRange * threadEnv;
    halo.visible = halo.material.opacity > 0.001;
  } else {
    thread.visible = false;
    halo.visible = false;
  }

  for (let i = 0; i < N_PLATES; i++) {
    const u = plates[i].rimMat.uniforms;
    const p = clamp01((t - 0.35 - 0.30 * i) / 1.45);
    const env = Math.pow(Math.sin(Math.PI * p), 2);
    u.uGlintX.value = -PW * 0.7 + p * PW * 1.4;
    u.uGlintAmt.value = env * (0.85 - 0.04 * i);
    const du = head - plateU[i];
    const b = du >= 0 ? Math.exp(-du / 0.16) : Math.exp(-Math.pow(du / 0.035, 2));
    u.uBoost.value = 0.55 * b * threadEnv;
    u.uCamPos.value.copy(camera.position);
  }
}

let curW = 0, curH = 0;
function setSize(w, h) {
  if (w === curW && h === curH) return;
  curW = w; curH = h;
  renderer.setSize(w, h, true);
  bgUniforms.uRes.value.set(w, h);
}

window.renderAt = function renderAt(t, w = 1920, h = 1080) {
  t = ((t % LOOP) + LOOP) % LOOP;
  setSize(w, h);
  const layout = w >= h ? LAYOUTS.landscape : LAYOUTS.portrait;
  bgUniforms.uSpot.value.set(layout.spot[0], layout.spot[1]);
  bgUniforms.uSpotR.value = layout.spotR;
  camera.fov = layout.fov;
  camera.aspect = w / h;
  // lens shift: put the stack centre at (sx, sy) without rotating the view
  camera.setViewOffset(w, h, w * (0.5 - layout.sx), h * (0.5 - layout.sy), w, h);
  camera.updateProjectionMatrix();
  poseScene(t, layout);
  renderer.render(scene, camera);
  return true;
};

window.capture = function capture() {
  return renderer.domElement.toDataURL('image/png');
};

{
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  window.glInfo = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
}

// interactive preview: scene.html?t=4&w=1920&h=1080
{
  const q = new URLSearchParams(location.search);
  if (q.has('t')) {
    window.renderAt(parseFloat(q.get('t')), parseInt(q.get('w') || '1920', 10), parseInt(q.get('h') || '1080', 10));
  }
}

window.sceneReady = true;
