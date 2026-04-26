/**
 * /voice/[tenantSlug]/agents/new — create a new VoiceAgent.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import NewAgentForm from "./NewAgentForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function NewAgentPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <>
      <Link
        href={`/voice/${tenantSlug}/agents${tokenQuery}`}
        className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 transition-colors hover:text-copper-300"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Zurück zu Agenten
      </Link>
      <PageHeader
        eyebrow="Konfiguration"
        title="Neuen Agenten erstellen"
        description="Definieren Sie Persönlichkeit, Sprache und Verhalten Ihres KI-Empfangs. Sie können später jederzeit anpassen und mit dem Provider synchronisieren."
      />
      <NewAgentForm
        tenantId={tenant.id}
        tenantSlug={tenantSlug}
        token={token}
      />
    </>
  );
}
