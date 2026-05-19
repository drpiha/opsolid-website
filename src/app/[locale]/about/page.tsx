import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { AboutPage } from "./AboutPage";
import { AboutV2 } from "@/components/v2/about/AboutV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { isPreviewV2 } from "@/lib/preview";

const meta = en.v2.about.meta;

/**
 * Legacy /about route. The canonical URL is now /ueber-mich
 * (German-first positioning); /about is kept reachable so existing
 * inbound links don't 404. Canonical points to /ueber-mich and the
 * middleware redirects /about → /ueber-mich for clean SEO.
 */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: {
    canonical: "https://opsolid.de/de/ueber-mich",
  },
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

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <V2Shell>
        <AboutV2 />
      </V2Shell>
    );
  }
  return <AboutPage />;
}
