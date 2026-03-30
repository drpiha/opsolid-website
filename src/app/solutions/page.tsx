import type { Metadata } from "next";
import { SolutionsPage } from "./SolutionsPage";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore our automation, internal tools, workflow systems, integrations, and AI-assisted operations solutions. Purpose-built for how your business works.",
  openGraph: {
    title: "Solutions | OpSolid",
    description:
      "Explore our automation, internal tools, workflow systems, integrations, and AI-assisted operations solutions.",
  },
};

export default function Page() {
  return <SolutionsPage />;
}
