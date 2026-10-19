import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { CardPreviewClient } from "./CardPreviewClient";

const meta = en.products.digitalCard.preview.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  // Demo surface with a fictional persona; /card-preview itself 301s to /opso.
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
  return <CardPreviewClient />;
}
