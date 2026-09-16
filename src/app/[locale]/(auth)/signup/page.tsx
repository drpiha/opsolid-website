import type { Metadata } from "next";
import { SignupClient } from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account | OpSolid",
  description: "Create your free OpSolid account and get a digital business card.",
  robots: { index: false },
};

export default function SignupPage({
  params,
}: {
  params: { locale: string };
}) {
  const googleEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  return <SignupClient locale={params.locale} googleEnabled={googleEnabled} />;
}
