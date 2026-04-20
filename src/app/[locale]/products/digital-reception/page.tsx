import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { DigitalReceptionPage } from "./DigitalReceptionPage";

const meta = en.products.digitalReception.meta;

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
  return <DigitalReceptionPage />;
}
