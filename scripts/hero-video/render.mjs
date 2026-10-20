#!/usr/bin/env node
// Renders the hero background loop offline and encodes it.
//
//   node scripts/hero-video/render.mjs                 # everything (frames + encode + posters + check)
//   node scripts/hero-video/render.mjs --stills=0,4,7.5,10 [--format=landscape|portrait]
//   node scripts/hero-video/render.mjs --encode-only   # re-encode existing frames
//   node scripts/hero-video/render.mjs --format=portrait
//
// Frames go to $HERO_FRAMES (default: the session scratchpad, see FRAMES_DIR),
// finished files to public/media/hero/. Needs ffmpeg and cwebp on PATH and the
// system Chrome (override with CHROME=/path/to/chrome).

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
const OUT = path.join(REPO, 'public/media/hero');
const FRAMES_DIR = process.env.HERO_FRAMES
  || '/private/tmp/claude-501/-Users-hasandonmez-Documents-Websites-opsolid-website/4b0fd9af-91d6-4ad4-907f-b7ebfba7a0bf/scratchpad/hero-frames';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const FPS = 24;
const DURATION = 12;
const FORMATS = {
  landscape: { w: 1920, h: 1080, name: 'hero-1920', poster: 'hero-poster-1920', maxVideo: 2.3e6, maxWebp: 90e3, maxJpg: 160e3 },
  portrait: { w: 720, h: 1280, name: 'hero-720x1280', poster: 'hero-poster-720x1280', maxVideo: 1.1e6, maxWebp: 50e3, maxJpg: 90e3 },
};

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const formats = args.format ? [args.format] : Object.keys(FORMATS);

// ------------------------------------------------------------ static server
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };
function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const u = new URL(req.url, 'http://x');
      const p = path.normalize(path.join(REPO, decodeURIComponent(u.pathname)));
      const allowed = [path.join(REPO, 'scripts/hero-video'), path.join(REPO, 'node_modules/three')];
      if (req.method !== 'GET' || !allowed.some((a) => p.startsWith(a + path.sep))) {
        res.writeHead(404); res.end(); return;
      }
      const body = fs.readFileSync(p);
      res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ------------------------------------------------------------ frames
async function withPage(fn) {
  const server = await startServer();
  const port = server.address().port;
  const glArgs = args.gl === 'swiftshader'
    ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
    : ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [...glArgs, '--hide-scrollbars', '--force-color-profile=srgb'],
  });
  try {
    const page = await browser.newPage();
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
    page.on('pageerror', (e) => console.log('[pageerror]', e.message));
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/scripts/hero-video/scene.html`, { waitUntil: 'load' });
    await page.waitForFunction('window.sceneReady === true', { timeout: 60000 });
    console.log('WebGL renderer:', await page.evaluate(() => window.glInfo));
    return await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

async function renderFrame(page, t, w, h, file) {
  const vp = page.viewport();
  if (vp.width !== w || vp.height !== h) await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const data = await page.evaluate((t, w, h) => { window.renderAt(t, w, h); return window.capture(); }, t, w, h);
  await fsp.writeFile(file, Buffer.from(data.split(',')[1], 'base64'));
}

async function renderStills(times) {
  const dir = path.join(FRAMES_DIR, 'stills');
  await fsp.mkdir(dir, { recursive: true });
  await withPage(async (page) => {
    for (const f of formats) {
      const { w, h } = FORMATS[f];
      for (const t of times) {
        const file = path.join(dir, `${f}-t${String(t).replace('.', '_')}.png`);
        const t0 = Date.now();
        await renderFrame(page, t, w, h, file);
        console.log(`still ${file} (${Date.now() - t0} ms)`);
      }
    }
  });
}

async function renderSequence(f) {
  const { w, h } = FORMATS[f];
  const dir = path.join(FRAMES_DIR, f);
  await fsp.rm(dir, { recursive: true, force: true });
  await fsp.mkdir(dir, { recursive: true });
  const n = FPS * DURATION; // frames 0..n-1, frame n would equal frame 0
  await withPage(async (page) => {
    const t0 = Date.now();
    for (let i = 0; i <= n; i++) {
      // frame n (t = 12) is rendered separately only for the seam check
      const file = i < n ? path.join(dir, `f_${String(i).padStart(4, '0')}.png`) : path.join(FRAMES_DIR, `${f}-seam-t12.png`);
      await renderFrame(page, i / FPS, w, h, file);
      if (i % 24 === 0) console.log(`${f} frame ${i}/${n} ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
  });
}

