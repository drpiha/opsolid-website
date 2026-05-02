// =============================================================================
// Dashboard layout — B0.5
//
// Server component. Validates the session cookie via requireUser; on failure
// redirects to /{locale}/login?next=/dashboard/cards (B0.2 auth guard pattern).
// Renders DashboardChrome (sticky topbar) + children below it.
// =============================================================================

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { DashboardChrome } from "./DashboardChrome";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard · OpSolid",
  robots: { index: false, follow: false },
};

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = params;

  // Resolve the user from the refresh cookie directly in the layout so we can
  // pass the email to DashboardChrome without an extra data fetch in the page.
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;

  if (!user) {
    redirect(`/${locale}/login?next=/dashboard/cards`);
  }

  return (
    <div className="min-h-screen bg-bg-0">
      <DashboardChrome userEmail={user.email} locale={locale} />
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
