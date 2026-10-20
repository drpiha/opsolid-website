# Hero background video ("Sieben Platten aus Glas")

Offline generator for the full-bleed hero loop of the v5 "Licht & Kupfer" design:
seven frosted-glass plates (one per offering) with copper rim light on a warm
porcelain ground. Decoration only: no people, faces, text, logos or claims.

## Files

- `scene.html` + `scene.js`: three.js (repo `node_modules/three`, 0.170) scene.
  `window.renderAt(t, w, h)` renders the frame at `t` seconds; all motion is a
  pure function of `t` (periods 12/6/4 s, smootherstep one-shots), so `t = 12`
  equals `t = 0` and the loop is seamless. `w >= h` uses the landscape layout
  (stack in the right ~55 %), otherwise the portrait layout (stack in the top
  half). `window.capture()` returns the canvas as PNG.
- `render.mjs`: starts a tiny static server (only `scripts/hero-video` and
  `node_modules/three` are served), drives the system Chrome via `puppeteer-core`,
  writes PNG frames, encodes, writes posters and prints a luminance check.

## Re-render

```bash
# prerequisites: ffmpeg (libx264 + libvpx-vp9) and cwebp, e.g. brew install ffmpeg webp
node scripts/hero-video/render.mjs --stills=0,4,7.5,10     # look-dev stills only
node scripts/hero-video/render.mjs                         # full render + encode (both formats)
node scripts/hero-video/render.mjs --format=portrait       # one format
node scripts/hero-video/render.mjs --encode-only           # re-encode existing frames
node scripts/hero-video/render.mjs --gl=swiftshader        # if no GPU WebGL is available
```

Environment: `HERO_FRAMES` (frame directory, defaults to the session scratchpad
path in `render.mjs`), `CHROME` (browser binary). A frame is preview-able in a
browser at `/scripts/hero-video/scene.html?t=7.5&w=1920&h=1080` while the server runs.

## Timeline (12 s loop, 24 fps, 288 frames)

| t        | event |
|----------|-------|
| 0–3 s    | light sweep (environment + key light turn), copper glint runs along each rim, front to back |
| 3–6 s    | camera drifts back, the stack opens slightly |
| 6–9 s    | a thin copper thread travels from plate to plate; each rim warms as it passes |
| 9–12 s   | camera and plates settle back into the start pose |

Every plate also floats (sin, periods 6 s and 4 s).

## Output (public/media/hero/)

| file | spec | budget |
|------|------|--------|
| `hero-1920.mp4` | H.264 High, yuv420p, 1920x1080, 24 fps, 12 s, no audio, +faststart | ≤ 2.3 MB |
| `hero-1920.webm` | VP9, yuv420p, 1920x1080, 24 fps, 12 s, no audio | ≤ 2.3 MB |
| `hero-720x1280.mp4` / `.webm` | same, portrait | ≤ 1.1 MB each |
| `hero-poster-1920.webp` / `.jpg` | frame t = 0 | ≤ 90 KB / ≤ 160 KB |
| `hero-poster-720x1280.webp` / `.jpg` | frame t = 0 | ≤ 50 KB / ≤ 90 KB |

Encode settings (the script steps the CRF up until a file fits its budget; the
2026-10-21 render landed on x264 CRF 17 and VP9 CRF 24 for both formats):

- MP4: `libx264 -preset veryslow -profile:v high -tune film -crf <n>
  -x264-params aq-mode=3:aq-strength=0.9:keyint=96:min-keyint=24 -pix_fmt yuv420p -an -movflags +faststart`
- WebM: `libvpx-vp9 -b:v 0 -crf <n> -g 96 -row-mt 1 -tile-columns 2 -deadline good`,
  two-pass (`-cpu-used 4` / `-cpu-used 1`, `-auto-alt-ref 1 -lag-in-frames 25`), `-an`
- Both: BT.709 matrix, limited range, tagged (`-colorspace/-color_primaries/-color_trc bt709`).
- Posters: `cwebp -q <n> -m 6 -sharp_yuv -af`, JPEG via ffmpeg `-q:v <n>` (yuvj420p).

Text zones: the left 40 % (landscape) and lower 50 % (portrait) stay bright and
low contrast for the black headline; `render.mjs` prints mean / min luma of both
zones on the posters.
