import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { ProductStubPage } from "@/components/products/ProductStubPage";

const meta = en.v2.productPages.pages.chatbotAgent.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

export default function Page() {
  return <ProductStubPage pageId="chatbotAgent" pricingProductId="chatbot-agent" />;
}
