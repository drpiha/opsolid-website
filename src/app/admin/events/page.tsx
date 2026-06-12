// =============================================================================
// /admin/events — operator UI for fair / event directory entries.
//
// The missing link in the fair flow: this is WHERE the event (and its slug)
// gets created. The form auto-generates the slug from the event name; the
// table hands the operator the two links to distribute, copy-ready:
//   • invite link  →  /tr/products/digital-card?event=<slug>
//   • directory    →  /tr/events/<slug>
//
// Auth: same dual gate as /admin/orders — ADMIN role session, or ?token=
// fallback (constant-time compare).
// =============================================================================

import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/stripe";
import { AdminEventsClient } from "./AdminEventsClient";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Events",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  const refresh = cookies().get(REFRESH_COOKIE_NAME)?.value;
  const sessionUser = refresh ? await getSessionUser(refresh) : null;
  const isSessionAdmin = sessionUser?.role === "ADMIN";
  const tokenOk = Boolean(expected) && safeEqual(token, expected ?? "");

  if (!isSessionAdmin && !tokenOk) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">Sign in required</h1>
        <p className="mt-4 text-ink/60">
          Sign in with an admin account, or open this page from a valid admin link.
        </p>
        <a href="/login" className="mt-6 inline-block underline underline-offset-4">
          Sign in
        </a>
      </main>
    );
  }

  return (
    <AdminEventsClient
      adminToken={tokenOk ? token : ""}
      siteUrl={getSiteUrl().replace(/\/$/, "")}
    />
  );
}
