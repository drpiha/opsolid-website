"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

export function LeadQualifierPage() {
  const { t } = useLocale();
  const c = t.products.leadQualifier;

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="qualifier" />}
      liveDemo={<AgentDemoPreview variant="qualifier" />}
    />
  );
}
