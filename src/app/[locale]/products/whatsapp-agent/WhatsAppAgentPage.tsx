"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

export function WhatsAppAgentPage() {
  const { t } = useLocale();
  const c = t.products.whatsappAgent;

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="whatsapp" />}
      liveDemo={<AgentDemoPreview variant="whatsapp" />}
    />
  );
}
