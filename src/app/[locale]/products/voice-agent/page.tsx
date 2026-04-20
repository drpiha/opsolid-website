import type { Metadata } from "next";
import { VoiceAgentPage } from "./VoiceAgentPage";

export const metadata: Metadata = {
  title: "Voice AI Agent · OpSolid",
  description:
    "24/7 phone answering, routing, and booking — built on Retell AI and Vapi with calendar sync.",
};

export default function Page() {
  return <VoiceAgentPage />;
}
