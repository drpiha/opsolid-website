import { z } from "zod";
import { OPSO_CARD_PREVIEW_PATH } from "@/lib/opso-web/gateway";
import { appendedClientIp } from "@/lib/opso-web/auth-ip-proof";
import { CARD_DESIGN, CARD_FIELDS, CARD_LOCALE, cardStudioBase, limiter, smallJson, studioJson as json } from "@/lib/opso-web/card-studio";

/**
 * Card studio preview (OpSo NFC card). A fixed contract adapter, never a general proxy: the browser sends the five
 * card fields, the OpSo API draws the card with the same code that writes the print file, and this route returns the
 * two SVG faces after checking that they contain nothing but filled paths. No account, no cookie, nothing is stored.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const input = z.object({ ...CARD_FIELDS, locale: CARD_LOCALE }).strict();

const NUM = "[0-9]+(?:\\.[0-9]+)?";
/** Exactly what the card drawing emits: one ground rectangle and filled paths. Anything else is refused. */
const SVG_OK = new RegExp(
  `^<svg xmlns="http://www\\.w3\\.org/2000/svg" viewBox="0 0 ${NUM} ${NUM}">` +
    `<rect x="0" y="0" width="${NUM}" height="${NUM}" fill="#[0-9A-Fa-f]{6}"/>` +
    `(?:<path fill="#[0-9A-Fa-f]{6}" fill-rule="(?:evenodd|nonzero)" d="[MLHVAZCQ0-9eE .,+-]*"/>)*</svg>$`,
);
const upstream = z.object({
  design: CARD_DESIGN,
  orientation: z.enum(["landscape", "portrait"]),
  fits: z.boolean(),
  issues: z.array(z.string().max(300)).max(20),
  suggestedDesign: CARD_DESIGN.nullable().optional(),
  front: z.string().max(400_000).nullable(),
  back: z.string().max(400_000).nullable(),
  sampleCode: z.string().regex(/^[0-9a-z]{8}$/).optional(),
});

/**
 * 180 previews a minute per client address. The studio draws when typing pauses (450 ms) and at most about once
 * a second during steady typing, so one visitor cannot ask more than 133 times a minute and usually needs a few
 * dozen per card; the room above that is for people sharing a connection. The OpSo API allows 600 a minute for
 * this whole site, so this stays well below.
 */
const limited = limiter(180, 60_000);

export async function POST(request: Request) {
  if (limited(appendedClientIp(request.headers) ?? "unknown", Date.now())) return json({ error: "rate_limited" }, 429, { "Retry-After": "30" });
  const raw = await smallJson(request);
  if (raw === null) return json({ error: "invalid_request" }, 400);
  const parsed = input.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  let response: Response;
  try {
    response = await fetch(`${cardStudioBase()}${OPSO_CARD_PREVIEW_PATH}`, {
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
