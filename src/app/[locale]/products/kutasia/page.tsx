import type { Metadata } from "next";
import { KutasiaPage } from "./KutasiaPage";

export const metadata: Metadata = {
  title: "Kutasia — Multi-Sector Customer Platform",
  description:
    "Kutasia is OpSolid's multi-tenant SaaS platform for unified customer communication, sector-specific workflows, and AI-assisted analysis across 15+ industries.",
  openGraph: {
    title: "Kutasia | OpSolid",
    description:
      "Unify messaging, requests, bookings, and content in one AI-assisted workspace — tailored per sector.",
  },
};

export default function Page() {
  return <KutasiaPage />;
}
