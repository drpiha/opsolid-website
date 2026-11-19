import { z } from "zod";
import { OPSO_API, OPSO_CARD_PREVIEW_PATH } from "@/lib/opso-web/gateway";
import { appendedClientIp } from "@/lib/opso-web/auth-ip-proof";

/**
 * Card studio preview (OpSo NFC card). A fixed contract adapter, never a general proxy: the browser sends the five
 * card fields, the OpSo API draws the card with the same code that writes the print file, and this route returns the
 * two SVG faces after checking that they contain nothing but filled paths. No account, no cookie, nothing is stored.
 * `OPSO_CARD_PREVIEW_BASE` points a development build at a local stand-in; production always uses the OpSo API.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const text = (max: number) => z.string().max(max);
const input = z
  .object({
    design: z.enum(["onyx", "linea", "monolith"]),
    name: text(40),
    title: text(40).default(""),
    org: text(48).default(""),
    lines: z.array(text(64)).max(2).default([]),
    locale: z.enum(["de", "en", "tr"]),
  })
  .strict();

const NUM = "[0-9]+(?:\\.[0-9]+)?";
/** Exactly what the card drawing emits: one ground rectangle and filled paths. Anything else is refused. */
const SVG_OK = new RegExp(
  `^<svg xmlns="http://www\\.w3\\.org/2000/svg" viewBox="0 0 ${NUM} ${NUM}">` +
    `<rect x="0" y="0" width="${NUM}" height="${NUM}" fill="#[0-9A-Fa-f]{6}"/>` +
    `(?:<path fill="#[0-9A-Fa-f]{6}" fill-rule="(?:evenodd|nonzero)" d="[MLHVAZCQ0-9eE .,+-]*"/>)*</svg>$`,
);
const upstream = z.object({
  design: z.enum(["onyx", "linea", "monolith"]),
  orientation: z.enum(["landscape", "portrait"]),
  fits: z.boolean(),
  issues: z.array(z.string().max(300)).max(20),
  suggestedDesign: z.enum(["onyx", "linea", "monolith"]).nullable().optional(),
  front: z.string().max(400_000).nullable(),
  back: z.string().max(400_000).nullable(),
  sampleCode: z.string().regex(/^[0-9a-z]{8}$/).optional(),
});

const buckets = new Map<string, { count: number; expires: number }>();
/** 90 previews a minute per client address: typing with a 160 ms debounce stays far below it. */
function limited(key: string, now: number): boolean {
  buckets.forEach((b, k) => { if (b.expires <= now) buckets.delete(k); });
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 10_000) return true;
    bucket = { count: 0, expires: now + 60_000 };
    buckets.set(key, bucket);
  }
  return ++bucket.count > 90;
}

function base(): string {
  const dev = process.env.OPSO_CARD_PREVIEW_BASE;
  return process.env.NODE_ENV !== "production" && dev && /^http:\/\/127\.0\.0\.1:\d{2,5}\/api$/.test(dev) ? dev : OPSO_API;
}

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });

export async function POST(request: Request) {
  if (limited(appendedClientIp(request.headers) ?? "unknown", Date.now())) return json({ error: "rate_limited" }, 429, { "Retry-After": "30" });
  let raw: unknown;
  try {
    const body = await request.text();
    if (body.length > 4096) return json({ error: "invalid_request" }, 400);
    raw = JSON.parse(body);
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const parsed = input.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  let response: Response;
  try {
    response = await fetch(`${base()}${OPSO_CARD_PREVIEW_PATH}`, {
      method: "POST",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "OpSo-Web/1" },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return json({ error: "preview_unavailable" }, 503);
  }
  if (response.status === 422) return json({ error: "name_required" }, 422);
  if (!response.ok) return json({ error: "preview_unavailable" }, response.status === 429 ? 429 : 503);
  let data: z.infer<typeof upstream>;
  try {
    data = upstream.parse(await response.json());
  } catch {
    return json({ error: "preview_unavailable" }, 502);
  }
  for (const face of [data.front, data.back]) {
    if (face !== null && !SVG_OK.test(face)) return json({ error: "preview_unavailable" }, 502);
  }
  // Internal messages stay on the server; the page only needs to know whether it fits and which characters fail.
  const glyphs = data.issues.find((issue) => issue.startsWith("glyphs:"))?.slice(7, 47) ?? null;
  return json({
    design: data.design,
    orientation: data.orientation,
    fits: data.fits,
    unsupported: glyphs,
    suggestedDesign: data.suggestedDesign ?? null,
    front: data.front,
    back: data.back,
    sampleCode: data.sampleCode ?? null,
  });
}
