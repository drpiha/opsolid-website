import type { Metadata } from "next";
import { WhatsAppAgentPage } from "./WhatsAppAgentPage";

export const metadata: Metadata = {
  title: "WhatsApp Business Agent · OpSolid",
  description:
    "WhatsApp automation via the official Meta Business Cloud API — verified BSP, zero ban risk.",
};

export default function Page() {
  return <WhatsAppAgentPage />;
}
