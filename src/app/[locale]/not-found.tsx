import type { Metadata } from "next";
import { LocaleNotFound } from "@/components/v4/LocaleNotFound";
import { NOT_FOUND_TITLE } from "@/components/v4/NotFoundView";

// robots: null drops the root layout's "index, follow"; Next adds the single
// <meta name="robots" content="noindex"> to every 404 itself.
export const metadata: Metadata = { title: NOT_FOUND_TITLE, robots: null };

export default function NotFound() {
  return <LocaleNotFound />;
}
