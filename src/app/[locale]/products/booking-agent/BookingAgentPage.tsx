"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { LaptopMockup } from "@/components/shared/mockups";
import { useLocale } from "@/context/LocaleContext";

export function BookingAgentPage() {
  const { t } = useLocale();
  const c = t.products.bookingAgent;

  const calcomUsername = process.env.NEXT_PUBLIC_CALCOM_USERNAME;
  const calcomEmbedUrl = calcomUsername
    ? `https://cal.com/${calcomUsername}?embed=true&layout=month_view`
    : null;

  const liveDemo = calcomEmbedUrl ? (
    <LaptopMockup
      src={calcomEmbedUrl}
      title="Live Cal.com booking"
      loading="lazy"
    />
  ) : (
    <AgentDemoPreview variant="booking" />
  );

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="booking" />}
      liveDemo={liveDemo}
    />
  );
}
