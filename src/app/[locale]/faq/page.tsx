import type { Metadata } from "next";
import { FAQPage } from "./FAQPage";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about OpSolid's automation services, technology, process, and pricing.",
  openGraph: {
    title: "FAQ | OpSolid",
    description:
      "Common questions about our automation services, process, and technology.",
  },
};

export default function Page() {
  return <FAQPage />;
}
