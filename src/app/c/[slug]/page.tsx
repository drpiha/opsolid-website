// =============================================================================
// /c/[slug] — public Smart Card page.
//
// This route is reachable on three hostnames:
//   • opsolid.de/c/[slug]        — internal canonical (used by /api routes)
//   • card.opsolid.de/[slug]     — host-rewritten by middleware to /c/[slug]
//   • go.opsolid.de/[slug]       — Phase 3 will switch this to short-link gateway
//
// Renders the Smart Card layout with full feature set (services, gallery,
// FAQ, testimonials, video, brochure). Source query parameters
// (?src=…&campaign=…&event=…) are captured here so:
//   - the vCard download link inherits them (NOTE field gets the source label)
//   - lead form posts include them
//   - we can record a CardView with `source=` for analytics
// =============================================================================

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { WalletButtons } from "@/components/cards/smart/WalletButtons";
import { readSourceFromSearchParams } from "@/components/cards/smart/SmartCardSource";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function loadOrder(slug: string) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug },
  });
  if (!order || order.status !== "PUBLISHED") return null;
  return order;
}

/**
 * Public-facing canonical URL — prefers the `card.opsolid.de` subdomain when
 * the page was accessed from there, otherwise falls back to opsolid.de/c/[slug].
 * Used in <link rel="canonical"> and Open Graph URLs to keep social previews
 * pointing at the prettier hostname.
 */
async function publicCardUrl(slug: string): Promise<string> {
  const h = await headers();
  const host = (h.get("host") || "").toLowerCase();
  if (host === "card.opsolid.de" || host === "go.opsolid.de") {
    return `https://card.opsolid.de/${slug}`;
  }
  const site = getSiteUrl().replace(/\/$/, "");
  return `${site}/c/${slug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const order = await loadOrder(slug);
  if (!order) return { title: "OpSolid Smart Card", robots: { index: false } };

  const card = CardDataSchema.safeParse(order.cardData);
  const name = card.success ? card.data.name : order.contactName;
  const title = card.success ? card.data.title : "";
  const company = card.success ? card.data.company : "";
  const bio = card.success ? card.data.bio : undefined;

  const url = await publicCardUrl(slug);

  return {
    title: `${name}${title ? " — " + title : ""} · OpSolid Smart Card`,
    description: bio ?? company ?? "Digital business card — OpSolid Smart Card",
    alternates: { canonical: url },
    openGraph: {
      title: `${name}${company ? " · " + company : ""}`,
      description: bio,
      type: "profile",
      url,
      // 1200×630 first (Facebook, LinkedIn, X, Slack, Discord), 600×600 second
      // for WhatsApp / iMessage / Telegram chat thumbnails.
      images: [
        {
          url: `/c/${slug}.png`,
          width: 1200,
          height: 630,
          alt: `${name}${company ? " · " + company : ""}`,
        },
        {
          url: `/c/${slug}/wa.png`,
          width: 600,
          height: 600,
          alt: `${name}${company ? " · " + company : ""}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/c/${slug}.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const order = await loadOrder(slug);
  if (!order) notFound();

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) notFound();

  const source = readSourceFromSearchParams(sp);

  // Fire-and-forget view tracking. We deliberately await on a Promise.race
  // so a slow DB write can't block the page render — the render proceeds
  // either way, and Prisma queues the insert.
  void prisma.cardView
    .create({
      data: {
        orderId: order.id,
        source: source.src ?? source.medium ?? null,
        ua: ((await headers()).get("user-agent") ?? "").slice(0, 200) || null,
        referer: (await headers()).get("referer")?.slice(0, 500) ?? null,
      },
    })
    .catch(() => {});

  const siteUrl = getSiteUrl();

  return (
    <main className="min-h-screen bg-bg-0 px-4 py-8 pb-24 sm:py-12">
      <div className="mx-auto w-full max-w-[440px]">
        <SmartCard
          slug={slug}
          cardData={parsed.data}
          photoPath={order.photoPath}
          logoPath={order.logoPath}
          brandPrimaryHex={order.brandPrimaryHex}
          brandAccentHex={order.brandAccentHex}
          source={source}
          siteUrl={siteUrl}
          locale={
            order.locale === "en" || order.locale === "tr" ? order.locale : "de"
          }
          walletSlot={<WalletButtons slug={slug} />}
        />
      </div>
    </main>
  );
}
