// =============================================================================
// GET /api/v1/cards/[id]/vcard — public vCard 4.0 download by card ID.
//
// Companion to the slug-keyed /api/cards/[slug]/vcard route. Where that route
// is keyed on the public slug (used by the share drawer + native viewer), this
// one is keyed on the card.id and lives under /api/v1 so it composes with the
// other versioned endpoints (mobile clients fetching by id, the public card
// page button, etc.).
//
// Access rules mirror the public card page (`/c/[slug]`):
//   - Card must be CardOrder.status === PUBLISHED.
//   - visibility === "private" → 404.
//   - cardData.password set: requires either ?token=<editToken> for owner
//     bypass OR a valid `verso_unlock_<slug>` cookie set by /unlock.
//
// Auth: none — this is a public endpoint. CORS allowlist applies.
//
// Returns: text/vcard; charset=utf-8 with `Content-Disposition: attachment`
// and a sanitized `verso-<slug>.vcf` filename. Cache-Control: 5 minutes,
// since saved cards may be re-edited and Contacts apps don't refresh on
// their own anyway.
// =============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { errorJson } from "@/lib/api/v1/errors";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";
import { constantTimeEquals } from "@/lib/constantTime";
import { unlockCookieName } from "@/lib/cards/unlock-cookie";
import { formatVCard, vcardDownloadFilename } from "@/lib/vcard-public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[a-z0-9_-]{8,40}$/i;

// Hard cap on inline-embedded photo bytes. The task brief specifies 200 KB —
// keeps the .vcf small enough that all major Contacts importers (iOS, Android,
// Outlook, macOS) accept it without truncation.
const INLINE_PHOTO_LIMIT = 200_000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!ID_RE.test(params.id)) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
  });

  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }
  // Phase 8.1 — private cards must not leak vCard data either.
  if (order.visibility === "private") {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) {
    return applyCors(
      errorJson("card_invalid", "Card data invalid.", 422),
      req,
    );
  }
  const cardData = parsed.data;

  // Password gate — same logic as `/c/[slug]/page.tsx`. We accept either a
  // ?token=<editToken> owner bypass or the `verso_unlock_<slug>` cookie set
  // when the visitor entered the password.
  const cardDataRaw = cardData as Record<string, unknown>;
  const passwordHash =
    typeof cardDataRaw.password === "string" && cardDataRaw.password.length > 0
      ? (cardDataRaw.password as string)
      : null;
  if (passwordHash) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") ?? "";
    const isOwner =
      Boolean(token) &&
      Boolean(order.editToken) &&
      constantTimeEquals(token, order.editToken!);
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const cookieName = unlockCookieName(order.slug ?? "");
    const hasUnlockCookie = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .some((c) => c.startsWith(`${cookieName}=`));
    if (!isOwner && !hasUnlockCookie) {
      return applyCors(
        errorJson("password_required", "Card is password protected.", 401),
        req,
      );
    }
  }

  // Photo: inline-embed when small (< 200 KB), otherwise skip — better to
  // ship a slim .vcf than blow up the import dialog with a multi-MB blob.
  // We HEAD-check Content-Length first; if the upstream omits it, we still
  // do a GET because most blob CDNs return Content-Length on GET even if
  // they didn't on HEAD. The buffer length check enforces the cap regardless.
  const siteUrl = getSiteUrl();
  const photoUrl = order.photoPath
    ? absoluteAssetUrl(order.photoPath, siteUrl)
    : null;
  let photoBytes: { mime: string; base64: string } | undefined;
  if (photoUrl && /^https:\/\//i.test(photoUrl)) {
    try {
      // Best-effort HEAD — if it returns Content-Length above the cap, skip.
      const head = await fetch(photoUrl, { method: "HEAD", cache: "no-store" });
      const lenHeader = head.headers.get("content-length");
      const declaredLen = lenHeader ? parseInt(lenHeader, 10) : NaN;
      if (Number.isFinite(declaredLen) && declaredLen > INLINE_PHOTO_LIMIT) {
        // Too big — skip without fetching the body.
      } else {
        const res = await fetch(photoUrl, { cache: "no-store" });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.byteLength <= INLINE_PHOTO_LIMIT) {
            const mime =
              (res.headers.get("content-type") ?? "image/jpeg")
                .split(";")[0]!
                .trim();
            photoBytes = { mime, base64: buf.toString("base64") };
          }
        }
      }
    } catch (err) {
      // Photo fetch failures are non-fatal; the .vcf still imports without it.
      console.warn("[v1/vcard] photo fetch failed:", err);
    }
  }

  const cardPageUrl = `${siteUrl.replace(/\/$/, "")}/c/${order.slug ?? ""}`;
  const vcard = formatVCard({
    cardData,
    photoBytes,
    cardPageUrl,
    revIso: order.updatedAt.toISOString(),
  });

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${vcardDownloadFilename(order.slug ?? "card")}"`,
      // 5-minute cache — cards may update, but a freshly-edited card whose
      // owner re-shares the link benefits from a quick refresh on their end.
      "Cache-Control": "public, max-age=300",
    },
  });
}
