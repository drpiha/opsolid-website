import type { Metadata } from "next";
import { SolutionsPage } from "./SolutionsPage";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Workflow automation, systems integration, internal tools, AI-assisted workflows, and communication automation — designed around your specific operations.",
  openGraph: {
    title: "Services | OpSolid",
    description:
      "Practical automation services designed around your specific business operations.",
  },
};

export default function Page() {
  return <SolutionsPage />;
}
