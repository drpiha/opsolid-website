import type { Metadata } from "next";
import { ChatbotPage } from "./ChatbotPage";

export const metadata: Metadata = {
  title: "Website Chatbot · OpSolid",
  description:
    "A multi-channel chatbot for web, WhatsApp, and Telegram. RAG-powered, CRM-synced.",
};

export default function Page() {
  return <ChatbotPage />;
}
