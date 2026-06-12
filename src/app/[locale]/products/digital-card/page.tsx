import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { getCardPricingMode } from "@/lib/billing/plan";
import { DigitalCardPage } from "./DigitalCardPage";

const meta = en.products.digitalCard.meta;

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
  // Pricing mode resolved server-side so the client form never reads env
  // directly; under all_free the paid billing tiles disappear and checkout
  // is never offered. The optional ?event=<slug> fair param is handled
  // client-side (like ?template=) so this page stays statically prerendered.
  return <DigitalCardPage pricingMode={getCardPricingMode()} />;
}
