import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "All Digital Card Designs | OpSo Smart",
  description:
    "Browse all 98 digital business card templates — sorted by sector. Real Estate, Law, Restaurant, Fitness, Tech, and more. Pick a design and go live in minutes.",
  openGraph: {
    title: "All Digital Card Designs | OpSo Smart",
    description:
      "Browse all 98 digital business card templates — sorted by sector. Pick a design and go live in minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Digital Card Designs | OpSo Smart",
    description:
      "Browse all 98 digital business card templates — sorted by sector. Pick a design and go live in minutes.",
  },
};

export default function GalleryPage() {
  return (
    <div className="editor-light min-h-screen bg-bg-0">
      <GalleryClient />
    </div>
  );
}
