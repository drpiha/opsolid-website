// =============================================================================
// /dashboard/playbooks — Hero automations (Kutasia Workspace Faz H)
// =============================================================================

import type { Metadata } from "next";
import { PlaybooksClient } from "./PlaybooksClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Playbooks | OpSolid",
  robots: { index: false, follow: false },
};

export default function PlaybooksPage() {
  return <PlaybooksClient />;
}
