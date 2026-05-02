// =============================================================================
// POST /api/v1/public/cards/[slug]/leads — public lead capture.
//
// Lives under /api/v1/public/* because it is unauthenticated; this also keeps
// the dynamic segment name (`slug`) consistent across all public-card routes
// and avoids the Next.js "different param names at the same level" routing
// conflict that would arise from putting `/cards/[slug]/leads` next to
// `/cards/[id]`.
//
// Auth: anonymous. Aggressive per-(slug,IP) rate limit because this is the
// primary spam target on the public card surface.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { readSourceFromSearchParams } from "@/components/cards/smart/SmartCardSource";
import { renderLeadNotification } from "@/lib/email/templates/lead-notification";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale } from "@/lib/email/shell";
import { dispatchWebhook } from "@/lib/webhook";
import { sendLeadTelegram } from "@/lib/notifications";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{3,60}$/;

const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const LeadInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z
    .string()
    .email()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  company: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  interest: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  meetingContext: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  consent: z.literal(true),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  if (!SLUG_RE.test(slug)) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  const ip = clientIp(req);
  const limit = hitWindow(`v1::lead::${slug}::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson("rate_limited", "Too many requests.", 429, {
        "Retry-After": String(limit.retryAfterSeconds ?? 60),
      }),
      req,
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
      editToken: true,
    },
  });
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  const body = await readJsonBody(req);
  const parsed = LeadInputSchema.safeParse(body);
  if (!parsed.success) {
    return applyCors(
      errorJson(
        "invalid_payload",
        parsed.error.issues[0]?.message ?? "Invalid payload.",
        400,
      ),
      req,
    );
  }

  const url = new URL(req.url);
  const source = readSourceFromSearchParams(url.searchParams);

  const lead = await prisma.cardLead.create({
    data: {
      orderId: order.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message ?? null,
      interest: parsed.data.interest ?? null,
      meetingContext: parsed.data.meetingContext ?? null,
      company: parsed.data.company ?? null,
    },
  });

  // Fire-and-forget side effects — never block the visitor's response on
  // SMTP / Telegram / webhook delivery. Errors stay in console / Sentry.
  void notifyOwner({ order, parsed: parsed.data, slug, source });
  void sendLeadTelegram({
    ownerName: order.contactName,
    cardSlug: slug,
    orderId: order.id,
    editToken: order.editToken,
    visitor: {
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      company: parsed.data.company ?? null,
      meetingContext: parsed.data.meetingContext ?? null,
      message: parsed.data.message ?? null,
    },
  });
  dispatchWebhook(order.id, "lead.created", {
    id: lead.id,
    slug,
    name: parsed.data.name,
    email: parsed.data.email ?? null,
    phone: parsed.data.phone ?? null,
    company: parsed.data.company ?? null,
    message: parsed.data.message ?? null,
    interest: parsed.data.interest ?? null,
    source: {
      src: source.src,
      campaign: source.campaign,
      event: source.event,
    },
    createdAt: lead.createdAt.toISOString(),
  });

  return applyCors(
    NextResponse.json(
      { ok: true, lead: { id: lead.id, createdAt: lead.createdAt.toISOString() } },
      { status: 201 },
    ),
    req,
  );
}

async function notifyOwner(args: {
  order: {
    id: string;
    contactEmail: string;
    contactName: string;
    locale: string;
    editToken: string | null;
  };
  parsed: z.infer<typeof LeadInputSchema>;
  source: ReturnType<typeof readSourceFromSearchParams>;
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
      replyTo: parsed.email,
    });
  } catch (err) {
    console.error("[v1/lead] notify-owner failed:", err);
  }
}
