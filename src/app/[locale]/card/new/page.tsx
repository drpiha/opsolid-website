import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { QuickCreatePage } from "./QuickCreatePage";

const meta = en.card.quickCreate;

export const metadata: Metadata = {
  title: `${meta.title} · OpSolid`,
  description: meta.subtitle,
  robots: { index: true, follow: true },
};

export default function Page() {
  // The 60-second card flow — the fair invite link's landing page. Always
  // FREE (quick create never offers paid tiers); the full order form at
  // /products/digital-card remains for visitors who want every option.
  return <QuickCreatePage />;
}
