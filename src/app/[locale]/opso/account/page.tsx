import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { opsoLocale } from "@/lib/opso-web/contracts";
import { getOpsoAccountCopy } from "@/content/opso-account";
import OpsoAccount from "./OpsoAccount";

export const metadata: Metadata = { title: "OpSo account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function AccountPage({ params }: { params: { locale: string } }) {
  const locale = opsoLocale.safeParse(params.locale); if (!locale.success) notFound();
  return <OpsoAccount locale={locale.data} copy={getOpsoAccountCopy(locale.data)} />;
}
