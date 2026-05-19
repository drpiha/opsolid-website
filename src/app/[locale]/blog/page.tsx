import type { Metadata } from "next";
import { BlogPage } from "./BlogPage";
import { BlogV2 } from "@/components/v2/blog/BlogV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { isPreviewV2 } from "@/lib/preview";

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

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <V2Shell>
        <BlogV2 />
      </V2Shell>
    );
  }
  return <BlogPage />;
}
