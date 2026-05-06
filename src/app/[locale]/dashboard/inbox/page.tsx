// =============================================================================
// /dashboard/inbox — Smart Action Inbox (Phase 8.5)
//
// Server component: session guard provided by parent layout.tsx.
// Delegates all rendering to the interactive client component.
// =============================================================================

import type { Metadata } from "next";
import { InboxClient } from "./InboxClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posteingang | OpSolid",
  robots: { index: false, follow: false },
};

export default function InboxPage() {
  return <InboxClient />;
}
