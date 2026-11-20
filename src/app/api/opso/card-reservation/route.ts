import { z } from "zod";
import { OPSO_CARD_RESERVATION_PATH } from "@/lib/opso-web/gateway";
import { appendedClientIp } from "@/lib/opso-web/auth-ip-proof";
import { CARD_FIELDS, CARD_LOCALE, cardStudioBase, limiter, smallJson, studioJson as json } from "@/lib/opso-web/card-studio";

/**
 * Card studio "Vormerken" (OpSo NFC card): passes the address and the card draft to the OpSo API, which stores them
 * and sends the confirmation mail (double opt-in). A fixed contract adapter: this site stores nothing and sends no
 * mail itself. The answer never says whether an address is already registered.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const input = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    consent: z.literal(true),
    draft: z.object(CARD_FIELDS).strict(),
    locale: CARD_LOCALE,
    /** Trap field: people leave it empty. Its name is no word browser autofill knows (see the contact form). */
    hp_blank: z.string().max(200).optional(),
  })
  .strict();

/** 6 registrations in 10 minutes per client address; the OpSo API keeps its own limits per e-mail address. */
const limited = limiter(6, 600_000);

export async function POST(request: Request) {
  if (limited(appendedClientIp(request.headers) ?? "unknown", Date.now())) return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });
  const raw = await smallJson(request);
  if (raw === null) return json({ error: "invalid_request" }, 400);
  const parsed = input.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);
  const { hp_blank: trap, ...body } = parsed.data;
  // A filled trap gets the same answer as a real registration and goes nowhere.
  if (trap) return json({ ok: true });
  if (body.draft.name.trim().length < 2) return json({ error: "name_required" }, 422);

  let response: Response;
  try {
    response = await fetch(`${cardStudioBase()}${OPSO_CARD_RESERVATION_PATH}`, {
      method: "POST",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "OpSo-Web/1" },
      body: JSON.stringify(body),
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
  if (response.ok) return json({ ok: true });
  if (response.status === 422) return json({ error: "name_required" }, 422);
  if (response.status === 400) return json({ error: "invalid_request" }, 400);
  if (response.status === 429) return json({ error: "rate_limited" }, 429, { "Retry-After": "600" });
  return json({ error: "unavailable" }, 503);
}
