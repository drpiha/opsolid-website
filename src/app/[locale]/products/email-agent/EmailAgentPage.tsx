"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

export function EmailAgentPage() {
  const { t } = useLocale();
  const c = t.products.emailAgent;

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="email" />}
      liveDemo={<AgentDemoPreview variant="email" />}
    />
  );
}
