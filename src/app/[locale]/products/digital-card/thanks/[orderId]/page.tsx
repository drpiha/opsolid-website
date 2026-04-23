import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you — your OpSolid card is live",
  robots: { index: false },
};

interface PageProps {
  params: Promise<{ locale: string; orderId: string }>;
}

export default async function ThanksPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  const order = await prisma.cardOrder.findUnique({
    where: { id: orderId },
  });
  if (!order) notFound();

  const siteUrl = getSiteUrl();
  const cardUrl = order.slug ? `${siteUrl}/c/${order.slug}` : null;
  const qrDataUrl = cardUrl ? await QRCode.toDataURL(cardUrl, { width: 320, margin: 1 }) : null;

  const isPublished = order.status === "PUBLISHED";
  const isAwaitingDesign =
    order.status === "PENDING_PAYMENT" ||
    order.status === "PAID" ||
    order.status === "AWAITING_DESIGN";

  const copy = {
    de: {
      title: isPublished
        ? "Bereit. Ihre Karte ist live."
        : "Zahlung bestätigt — unser Designer fertigt Ihre Karte an.",
      subtitle: isPublished
        ? "Teilen Sie den Link oder den QR-Code."
        : "Wir gestalten Ihre Karte von Hand. Lieferung innerhalb von 48 Stunden per E-Mail.",
      orderLabel: "Bestellnummer",
      shareLabel: "Ihr Link",
      qrHint: "QR-Code zum Teilen oder Drucken",
      openCta: "Karte öffnen",
      newCardCta: "Weitere Karte bestellen",
    },
    en: {
      title: isPublished
        ? "Ready. Your card is live."
        : "Payment confirmed — our designer is hand-crafting your card.",
      subtitle: isPublished
        ? "Share the link or the QR code."
        : "We design your card by hand. You'll receive the link by email within 48 hours.",
      orderLabel: "Order number",
      shareLabel: "Your link",
      qrHint: "QR code to share or print",
      openCta: "Open card",
      newCardCta: "Order another card",
    },
    tr: {
      title: isPublished
        ? "Hazır. Kartınız yayında."
        : "Ödeme alındı — tasarımcımız kartınızı el ile hazırlıyor.",
      subtitle: isPublished
        ? "Linki veya QR kodunu paylaşın."
        : "Kartınızı elle tasarlıyoruz. 48 saat içinde e-posta ile link göndeririz.",
      orderLabel: "Sipariş no",
      shareLabel: "Linkiniz",
      qrHint: "Paylaşmak veya basmak için QR kod",
      openCta: "Kartı aç",
      newCardCta: "Başka kart sipariş et",
    },
  } as const;
  const L = copy[(locale as "de" | "en" | "tr") ?? "de"] ?? copy.de;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        <p className="text-eyebrow uppercase tracking-wider text-ink/50">
          {L.orderLabel} · #{order.orderNumber}
        </p>
        <h1 className="mt-4 font-display text-display-sm text-ink">{L.title}</h1>
        <p className="mt-4 text-body text-ink/60">{L.subtitle}</p>

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
              <a href={cardUrl} className="btn-primary">
                <span>{L.openCta}</span>
              </a>
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
