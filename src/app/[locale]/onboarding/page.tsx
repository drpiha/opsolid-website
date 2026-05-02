// =============================================================================
// /onboarding — Faz 7.0a B0.7
//
// Self-onboarding wizard entry. Server component:
//   1. Resolves session via refresh cookie (matches B0.5 dashboard pattern).
//   2. Redirects to /{locale}/login?next=/onboarding when missing.
//   3. Hands the user identity off to OnboardingClient which runs the
//      industry → personal → preview state machine in the browser.
//
// We intentionally do NOT short-circuit existing-card owners back to the
// dashboard from here — the dashboard's "Create new card" CTA always lands
// here, and even users with cards may want to add another one.
// =============================================================================

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { OnboardingClient } from "./OnboardingClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create your card · OpSolid",
  robots: { index: false, follow: false },
};

interface Props {
  params: { locale: string };
}

export default async function OnboardingPage({ params }: Props) {
  const { locale } = params;

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;

  if (!user) {
    redirect(`/${locale}/login?next=/onboarding`);
  }

  return (
    <OnboardingClient
      userId={user.id}
      userEmail={user.email}
      userName={user.name ?? null}
      userLocale={locale}
    />
  );
}
