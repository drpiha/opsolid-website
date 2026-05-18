// =============================================================================
// /dashboard/channels — connect Telegram / WhatsApp / Email channels to
// the unified inbox. Auth provided by parent dashboard layout.
// =============================================================================

import type { Metadata } from "next";
import { ChannelsClient } from "./ChannelsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Channels · OpSolid",
  robots: { index: false, follow: false },
};

export default function ChannelsPage() {
  return <ChannelsClient />;
}
