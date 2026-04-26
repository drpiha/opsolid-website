/**
 * /voice/[tenantSlug] root → redirect to /overview, preserving the token.
 */

import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function VoiceRoot({ params, searchParams }: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;
  redirect(`/voice/${tenantSlug}/overview?token=${encodeURIComponent(token)}`);
}
