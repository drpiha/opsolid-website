import type { Metadata } from "next";
import { KutasiaPage } from "./KutasiaPage";

export const metadata: Metadata = {
  // Kutasia is a project in development, not a product yet: route stays reachable but is kept out of the index.
  robots: { index: false, follow: true },
  title: "Kutasia — Unified AI Workspace for SMBs",
  description:
    "Kutasia is OpSolid's unified AI workspace — WhatsApp, Telegram, Email and Voice in one inbox, with six demoable hero automations for SMBs across DACH and Turkey.",
  openGraph: {
    title: "Kutasia | OpSolid",
    description:
      "WhatsApp, Telegram, Email and Voice in one AI-assisted workspace — built for SMBs that run on customer conversations.",
  },
};

export default function Page() {
  return <KutasiaPage />;
}
