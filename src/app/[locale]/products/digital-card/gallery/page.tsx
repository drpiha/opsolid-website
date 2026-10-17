import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "All Digital Card Designs | OpSo Smart",
  description:
    "Browse every OpSo Smart digital business card template — sorted by sector. Real Estate, Law, Restaurant, Fitness, Tech, and more.",
  openGraph: {
    title: "All Digital Card Designs | OpSo Smart",
    description:
      "Browse every OpSo Smart digital business card template — sorted by sector.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Digital Card Designs | OpSo Smart",
    description:
      "Browse every OpSo Smart digital business card template — sorted by sector.",
  },
};

export default function GalleryPage() {
  return (
    <div className="editor-light min-h-screen bg-bg-0">
      <GalleryClient />
    </div>
  );
}
