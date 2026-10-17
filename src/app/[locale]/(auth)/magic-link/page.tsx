import type { Metadata } from "next";
import { MagicLinkClient } from "./MagicLinkClient";

export const metadata: Metadata = {
  title: "Check Your Inbox",
  description: "We sent you a sign-in link. Check your email to continue.",
  robots: { index: false },
};

export default function MagicLinkPage({
  params,
}: {
  params: { locale: string };
}) {
  return <MagicLinkClient locale={params.locale} />;
}
