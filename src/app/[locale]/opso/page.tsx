import type { Metadata } from "next";
import { page } from "@/content/v7/pages/opso";
import { v7Meta, v7Page } from "@/components/v7/make-page";

const baseMeta = v7Meta(page);

/** iOS Smart App Banner (`apple-itunes-app`) for the OpSo page only, in every language route. */
export function generateMetadata(props: Parameters<typeof baseMeta>[0]): Metadata {
  return { ...baseMeta(props), itunes: { appId: "6826541629" } };
}
export default v7Page(page);
