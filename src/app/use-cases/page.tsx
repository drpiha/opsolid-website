import type { Metadata } from "next";
import { UseCasesPage } from "./UseCasesPage";

export const metadata: Metadata = {
  title: "Example Solutions",
  description:
    "Realistic examples of the kinds of automation systems OpSolid can design and build — from order processing and document handling to approval workflows and dashboards.",
  openGraph: {
    title: "Example Solutions | OpSolid",
    description:
      "Practical automation scenarios showing what OpSolid can design and build for your operations.",
  },
};

export default function Page() {
  return <UseCasesPage />;
}
