import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

// OAuth is configured when the immutable image starts, not during its build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In | OpSolid",
  description: "Sign in to your OpSolid account to manage your digital business cards.",
  robots: { index: false },
};

export default function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  // Only surface the Google button when OAuth is actually configured on the
  // server — otherwise it leads to a 503 "OAuth not configured". Magic-link /
  // password stay available regardless.
  const googleEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  return <LoginClient locale={params.locale} googleEnabled={googleEnabled} />;
}
