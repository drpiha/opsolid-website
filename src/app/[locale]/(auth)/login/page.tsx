import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

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
  return <LoginClient locale={params.locale} />;
}
