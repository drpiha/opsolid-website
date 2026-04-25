// =============================================================================
// POST /api/cards/[slug]/lead
//
// Stores a CardLead row from the public Smart Card "Bilgilerimi Gönder" form.
// Source tracking (?src=…&campaign=…&event=…) is captured from the URL query
// string and persisted alongside the lead so the card owner can see where
// each contact came from.
//
// Phase 1: persists to DB. Phase 2 will add: SMTP notification, admin
// dashboard listing, lead status workflow (new → contacted → qualified …).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { readSourceFromSearchParams, describeSource } from "@/components/cards/smart/SmartCardSource";
import { renderLeadNotification } from "@/lib/email/templates/lead-notification";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale } from "@/lib/email/shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LeadInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().email().max(200).optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  company: z.string().trim().max(160).optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  interest: z.string().trim().max(160).optional().or(z.literal("").transform(() => undefined)),
  meetingContext: z.string().trim().max(160).optional().or(z.literal("").transform(() => undefined)),
  consent: z.literal(true),
});

// Tight per-IP rate limit. The lead form is the most abuse-prone surface
// (random bots, form-spam crawlers); cap at 5 submissions / 10 minutes per
// (slug, ip) combination. Stored in a process-local Map — fine for a single
// container; revisit if we move to multi-instance deploys.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateBucket = new Map<string, number[]>();

function rateLimitKey(slug: string, req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return `${slug}::${ip}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBucket.get(key) ?? [];
  const fresh = bucket.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateBucket.set(key, fresh);
    return false;
  }
  fresh.push(now);
  rateBucket.set(key, fresh);
  return true;
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;

  if (!checkRateLimit(rateLimitKey(slug, req))) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 },
    );
  }

  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    select: {
      id: true,
      status: true,
      contactEmail: true,
      contactName: true,
      locale: true,
    },
  });
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = LeadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Eingabe ungültig." },
      { status: 400 },
    );
  }

  const url = new URL(req.url);
  const source = readSourceFromSearchParams(url.searchParams);
  const sourceLabel = describeSource(source);

  // Compose the message body so existing CardLead.message field captures the
  // full visit context. Phase 2 will split these into dedicated columns.
  const messageParts: string[] = [];
  if (parsed.data.message) messageParts.push(parsed.data.message);
  if (parsed.data.interest) messageParts.push(`Interesse: ${parsed.data.interest}`);
  if (parsed.data.meetingContext)
    messageParts.push(`Kontext: ${parsed.data.meetingContext}`);
  if (parsed.data.company) messageParts.push(`Unternehmen: ${parsed.data.company}`);
  if (sourceLabel) messageParts.push(`Quelle: ${sourceLabel}`);

  await prisma.cardLead.create({
    data: {
      orderId: order.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: messageParts.join("\n") || null,
    },
  });

  // Fire-and-forget email notification to the card owner. SMTP is optional
  // (sendCustomerEmail no-ops with a warn log when env is missing) so we
  // never block the visitor's submit on mail delivery.
  void notifyCardOwner({ order, parsed: parsed.data, source, sourceLabel, slug });

  return NextResponse.json({ ok: true });
}

async function notifyCardOwner(args: {
  order: { id: string; contactEmail: string; contactName: string; locale: string };
  parsed: z.infer<typeof LeadInputSchema>;
  source: ReturnType<typeof readSourceFromSearchParams>;
  sourceLabel?: string;
  slug: string;
}) {
  try {
    const { order, parsed, source, slug } = args;
    const locale = normalizeLocale(order.locale);
    const { subject, html, text } = renderLeadNotification(
      {
        ownerName: order.contactName,
        cardSlug: slug,
        orderId: order.id,
        visitor: {
          name: parsed.name,
          email: parsed.email ?? null,
          phone: parsed.phone ?? null,
          company: parsed.company ?? null,
          message: parsed.message ?? null,
          interest: parsed.interest ?? null,
          meetingContext: parsed.meetingContext ?? null,
        },
        source: {
          src: source.src,
          campaign: source.campaign,
          event: source.event,
          location: source.location,
        },
      },
      locale,
    );
    await sendCustomerEmail({
      to: order.contactEmail,
      subject,
      html,
      text,
      // Hitting "Reply" emails the visitor directly when they provided one.
      replyTo: parsed.email,
    });
  } catch (err) {
    console.error("[lead] notify-owner failed:", err);
  }
}
