import type { Metadata } from "next";
import { ProductsPage } from "./ProductsPage";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software products built and operated by OpSolid — production-grade systems developed on the same automation and AI foundations that power our bespoke engagements.",
  openGraph: {
    title: "Products | OpSolid",
    description:
      "Explore OpSolid's in-house software portfolio. Kutasia — a multi-sector customer platform — is the first live product.",
  },
};

export default function Page() {
  return <ProductsPage />;
}
