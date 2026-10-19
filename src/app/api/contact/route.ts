import { NextRequest, NextResponse } from "next/server";
import { hasEmailProvider, sendEmail } from "@/lib/email/client";
import { escapeHtml } from "@/lib/email/shell";
import { ContactRequestError, contactLimiter, contactSchema, readContactBody } from "@/lib/contact-guard";

export const runtime = "nodejs";

const unavailable = () => NextResponse.json(
  { error: "Message delivery is temporarily unavailable. Please try again later." },
  { status: 503 },
);
const tooMany = (retryAfter: number) => NextResponse.json(
  { error: "Too many requests. Please try again later." },
  { status: 429, headers: { "Retry-After": String(retryAfter) } },
);

// --- Per-client quota --------------------------------------------------------
// Traefik (default forwardedHeaders: client-sent X-Forwarded-* / X-Real-Ip are
// dropped) sends every request with X-Real-Ip equal to the hop it appended to
// X-Forwarded-For, and the container has no public port. Only that consistent
// pair identifies a client, so junk from one address no longer locks the form
// for everyone. Requests without it (direct hits, partial or spoofed headers)
// share the process-wide contactLimiter quota exactly as before, so made-up
// headers cannot multiply that budget. All of this is per process.
const WINDOW_MS = 10 * 60_000;
const CLIENT_MAX_ATTEMPTS = 5; // per client and window, junk included
const CLIENT_MAX_IN_FLIGHT = 2;
const CLIENT_MAX_KEYS = 10_000; // hard memory bound; oldest window evicted first
const IDENTIFIED_MAX_IN_FLIGHT = 16; // all identified clients together
const MAX_SENDS = 100; // delivered messages per window, all callers: mail-flood backstop

type Permit = { allowed: false; retryAfter: number } | { allowed: true; release: () => void };
type ClientWindow = { start: number; attempts: number; inFlight: number };

// Insertion order = window start (a renewed window is re-inserted), so expired
// entries always sit at the front of the Map.
const clients = new Map<string, ClientWindow>();
let identifiedInFlight = 0;
let sendWindowStart = 0;
let sends = 0;

const IP_SHAPE = /^[0-9A-Fa-f:.]{2,45}$/;

/** One IPv6 subscriber usually owns a whole /64: key on it, not on the address. */
function ipv6Prefix64(ip: string): string {
  const [head, tail] = ip.toLowerCase().split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const groups: string[] = [];
  for (let i = 0; i < 4; i++) {
    const fromTail = i - (8 - t.length);
    groups.push(i < h.length ? h[i] : fromTail >= 0 ? t[fromTail] : "0");
  }
  return `${groups.map((g) => parseInt(g, 16).toString(16)).join(":")}::/64`;
}

function clientKey(headers: Headers): string | null {
  const realIp = headers.get("x-real-ip")?.trim();
  const chain = headers.get("x-forwarded-for")?.split(",");
  const hop = chain ? chain[chain.length - 1].trim() : "";
  if (!realIp || realIp !== hop || !IP_SHAPE.test(realIp)) return null;
  if (realIp.includes(".")) return realIp.slice(realIp.lastIndexOf(":") + 1); // IPv4 or ::ffff:a.b.c.d
  return ipv6Prefix64(realIp);
}

function acquire(headers: Headers): Permit {
  const key = clientKey(headers);
  if (key === null) return contactLimiter.acquire();
  const now = Date.now();
  const expired = (w: ClientWindow) => now - w.start >= WINDOW_MS || now < w.start;
  for (let first = clients.keys().next(); !first.done; first = clients.keys().next()) {
    const w = clients.get(first.value)!;
    if (!expired(w) || w.inFlight > 0) break;
    clients.delete(first.value);
  }
  let w = clients.get(key);
  if (!w || expired(w)) {
    // Reuse the object: a release() from the previous window still points at it.
    w = w ?? { start: now, attempts: 0, inFlight: 0 };
    w.start = now;
    w.attempts = 0;
    clients.delete(key);
    if (clients.size >= CLIENT_MAX_KEYS) clients.delete(clients.keys().next().value!);
    clients.set(key, w);
  }
  if (w.attempts >= CLIENT_MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((w.start + WINDOW_MS - now) / 1_000)) };
  }
  if (w.inFlight >= CLIENT_MAX_IN_FLIGHT || identifiedInFlight >= IDENTIFIED_MAX_IN_FLIGHT) {
    return { allowed: false, retryAfter: 10 };
  }
  const client = w;
  client.attempts += 1;
  client.inFlight += 1;
  identifiedInFlight += 1;
  let released = false;
  return { allowed: true, release() {
    if (!released) { released = true; client.inFlight -= 1; identifiedInFlight -= 1; }
  } };
}

/** Counts only messages about to be delivered, so junk never uses this budget up. Returns a Retry-After or null. */
function chargeSend(): number | null {
  const now = Date.now();
  if (now - sendWindowStart >= WINDOW_MS || now < sendWindowStart) {
    sendWindowStart = now;
    sends = 0;
  }
  if (sends >= MAX_SENDS) return Math.max(1, Math.ceil((sendWindowStart + WINDOW_MS - now) / 1_000));
  sends += 1;
  return null;
}
// ----------------------------------------------------------------------------

/** Required: name/email/message. Existing optional company/source/teamSize,
 * phone/topics remain accepted; unknown legacy properties are ignored. */
export async function POST(req: NextRequest) {
  const permit = acquire(req.headers);
  if (!permit.allowed) return tooMany(permit.retryAfter);
  try {
    const body = await readContactBody(req);
    // The honeypot never triggers mail, even if the remaining bot payload is
    // invalid. It uses the same generic accepted response as a delivered form.
    if (body && typeof body === "object" && !Array.isArray(body) &&
        "website" in body && typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide valid contact details and a message." }, { status: 400 });
    }
    const { name, email, company, message, source, teamSize, phone, topics } = parsed.data;
    const contactTo = process.env.CONTACT_TO_EMAIL?.trim();
    if (!contactTo || !hasEmailProvider()) return unavailable();

    const subject = `New inquiry from ${name}${company ? ` (${company})` : ""}${source ? ` · source=${source}` : ""}`;
    const bodyLines = [`Name: ${name}`, `Email: ${email}`, `Company: ${company || "Not provided"}`];
    if (phone) bodyLines.push(`Phone: ${phone}`);
    if (topics?.length) bodyLines.push(`Topics: ${topics.join(", ")}`);
    if (source) bodyLines.push(`Source: ${source}`);
    if (teamSize) bodyLines.push(`Team size: ${teamSize}`);
    bodyLines.push("", "Message:", message, "", "---", "Sent from opsolid.de contact form", `Time: ${new Date().toISOString()}`);

    const sendRetryAfter = chargeSend();
    if (sendRetryAfter !== null) return tooMany(sendRetryAfter);
    const result = await sendEmail({
      to: contactTo,
      from: process.env.CONTACT_FROM_EMAIL || undefined,
      replyTo: email,
      subject,
      html: bodyLines.map((line) => line === "" ? "<br/>" : `<p style="margin:0 0 4px 0;">${escapeHtml(line)}</p>`).join(""),
      text: bodyLines.join("\n"),
    });
    return result.ok ? NextResponse.json({ success: true }) : unavailable();
  } catch (error) {
    if (error instanceof ContactRequestError) {
      return NextResponse.json({ error: "Invalid contact request." }, { status: error.status });
    }
    // Never return/log a thrown provider error or submitted content.
    return unavailable();
  } finally {
    permit.release();
  }
}
