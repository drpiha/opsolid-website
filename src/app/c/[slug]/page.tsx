import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { getTemplateById } from "@/config/card-templates";
import { TemplateRenderer } from "@/components/cards/TemplateRenderer";
import { SaveContactButton } from "@/components/cards/shared/SaveContactButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadOrder(slug: string) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug },
  });
  if (!order || order.status !== "PUBLISHED") return null;
  return order;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const order = await loadOrder(slug);
  if (!order) return { title: "OpSolid" };

  const card = CardDataSchema.safeParse(order.cardData);
  const name = card.success ? card.data.name : order.contactName;
  const title = card.success ? card.data.title : "";
  const company = card.success ? card.data.company : "";

  return {
    title: `${name}${title ? " — " + title : ""} · OpSolid`,
    description:
      card.success && card.data.bio
        ? card.data.bio
        : company ?? "Digital business card hosted by OpSolid",
    openGraph: {
      title: `${name}${company ? " · " + company : ""}`,
      description: card.success ? card.data.bio : undefined,
      type: "profile",
      url: `https://opsolid.de/c/${slug}`,
      // 1200×630 first (used by Facebook, LinkedIn, Twitter X, Slack, Discord),
      // then the 600×600 square that WhatsApp / iMessage / Telegram prefer
      // in chat thumbnails — having both lets each platform pick its best fit.
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
    robots: { index: false, follow: false },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
  const order = await loadOrder(slug);
  if (!order) notFound();

  const template = getTemplateById(order.templateId);
  if (!template) notFound();

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) notFound();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 pb-32 md:py-20">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <TemplateRenderer
          componentKey={template.componentKey}
          cardData={parsed.data}
          photoPath={order.photoPath}
          logoPath={order.logoPath}
          brandPrimaryHex={order.brandPrimaryHex}
          brandAccentHex={order.brandAccentHex}
        />
        <div className="mt-6 text-center text-xs text-ink/40">
          <a
            href="https://opsolid.de/products/digital-card"
            className="underline underline-offset-4 hover:text-ink"
          >
            Powered by OpSolid · Your card in 48h
          </a>
        </div>
      </div>
      <SaveContactButton
        slug={slug}
        primaryHex={order.brandPrimaryHex}
        label="Save Contact"
      />
    </main>
  );
}
