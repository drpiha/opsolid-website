// =============================================================================
// /dashboard/contacts — saved contacts page (Phase 8.3)
//
// Server component: session guard is provided by the parent layout.tsx, so
// no redundant auth check needed here. Delegates all rendering to the
// interactive client component.
// =============================================================================

import type { Metadata } from "next";
import { ContactsClient } from "./ContactsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontakte",
  robots: { index: false, follow: false },
};

export default function ContactsPage() {
  return <ContactsClient />;
}
