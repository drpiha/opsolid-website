import type { Metadata } from "next";
import { SignupClient } from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free OpSolid account and get a digital business card.",
  robots: { index: false },
};

export default function SignupPage({
  params,
}: {
  params: { locale: string };
}) {
  return <SignupClient locale={params.locale} />;
}
