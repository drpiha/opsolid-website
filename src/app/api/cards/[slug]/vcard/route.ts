// =============================================================================
// GET /api/cards/[slug]/vcard
//
// Streams a vCard 4.0 (.vcf) file for a published card. Tapped from the public
// card page's "Save Contact" button — iOS opens it in Contacts directly,
// Android offers Contacts/Gmail import, desktop browsers download the file.
//
// Photo handling:
//   - Inline base64 embed when the photo is < 1.5 MB (most cases).
//   - Otherwise, URL reference — keeps the .vcf small and avoids breaking
//     import on older devices that choke on multi-MB inline blobs.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { buildVCard, buildVCard3, vcardFilename } from "@/lib/vcard";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";
import {
  readSourceFromSearchParams,
  describeSource,
} from "@/components/cards/smart/SmartCardSource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INLINE_PHOTO_LIMIT = 1_500_000; // 1.5 MB

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug: params.slug },
  });

  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card data" }, { status: 500 });
  }
  const cardData = parsed.data;

  const url = new URL(req.url);
  const source = readSourceFromSearchParams(url.searchParams);
  const sourceLabel = describeSource(source);

  const siteUrl = getSiteUrl();
  const cardPageUrl = `${siteUrl}/c/${params.slug}`;
  const photoUrl = order.photoPath
    ? absoluteAssetUrl(order.photoPath, siteUrl)
    : undefined;

  // Best-effort inline embed — fetch the photo, base64-encode if small enough.
  // Failures fall back to URL reference (most clients still render fine).
  let photoBytes: { mime: string; base64: string } | undefined;
  if (photoUrl) {
    try {
      const res = await fetch(photoUrl, {
        // No need for the next/image cache layer here — vCard generation is
        // user-triggered and infrequent.
        cache: "no-store",
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength <= INLINE_PHOTO_LIMIT) {
          const mime = res.headers.get("content-type") ?? "image/jpeg";
          photoBytes = {
            mime: mime.split(";")[0]!.trim(),
            base64: buf.toString("base64"),
          };
        }
      }
    } catch (err) {
      // Non-fatal: we'll fall back to a URL reference below.
      console.warn("[vcard] photo fetch failed:", err);
    }
  }

  // A3 — ?v=3 requests vCard 3.0 for Android compatibility. SmartCard appends
  // this when isAndroidUA() is true. All other clients get 4.0 (default).
  const vcardVersion = url.searchParams.get("v");
  const builder = vcardVersion === "3" ? buildVCard3 : buildVCard;
  const vcard = builder({
    cardData,
    photoUrl: photoBytes ? undefined : photoUrl,
    photoBytes,
    cardPageUrl,
    sourceLabel,
    locale: order.locale,
  });

  // B2 — iOS Safari opens a native contact sheet when Content-Disposition is
  // `inline`; Android triggers a file download with `attachment`. For all
  // other clients (desktop browsers, no UA) `inline` is the safe default —
  // browsers either open the system contact handler or prompt a download,
  // whereas `attachment` always forces a download and breaks native contact
  // import on iOS when accessed outside of the SmartCard page.
  const ua = req.headers.get("user-agent") ?? "";
  const isAndroid = /android/i.test(ua);
  const disposition = isAndroid ? "attachment" : "inline";

  // Encoding fix: iOS Contacts ignores the HTTP `charset` when importing a
  // .vcf and falls back to Mac Roman, turning UTF-8 Turkish letters into
  // mojibake (ö → "√∂"). A leading UTF-8 BOM forces iOS to decode as UTF-8.
  // We add it only for the non-Android (iOS/desktop, vCard 4.0) path — some
  // strict older Android 3.0 parsers choke on a BOM before BEGIN:VCARD.
  const bom = isAndroid ? "" : "\uFEFF";
  const body = Buffer.from(bom + vcard, "utf-8");

  return new NextResponse(body, {
    status: 200,
    headers: {
      // B2 — text/vcard (RFC 6350 registered MIME) is required for iOS Safari
      // to open the native Contacts sheet. text/x-vcard is a legacy alias that
      // works on desktop but NOT on iOS — the OS ignores it and prompts a
      // file download instead of opening Contacts.
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `${disposition}; filename="${vcardFilename(cardData.name)}"`,
      // Short browser cache so a "Save Contact" tap doesn't re-render the file
      // each time, but new edits propagate fast (we re-read the order on
      // every request anyway — this is just network-level caching).
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
