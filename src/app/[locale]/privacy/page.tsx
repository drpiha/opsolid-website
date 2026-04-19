import type { Metadata } from "next";
import { PrivacyPage } from "./PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and data protection information for OpSolid.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrivacyPage />;
}
