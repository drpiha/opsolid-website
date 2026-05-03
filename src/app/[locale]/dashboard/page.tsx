// =============================================================================
// Dashboard index — redirects to /[locale]/dashboard/cards.
// Layout (layout.tsx) guards auth; this page only fires when the session is
// already valid. Without this file the App Router segment returns 404.
// =============================================================================

import { redirect } from "next/navigation";

export default function DashboardIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/dashboard/cards`);
}
