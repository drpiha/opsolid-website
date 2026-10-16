import type { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Discover Professionals",
  description: "Find and connect with professionals on OpSolid.",
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
