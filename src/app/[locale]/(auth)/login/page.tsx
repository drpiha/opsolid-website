import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In | OpSolid",
  description: "Sign in to your OpSolid account to manage your digital business cards.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { next?: string };
}) {
  // Already signed in? Skip the form and go straight to the account. Honors a
  // safe `next` (locale-prefixed if needed); otherwise lands on My Cards.
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;

  if (user) {
    const next = searchParams?.next;
    let dest = `/${params.locale}/dashboard/cards`;
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      dest =
        next === `/${params.locale}` || next.startsWith(`/${params.locale}/`)
          ? next
          : `/${params.locale}${next}`;
    }
    redirect(dest);
  }

  return <LoginClient locale={params.locale} />;
}
