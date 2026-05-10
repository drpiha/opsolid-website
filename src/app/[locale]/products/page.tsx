import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { ProductsHubPage } from "./ProductsHubPage";

const meta = en.v2.productsHub.meta;

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
  return <ProductsHubPage />;
}
