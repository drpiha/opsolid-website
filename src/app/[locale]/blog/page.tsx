import type { Metadata } from "next";
import { BlogPage } from "./BlogPage";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on workflow automation, systems integration, AI, and operational efficiency from OpSolid.",
  openGraph: {
    title: "Blog | OpSolid",
    description:
      "Practical articles about workflow automation, integration strategies, and operational efficiency.",
  },
};

export default function Page() {
  return <BlogPage />;
}
