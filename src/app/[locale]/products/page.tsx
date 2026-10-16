import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { ProductsHubPage } from "./ProductsHubPage";

const meta = en.v2.productsHub.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  // Legacy product hub that still lists Kutasia as a product; kept reachable but out of the index.
  robots: { index: false, follow: true },
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
  return <ProductsHubPage />;
}
