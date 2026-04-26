/**
 * Wissensbasis — FAQ / menu / pricing entries that are rendered into the
 * agent system prompt at sync time.
 */

import { Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import KnowledgeBaseClient from "./KnowledgeBaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function KnowledgeBasePage({
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

  const items = await prisma.voiceKnowledgeBaseItem.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ itemType: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Wissensbasis"
        title="Was die KI weiß"
        description="FAQs, Speisekarten, Preise und Richtlinien. Diese Inhalte werden dem Agenten zur Verfügung gestellt und bei Anrufen zitiert."
      />

      {/* ---------- Info banner ---------- */}
      <div className="panel mb-6 flex items-start gap-3 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-copper-400" aria-hidden />
        <p className="text-[12px] leading-relaxed text-ink-300">
          Diese Informationen werden dem KI-Agenten zur Verfügung gestellt. Halten Sie sie aktuell — der Agent zitiert sie wörtlich.
        </p>
      </div>

      <KnowledgeBaseClient
        tenantId={tenant.id}
        token={token}
        items={items.map((i) => ({
          id: i.id,
          itemType: i.itemType,
          title: i.title,
          content: i.content,
          tags: i.tags,
          isActive: i.isActive,
          sortOrder: i.sortOrder,
        }))}
      />
    </>
  );
}
