import type { Metadata } from "next";
import { UseCasesPage } from "./UseCasesPage";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Real-world examples of how businesses use OpSolid to automate order processing, document handling, approvals, reporting, and more.",
  openGraph: {
    title: "Use Cases | OpSolid",
    description:
      "Real-world examples of how businesses use OpSolid to automate operations and eliminate manual work.",
  },
};

export default function Page() {
  return <UseCasesPage />;
}
