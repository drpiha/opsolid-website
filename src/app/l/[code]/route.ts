// =============================================================================
// /l/[code] — Smart Card short-link gateway.
//
// Reachable via two hostnames (host-rewritten by middleware):
//   • opsolid.de/l/[code]      — internal canonical
//   • go.opsolid.de/[code]     — public branded short link
//
// Flow:
//   1. Look up CardLink by code
//   2. Record a ScanEvent (link metadata + UA + hashed IP)
//   3. 307-redirect to the resolved destination (default: card.opsolid.de/<slug>)
//
// We deliberately do NOT cache — every scan must be tracked, and the redirect
// is fast enough (<10ms with a hot Postgres) to not need caching.
// =============================================================================

import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { publicCardUrlFor } from "@/lib/card-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** sha256(ip) — opaque, not reversible, lets us count uniques without
 *  storing addresses. Phase 6 will add a rotating server salt + retention TTL. */
function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function detectDevice(ua: string): string {
  const lower = ua.toLowerCase();
  if (/bot|crawl|spider|slurp|preview|whatsapp|facebookexternalhit|telegrambot|discordbot/.test(lower)) {
    return "bot";
  }
  if (/ipad|tablet/.test(lower)) return "tablet";
  if (/mobile|iphone|android/.test(lower)) return "mobile";
  return "desktop";
}

export async function GET(
  req: Request,
  { params }: { params: { code: string } },
) {
  const code = params.code.trim();
  if (!code || code.length > 64) {
    return NextResponse.redirect("https://opsolid.de/", 307);
  }

  const link = await prisma.cardLink.findUnique({
    where: { code },
    include: {
      order: { select: { slug: true, status: true } },
    },
  });

  if (!link || !link.active || !link.order || link.order.status !== "PUBLISHED" || !link.order.slug) {
    return NextResponse.redirect("https://opsolid.de/", 307);
  }

  // Record the scan before we redirect so analytics survive a closed tab.
  // Failures are non-fatal — the redirect always happens.
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const referer = req.headers.get("referer")?.slice(0, 500) ?? null;

  void prisma.scanEvent
    .create({
      data: {
        orderId: link.orderId,
        linkId: link.id,
        source: link.source,
        campaign: link.campaign,
        eventName: link.eventName,
        referer,
        userAgent: ua || null,
        deviceType: ua ? detectDevice(ua) : null,
        ipHash: ip ? hashIp(ip) : null,
      },
    })
    .catch(() => {});

  // Build destination URL. Custom destinationUrl wins; otherwise the card's
  // public URL (publicCardUrlFor — canonical opsolid.de/c/<slug> unless a
  // verified NEXT_PUBLIC_CARD_HOST is configured). Source/campaign/event are
  // appended so the landing page knows where the visitor came from (and can
  // flow through to the vCard download / lead form).
  const destination =
    link.destinationUrl?.trim() || publicCardUrlFor(link.order.slug);

  const url = new URL(destination);
  if (link.source) url.searchParams.set("src", link.source);
  if (link.campaign) url.searchParams.set("campaign", link.campaign);
  if (link.medium) url.searchParams.set("medium", link.medium);
  if (link.eventName) url.searchParams.set("event", link.eventName);
  url.searchParams.set("link", code);

  return NextResponse.redirect(url.toString(), 307);
}
