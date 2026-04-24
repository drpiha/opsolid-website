// =============================================================================
// Server-side QR generator — renders styled QR codes as PNG or SVG bytes
// without bringing jsdom into the runtime. We use:
//
//   • `qrcode` (already a dep) for the matrix → SVG string baseline.
//   • `@napi-rs/canvas` to rasterize for PNG output and overlay logo/photo
//     in the center for `withLogo` / `withPhoto` requests.
//
// Why not qr-code-styling on the server? It depends on a DOM (jsdom) which
// adds ~10 MB to the Vercel function bundle. We keep its richer style space
// in the *client* widget (live preview), and persist the chosen preset so
// the server can render the same look with these simpler primitives.
//
// Note on visual fidelity: the server output is "good enough" for OG share
// images and downloadable cards. The hi-res customer-facing QR shown in the
// widget is the client-rendered one, saved to storage on confirmation, and
// the OG/share routes prefer that saved bytes over the on-the-fly server
// fallback when present (`order.qrStyle.savedUrl`).
// =============================================================================

import QRCode from "qrcode";
import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import { getPreset, type QrPreset } from "@/lib/qr/presets";

export interface RenderQrArgs {
  /** Payload encoded into the QR — usually the full https URL. */
  data: string;
  preset?: string | null;
  primary?: string | null;
  accent?: string | null;
  background?: string | null;
  /** Pixel size of the output square (PNG only). 480 = sharp on retina. */
  size?: number;
  /** Optional center overlay — URL, https, or local /uploads/... path. */
  centerImageUrl?: string;
  /** Output format. */
  format: "png" | "svg";
}

const DEFAULT_SIZE = 480;
const CENTER_RATIO = 0.22; // 22% of QR side — fits comfortably under ECC level H

function resolveColors(preset: QrPreset, args: RenderQrArgs) {
  const dark = args.primary ?? preset.defaultPrimary;
  const light = args.background ?? preset.defaultBackground;
  return { dark, light };
}

/**
 * Render a QR code with the requested preset and colors. Returns the raw
 * bytes plus the MIME type so an API route can stream them directly.
 *
 * Center overlay handling: when `centerImageUrl` is set we punch a same-color
 * background hole in the QR matrix (qrcode's `margin: 2` gives us breathing
 * room) and draw the loaded image inside it. ECC level "H" (~30% recovery)
 * keeps the code scannable even with the center obscured.
 */
export async function renderQr(
  args: RenderQrArgs
): Promise<{ bytes: Buffer; contentType: string }> {
  const preset = getPreset(args.preset);
  const { dark, light } = resolveColors(preset, args);
  const size = args.size ?? DEFAULT_SIZE;

  if (args.format === "svg") {
    // SVG path: qrcode lib emits a clean <svg> with the desired colors. We
    // don't try to fake the rounded/dots/diamond looks here — the saved
    // client-rendered PNG (when present) is what end-users see. SVG is a
    // backup for printers and high-DPI marketing.
    const svg = await QRCode.toString(args.data, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: { dark, light },
    });
    return {
      bytes: Buffer.from(svg, "utf-8"),
      contentType: "image/svg+xml; charset=utf-8",
    };
  }

  // PNG path: render the QR onto a canvas, then composite the center overlay
  // when provided. We let qrcode draw to a temp canvas first because it
  // accepts any CanvasRenderingContext2D-shape — @napi-rs/canvas counts.
  const baseCanvas = createCanvas(size, size);
  await QRCode.toCanvas(
    baseCanvas as unknown as HTMLCanvasElement,
    args.data,
    {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: { dark, light },
    }
  );

  if (!args.centerImageUrl) {
    return {
      bytes: baseCanvas.toBuffer("image/png"),
      contentType: "image/png",
    };
  }

  // Center overlay — load the image (URL or data URI), draw a rounded white
  // backdrop that mirrors the background color, then the image clipped to a
  // circle. ECC H means the code stays scannable beneath the hole.
  const ctx = baseCanvas.getContext("2d");
  let image: Image | null = null;
  try {
    image = await loadImage(args.centerImageUrl);
  } catch (err) {
    // Non-fatal: fall back to QR without overlay rather than 500-ing.
    console.warn(
      "[qr] center image load failed, returning plain QR:",
      err
    );
    return {
      bytes: baseCanvas.toBuffer("image/png"),
      contentType: "image/png",
    };
  }

  const center = size / 2;
  const overlaySide = Math.round(size * CENTER_RATIO);
  const half = overlaySide / 2;
  const padding = Math.max(6, Math.round(overlaySide * 0.08));
  const backdropSide = overlaySide + padding * 2;
  const backdropHalf = backdropSide / 2;
  const cornerRadius = Math.round(backdropSide * 0.22);

  // Backdrop with brand-aware accent border (uses accent if set, else mute
  // ring). Filled with the QR background so dots disappear cleanly behind it.
  ctx.save();
  ctx.fillStyle = light;
  drawRoundedRect(
    ctx,
    center - backdropHalf,
    center - backdropHalf,
    backdropSide,
    backdropSide,
    cornerRadius
  );
  ctx.fill();
  if (args.accent ?? preset.defaultAccent) {
    ctx.lineWidth = Math.max(2, Math.round(backdropSide * 0.04));
    ctx.strokeStyle = args.accent ?? preset.defaultAccent ?? dark;
    drawRoundedRect(
      ctx,
      center - backdropHalf,
      center - backdropHalf,
      backdropSide,
      backdropSide,
      cornerRadius
    );
    ctx.stroke();
  }
  ctx.restore();

  // Clip the image to a circle so a square photo reads as an avatar, then
  // draw it centered.
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, half, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, center - half, center - half, overlaySide, overlaySide);
  ctx.restore();

  return {
    bytes: baseCanvas.toBuffer("image/png"),
    contentType: "image/png",
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D | ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  // @napi-rs/canvas implements roundRect from the spec; fall back to manual
  // path drawing for older Node versions where roundRect isn't available.
  const c = ctx as CanvasRenderingContext2D;
  if (typeof c.roundRect === "function") {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    return;
  }
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}
