import type { Metadata } from "next";
import { ImpressumPage } from "./ImpressumPage";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice and company information for OpSolid.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ImpressumPage />;
}
