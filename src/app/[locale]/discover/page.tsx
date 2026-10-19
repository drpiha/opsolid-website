import type { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Discover Professionals",
  description: "Find and connect with professionals on OpSolid.",
  // App surface, not a marketing page: keep it out of the index.
  robots: { index: false, follow: true },
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