// ------------------------------------------------------------ encode
function run(cmd, a) {
  const r = spawnSync(cmd, a, { stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status})`);
}
const size = (p) => fs.statSync(p).size;
const COLOR = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];
const VF = 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p';

function encodeMp4(f, crf) {
  const { name } = FORMATS[f];
  const out = path.join(OUT, `${name}.mp4`);
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
    '-framerate', String(FPS), '-i', path.join(FRAMES_DIR, f, 'f_%04d.png'),
    '-vf', VF, '-c:v', 'libx264', '-preset', 'veryslow', '-profile:v', 'high', '-tune', 'film',
    '-crf', String(crf), '-x264-params', 'aq-mode=3:aq-strength=0.9:keyint=96:min-keyint=24',
    ...COLOR, '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an', '-movflags', '+faststart', out]);
  return out;
}

function encodeWebm(f, crf) {
  const { name } = FORMATS[f];
  const out = path.join(OUT, `${name}.webm`);
  const common = ['-framerate', String(FPS), '-i', path.join(FRAMES_DIR, f, 'f_%04d.png'),
    '-vf', VF, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf), '-g', '96',
    '-row-mt', '1', '-tile-columns', '2', '-deadline', 'good', ...COLOR, '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an'];
  const log = path.join(FRAMES_DIR, `vp9-${f}`);
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...common, '-pass', '1', '-cpu-used', '4', '-passlogfile', log, '-f', 'null', '/dev/null']);
  run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...common, '-pass', '2', '-cpu-used', '1', '-passlogfile', log, '-auto-alt-ref', '1', '-lag-in-frames', '25', out]);
  return out;
}

function fitBudget(label, encode, crfs, max) {
  for (const crf of crfs) {
    const out = encode(crf);
    const s = size(out);
    console.log(`${label} crf ${crf}: ${s} bytes`);
    if (s <= max) return { out, crf, size: s };
  }
  throw new Error(`${label}: no CRF fits ${max} bytes`);
}

function posters(f) {
  const { poster, maxWebp, maxJpg } = FORMATS[f];
  const src = path.join(FRAMES_DIR, f, 'f_0000.png');
  const res = {};
  for (const q of [86, 82, 78, 74, 70, 64, 58, 50]) {
    const out = path.join(OUT, `${poster}.webp`);
    run('cwebp', ['-quiet', '-q', String(q), '-m', '6', '-sharp_yuv', '-af', src, '-o', out]);
    if (size(out) <= maxWebp) { res.webp = { q, size: size(out) }; break; }
  }
  for (const q of [2, 3, 4, 5, 6, 8]) {
    const out = path.join(OUT, `${poster}.jpg`);
    run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', src, '-vf', 'format=yuvj420p', '-q:v', String(q), out]);
    if (size(out) <= maxJpg) { res.jpg = { q, size: size(out) }; break; }
  }
  return res;
}

// luma (Rec.601, full range 0..255) of a region of an image file
function luma(file, crop) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', file, '-vf', `crop=${crop},format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 64 << 20 });
  const buf = r.stdout;
  let sum = 0, min = 255;
  for (const v of buf) { sum += v; if (v < min) min = v; }
  return { mean: +(sum / buf.length).toFixed(1), min };
}

async function main() {
  await fsp.mkdir(OUT, { recursive: true });
  if (args.stills) {
    await renderStills(String(args.stills).split(',').map(Number));
    return;
  }
  for (const f of formats) {
    if (!args['encode-only']) await renderSequence(f);
    const max = FORMATS[f].maxVideo;
    const mp4 = fitBudget(`${f} mp4`, (c) => encodeMp4(f, c), f === 'landscape' ? [17, 18, 20, 22, 24, 26] : [17, 18, 20, 22, 24], max * 0.97);
    const webm = fitBudget(`${f} webm`, (c) => encodeWebm(f, c), f === 'landscape' ? [24, 26, 28, 30, 33, 36] : [24, 26, 28, 30, 33], max * 0.97);
    const p = posters(f);
    console.log(JSON.stringify({ format: f, mp4: { crf: mp4.crf, size: mp4.size }, webm: { crf: webm.crf, size: webm.size }, posters: p }));
  }
  // text-zone luminance on the posters
  const lp = path.join(OUT, 'hero-poster-1920.jpg');
  const pp = path.join(OUT, 'hero-poster-720x1280.jpg');
  if (fs.existsSync(lp)) console.log('landscape left 40%:', JSON.stringify(luma(lp, 'iw*0.4:ih:0:0')));
  if (fs.existsSync(pp)) console.log('portrait lower 50%:', JSON.stringify(luma(pp, 'iw:ih*0.5:0:ih*0.5')));
}

main().catch((e) => { console.error(e); process.exit(1); });
