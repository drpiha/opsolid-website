import type { Metadata } from "next";
import { EmailAgentPage } from "./EmailAgentPage";

export const metadata: Metadata = {
  title: "Email Automation Agent · OpSolid",
  description:
    "AI inbox triage, reply drafting, and cold outreach — built on Instantly, AgentMail, and custom n8n flows.",
};

export default function Page() {
  return <EmailAgentPage />;
}
