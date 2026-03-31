import type { Metadata } from "next";
import { AboutPage } from "./AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "OpSolid is a Germany-based automation practice focused on replacing manual, repetitive operational work with reliable automated systems.",
  openGraph: {
    title: "About | OpSolid",
    description:
      "Germany-based automation practice focused on practical automation and AI systems for business operations.",
  },
};

export default function Page() {
  return <AboutPage />;
}
