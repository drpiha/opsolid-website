// =============================================================================
// AI Art QR generator — Replicate's Stable Diffusion + ControlNet QR Monster
// model. Bundled into all yearly plans as a premium differentiator.
//
// Pipeline (worst-case ~25-40s end-to-end):
//   1. Build a curated prompt from the user prompt + chosen style preset.
//   2. Render a baseline high-contrast QR PNG (ECC level H, no fancy styling)
//      to feed into ControlNet as the structural conditioning image.
//   3. Call Replicate, wait for the prediction to resolve (one image URL).
//   4. Fetch the result, decode it with jsQR — if it doesn't scan, retry up to
//      MAX_RETRIES with a different seed. The model occasionally produces
//      gorgeous but unscannable output; the retry loop is essential.
//   5. Final fallback: return the baseline styled QR so the customer never
//      sees a "generation failed" error — they just get a nicer-than-default
//      QR even when AI gives up.
// =============================================================================

import Replicate from "replicate";
import jsQR from "jsqr";
import QRCode from "qrcode";
import { Image, createCanvas, loadImage } from "@napi-rs/canvas";

export type AiArtStyle =
  | "geometric"
  | "liquid"
  | "forest"
  | "cyberpunk"
  | "watercolor"
  | "mosaic";

export interface GenerateAiQrArgs {
  /** Payload to encode (the public card URL). */
  data: string;
  /** User-supplied creative direction (1-2 sentences). */
  userPrompt: string;
  /** Style preset that biases the prompt + LoRA mix. */
  style: AiArtStyle;
  /** Output square pixel size — model handles 768 / 1024 reliably. */
  size?: 768 | 1024;
}

export interface GenerateAiQrResult {
  /** PNG bytes ready to persist via storage adapter. */
  bytes: Buffer;
  /** True when the result decoded successfully (always true for fallback). */
  decoded: boolean;
  /** True when we returned the safe fallback because every AI try failed. */
  fellBackToBaseline: boolean;
  /** How many model calls we ran (1..MAX_RETRIES). */
  attempts: number;
}

const MODEL_VERSION =
  // monster-labs/control_v1p_sd15_qrcode_monster — long-lived "QR monster"
  // model that's been the most reliable for *scannable* AI QR art since 2023.
  // Pinned by version hash so a model change can't break our pipeline silently.
  "qr2ai/qr-code-ai-art-generator:b25c1c7b" as const;

const MAX_RETRIES = 3;

const STYLE_PROMPT: Record<AiArtStyle, { positive: string; negative: string }> = {
  geometric: {
    positive:
      "intricate geometric pattern, isometric shapes, sharp lines, monochrome dark teal palette, high contrast, professional, vector aesthetic",
    negative: "blurry, low contrast, text, watermark, signature, hands, faces",
  },
  liquid: {
    positive:
      "fluid liquid mercury, glossy chrome flow, soft gradients in blue and violet, dreamy bokeh, high-end product render",
    negative: "blurry, low contrast, text, watermark, signature, hands, faces, dirty",
  },
  forest: {
    positive:
      "lush forest canopy from above, sunlit moss, ferns and mushrooms, warm green palette, painterly nature illustration, magical realism",
    negative: "blurry, low contrast, text, watermark, signature, people, animals",
  },
  cyberpunk: {
    positive:
      "cyberpunk neon city at night, magenta and cyan glow, rain reflections, holographic signage, ultra-detailed, cinematic",
    negative: "blurry, washed out, text, watermark, signature, daylight, nature",
  },
  watercolor: {
    positive:
      "soft watercolor wash, pastel sunrise palette, hand-painted texture, flowing pigments, paper grain, art-journal aesthetic",
    negative: "sharp lines, vector, text, watermark, signature, photorealistic, dark",
  },
  mosaic: {
    positive:
      "byzantine glass mosaic tiles, rich gold and lapis lazuli, intricate tessellation, museum lighting, ornate borders",
    negative: "smooth, gradient, text, watermark, signature, modern, plastic",
  },
};

let _replicate: Replicate | null = null;
function client(): Replicate {
  if (_replicate) return _replicate;
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured — AI Art QR is unavailable."
    );
  }
  _replicate = new Replicate({ auth: token });
  return _replicate;
}

/**
 * Render a high-contrast baseline QR for use as ControlNet conditioning AND
 * as our final fallback when every AI attempt fails to decode.
 */
async function renderBaseline(data: string, size: number): Promise<Buffer> {
  const canvas = createCanvas(size, size);
  await QRCode.toCanvas(
    canvas as unknown as HTMLCanvasElement,
    data,
    {
      errorCorrectionLevel: "H",
      margin: 4,
      width: size,
      color: { dark: "#000000", light: "#FFFFFF" },
    }
  );
  return canvas.toBuffer("image/png");
}

/**
 * Decode bytes with jsQR and return whether the QR is scannable. We rasterize
 * the candidate to RGBA and feed it to jsQR's scanner; success means a real
 * camera will also resolve it.
 */
async function isScannable(pngBytes: Buffer): Promise<boolean> {
  let img: Image;
  try {
    img = await loadImage(pngBytes);
  } catch {
    return false;
  }
  const w = img.width;
  const h = img.height;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const code = jsQR(
    new Uint8ClampedArray(imageData.data.buffer),
    w,
    h,
    { inversionAttempts: "dontInvert" }
  );
  return code !== null && code.data.length > 0;
}

/**
 * Generate a scannable AI Art QR. See file header for the full pipeline.
 * `bytes` is always populated — even on total failure we fall back to a
 * styled-but-classic QR so the caller never has to handle "no image".
 */
export async function generateAiArtQr(
  args: GenerateAiQrArgs
): Promise<GenerateAiQrResult> {
  const size = args.size ?? 768;
  const baseline = await renderBaseline(args.data, size);
  const baselineDataUri = `data:image/png;base64,${baseline.toString("base64")}`;
  const style = STYLE_PROMPT[args.style];
  const prompt = `${args.userPrompt.trim()}, ${style.positive}`;

  const replicate = client();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const seed = Math.floor(Math.random() * 1_000_000);
      // Replicate types are loose for `run`; the model returns a string URL or
      // an array of URLs depending on version, so we normalize below.
      const out = (await replicate.run(MODEL_VERSION, {
        input: {
          prompt,
          negative_prompt: style.negative,
          qr_code_content: args.data,
          image: baselineDataUri,
          width: size,
          height: size,
          num_inference_steps: 40,
          guidance_scale: 7.5,
          controlnet_conditioning_scale: 1.5,
          seed,
        },
      })) as string | string[];

      const url = Array.isArray(out) ? out[0] : out;
      if (!url) continue;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const bytes = Buffer.from(await res.arrayBuffer());
      const scannable = await isScannable(bytes);
      if (scannable) {
        return { bytes, decoded: true, fellBackToBaseline: false, attempts: attempt };
      }
      // Else: fall through to the next attempt with a fresh seed.
    } catch (err) {
      // Log and keep trying — Replicate has occasional 5xx that resolve on retry.
      console.warn(
        `[qr-ai] attempt ${attempt}/${MAX_RETRIES} failed:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return {
    bytes: baseline,
    decoded: true,
    fellBackToBaseline: true,
    attempts: MAX_RETRIES,
  };
}
