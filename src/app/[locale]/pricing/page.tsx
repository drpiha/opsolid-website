import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { PricingPage } from "./PricingPage";

const meta = en.v2.pricing.meta;

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
  return <PricingPage />;
}
