import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { BookingInfo } from "./notifications";

const MAX_BYTES = 64 * 1024;
const MAX_AGE_MS = 5 * 60 * 1000;
const FUTURE_SKEW_MS = 60 * 1000;
const statuses = { BOOKING_CREATED: "created", BOOKING_CANCELLED: "cancelled", BOOKING_RESCHEDULED: "rescheduled" } as const;
const text = (max: number) => z.string().trim().max(max);
const person = z.object({ name: text(200), email: z.string().email().max(254) });
const envelope = z.object({ triggerEvent: text(80), createdAt: z.string().datetime({ offset: true }), payload: z.unknown() });
const booking = z.object({
  uid: text(200).min(1), title: text(300).optional(),
  startTime: z.string().datetime({ offset: true }), endTime: z.string().datetime({ offset: true }),
  location: text(1000).optional(), additionalNotes: text(5000).optional(),
  attendees: z.array(person).max(100).optional(),
  responses: z.object({ name: z.object({ value: text(200) }).optional(), email: z.object({ value: z.string().email().max(254) }).optional() }).optional(),
});

/** Single-container replay window. Not durable delivery or provider acceptance. */
export function createCalWebhookHandler(options: {
  secret: () => string | undefined;
  notify: (booking: BookingInfo) => Promise<void>;
  now?: () => number;
  maxReceipts?: number;
}) {
  const receipts = new Map<string, { expiry: number; accepted: boolean }>();
  let active = 0;
  const now = options.now ?? Date.now;
  const capacity = options.maxReceipts ?? 2000;
  const response = (status: number, body: object) => Response.json(body, { status });
  const handle = async (req: Request): Promise<Response> => {
    const secret = options.secret();
    if (!secret) return response(503, { error: "Webhook is not configured" });
    if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return response(415, { error: "JSON required" });
    const signature = req.headers.get("x-cal-signature-256") ?? "";
    if (!/^[a-fA-F0-9]{64}$/.test(signature)) return response(401, { error: "Invalid signature" });
    const reader = req.body?.getReader();
    if (!reader) return response(400, { error: "Invalid payload" });
    const chunks: Uint8Array[] = [];
    let size = 0;
    let timedOut = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        timedOut = true;
        reject(new Error("Body deadline"));
        void reader.cancel().catch(() => undefined);
      }, 10_000);
    });
    try {
      for (;;) {
        const part = await Promise.race([reader.read(), deadline]);
        if (part.done) break;
        size += part.value.byteLength;
        if (size > MAX_BYTES) { void reader.cancel().catch(() => undefined); return response(413, { error: "Payload too large" }); }
        chunks.push(part.value);
      }
    } catch { return response(timedOut ? 408 : 400, { error: "Invalid payload" }); }
    finally { clearTimeout(timer); reader.releaseLock(); }
    const raw = Buffer.concat(chunks);
    const expected = createHmac("sha256", secret).update(raw).digest();
    if (!timingSafeEqual(Buffer.from(signature, "hex"), expected)) return response(401, { error: "Invalid signature" });
    let parsed: unknown;
    try { parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw)); }
    catch { return response(400, { error: "Invalid payload" }); }
    const event = envelope.safeParse(parsed);
    if (!event.success) return response(400, { error: "Invalid payload" });
    const timestamp = now();
    const createdAt = Date.parse(event.data.createdAt);
    if (!Number.isFinite(timestamp) || createdAt < timestamp - MAX_AGE_MS || createdAt > timestamp + FUTURE_SKEW_MS) return response(400, { error: "Expired event" });
    if (!Object.hasOwn(statuses, event.data.triggerEvent)) return response(200, { ok: true, ignored: true });
    const value = booking.safeParse(event.data.payload);
    if (!value.success || Date.parse(value.data.endTime) < Date.parse(value.data.startTime)) return response(400, { error: "Invalid payload" });
    const data = value.data;
    const name = data.responses?.name?.value || data.attendees?.[0]?.name;
    const email = data.responses?.email?.value || data.attendees?.[0]?.email;
    if (!name || !email) return response(400, { error: "Invalid attendee" });
    receipts.forEach((value, key) => { if (value.expiry < timestamp) receipts.delete(key); });
    const receipt = createHash("sha256").update(JSON.stringify([event.data.triggerEvent, data.uid, createdAt])).digest("hex");
    const previous = receipts.get(receipt);
    if (previous) return previous.accepted
      ? response(200, { ok: true, duplicate: true })
      : response(503, { error: "Notification delivery unconfirmed", duplicate: true });
    if (receipts.size >= capacity) return response(503, { error: "Webhook temporarily unavailable" });
    // Reserve before awaiting. Retain uncertain deliveries to avoid repeating sent channels.
    const delivery = { expiry: createdAt + MAX_AGE_MS + FUTURE_SKEW_MS, accepted: false };
    receipts.set(receipt, delivery);
    try {
      await options.notify({ title: data.title || "Discovery Call", name, email,
        startTime: data.startTime, endTime: data.endTime,
        status: statuses[event.data.triggerEvent as keyof typeof statuses],
        location: data.location, notes: data.additionalNotes });
      delivery.accepted = true;
      return response(200, { ok: true });
    } catch { return response(503, { error: "Notification delivery unavailable" }); }
  };
  return async (req: Request): Promise<Response> => {
    if (active >= 4) return response(503, { error: "Webhook temporarily unavailable" });
    active += 1;
    try { return await handle(req); }
    finally { active -= 1; }
  };
}
