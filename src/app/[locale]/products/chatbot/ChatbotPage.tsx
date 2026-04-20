"use client";

import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { AgentDemoPreview } from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

export function ChatbotPage() {
  const { t } = useLocale();
  const c = t.products.chatbot;

  return (
    <ProductPageLayout
      content={c}
      heroMockup={<AgentDemoPreview variant="chat" />}
      liveDemo={<AgentDemoPreview variant="chat" />}
    />
  );
}
