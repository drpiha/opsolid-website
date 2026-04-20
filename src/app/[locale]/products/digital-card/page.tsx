import type { Metadata } from "next";
import { content as en } from "@/content/en";
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
  return <DigitalCardPage />;
}
