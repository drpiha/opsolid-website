import type { Metadata } from "next";
import { LeadQualifierPage } from "./LeadQualifierPage";

export const metadata: Metadata = {
  title: "Lead Qualification Agent · OpSolid",
  description:
    "Conversational lead qualification via voice or chat — scored, routed, and synced to HubSpot.",
};

export default function Page() {
  return <LeadQualifierPage />;
}
