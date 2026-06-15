import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/stripe";
import { constantTimeEquals } from "@/lib/constantTime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your OpSolid card is live",
  robots: { index: false },
};

interface PageProps {
  params: Promise<{ locale: string; orderId: string }>;
  // `t` is the edit token, passed by the create flow / emailed to the owner.
  // Validated constant-time below before any owner/edit link is rendered.
  searchParams: Promise<{ t?: string }>;
}

export default async function ThanksPage({ params, searchParams }: PageProps) {
  const { locale, orderId } = await params;
  const { t: token } = await searchParams;
  const order = await prisma.cardOrder.findUnique({
    where: { id: orderId },
  });
  if (!order) notFound();

  const siteUrl = getSiteUrl();
  const cardUrl = order.slug ? `${siteUrl}/c/${order.slug}` : null;
  const qrDataUrl = cardUrl
    ? await QRCode.toDataURL(cardUrl, { width: 320, margin: 1 })
    : null;

  const isPublished = order.status === "PUBLISHED";
  const isAwaitingDesign =
    order.status === "PENDING_PAYMENT" ||
    order.status === "PAID" ||
    order.status === "AWAITING_DESIGN";

  // Owner affordances only when the caller proves possession of the edit token.
  const isOwner = Boolean(
    token && order.editToken && constantTimeEquals(token, order.editToken),
  );
  const editUrl = isOwner
    ? `/${locale}/card/edit/${order.id}?t=${encodeURIComponent(token!)}`
    : null;
  // Open the live card in owner mode so the share toolbar + one-click edit show.
  const openUrl =
    isOwner && cardUrl
      ? `${cardUrl}?owner=${encodeURIComponent(token!)}`
      : cardUrl;

  const copy = {
    de: {
      title: isPublished
        ? "Fertig. Deine Karte ist live."
        : "Zahlung bestätigt — unser Designer fertigt deine Karte an.",
      subtitle: isPublished
        ? "Teile den Link oder den QR-Code. Wir haben dir alles auch per E-Mail geschickt."
        : "Wir gestalten deine Karte von Hand. Lieferung innerhalb von 48 Stunden per E-Mail.",
      emailedLine:
        "Eine E-Mail mit deinem Karten-Link und einem privaten Bearbeitungs-Link ist unterwegs.",
      orderLabel: "Referenz",
      shareLabel: "Dein Link",
      qrHint: "QR-Code zum Teilen oder Drucken",
      openCta: "Karte öffnen",
      editCta: "Karte bearbeiten",
      newCardCta: "Weitere Karte erstellen",
    },
    en: {
      title: isPublished
        ? "Done. Your card is live."
        : "Payment confirmed — our designer is hand-crafting your card.",
      subtitle: isPublished
        ? "Share the link or the QR code. We have also emailed everything to you."
        : "We design your card by hand. You'll receive the link by email within 48 hours.",
      emailedLine:
        "An email with your card link and a private edit link is on its way.",
      orderLabel: "Reference",
      shareLabel: "Your link",
      qrHint: "QR code to share or print",
      openCta: "Open card",
      editCta: "Edit card",
      newCardCta: "Create another card",
    },
    tr: {
      title: isPublished
        ? "Hazır. Kartın yayında."
        : "Ödeme alındı — tasarımcımız kartını el ile hazırlıyor.",
      subtitle: isPublished
        ? "Linki veya QR kodunu paylaş. Hepsini sana e-posta ile de gönderdik."
        : "Kartını elle tasarlıyoruz. 48 saat içinde e-posta ile link göndeririz.",
      emailedLine:
        "Kart linkini ve özel düzenleme linkini içeren bir e-posta yolda.",
      orderLabel: "Referans",
      shareLabel: "Linkin",
      qrHint: "Paylaşmak veya basmak için QR kod",
      openCta: "Kartı aç",
      editCta: "Kartı düzenle",
      newCardCta: "Başka kart oluştur",
    },
  } as const;
  const L = copy[(locale as "de" | "en" | "tr") ?? "de"] ?? copy.de;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        {/* Order number kept only for the paid/designer path; the self-serve
            published path is not an "order", so it reads as a reference. */}
        {!isPublished && (
          <p className="text-eyebrow uppercase tracking-wider text-ink/50">
            {L.orderLabel} · #{order.orderNumber}
          </p>
        )}
        <h1 className="mt-4 font-display text-display-sm text-ink">{L.title}</h1>
        <p className="mt-4 text-body text-ink/60">{L.subtitle}</p>

        {isPublished && (
          <p className="mt-3 text-sm text-ink/50">{L.emailedLine}</p>
        )}

        {isPublished && cardUrl && (
          <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
            <p className="text-eyebrow uppercase text-ink/50">{L.shareLabel}</p>
            <a
              href={cardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block break-all text-heading-sm font-semibold text-ink hover:text-brand"
            >
              {cardUrl}
            </a>

            {qrDataUrl && (
              <div className="mt-6 flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={L.qrHint}
                  width={240}
                  height={240}
                  className="rounded-2xl border border-neutral-200"
                />
                <p className="text-xs text-ink/50">{L.qrHint}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={openUrl ?? cardUrl} className="btn-primary">
                <span>{L.openCta}</span>
              </a>
              {editUrl && (
                <a href={editUrl} className="btn-ghost">
                  <span>{L.editCta}</span>
                </a>
              )}
              <a
                href={`/${locale}/products/digital-card#templates`}
                className="btn-ghost"
              >
                <span>{L.newCardCta}</span>
              </a>
            </div>
          </div>
        )}

        {isAwaitingDesign && (
          <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
            <p className="text-sm text-ink/70">{L.subtitle}</p>
          </div>
        )}
      </div>
    </main>
  );
}
