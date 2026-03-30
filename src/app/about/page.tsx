import type { Metadata } from "next";
import { AboutPage } from "./AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about OpSolid — a Germany-based company building reliable operational systems, automation, and workflow solutions for businesses across Europe.",
  openGraph: {
    title: "About | OpSolid",
    description:
      "A Germany-based company focused on building reliable operational systems for modern businesses.",
  },
};

export default function Page() {
  return <AboutPage />;
}
