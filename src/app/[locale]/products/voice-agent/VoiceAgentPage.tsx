"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

export function VoiceAgentPage() {
  const { t } = useLocale();
  const c = t.products.voiceAgent;

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="voice" />}
      liveDemo={<AgentDemoPreview variant="voice" />}
    />
  );
}
