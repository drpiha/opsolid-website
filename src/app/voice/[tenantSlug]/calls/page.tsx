/**
 * Anrufprotokoll — paginated table of every call for the tenant.
 *
 * Filters are URL-driven (q, status, outcome, page) so deep links share
 * cleanly. Server pagination keeps the SSR footprint small.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import CallsClient from "./CallsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{
    token?: string;
    page?: string;
    status?: string;
    outcome?: string;
    q?: string;
  }>;
}

export default async function CallsPage({ params, searchParams }: PageProps) {
  const { tenantSlug } = await params;
  const sp = await searchParams;
  const token = sp.token ?? "";
  const page = Math.max(1, Number(sp.page ?? "1"));
  const status = (sp.status ?? "").trim();
  const outcome = (sp.outcome ?? "").trim();
  const q = (sp.q ?? "").trim();

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant) return null;

  const where: Prisma.VoiceCallWhereInput = {
    agent: { tenantId: tenant.id },
    ...(status ? { status } : {}),
    ...(outcome ? { outcomeType: outcome } : {}),
    ...(q
      ? {
          OR: [
            { fromNumber: { contains: q, mode: "insensitive" } },
            { toNumber: { contains: q, mode: "insensitive" } },
            { callerName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, calls] = await Promise.all([
    prisma.voiceCall.count({ where }),
    prisma.voiceCall.findMany({
      where,
      orderBy: { startedAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        startedAt: true,
        fromNumber: true,
        direction: true,
        status: true,
        outcomeType: true,
        durationSeconds: true,
        detectedLanguage: true,
        costUnits: true,
        agent: { select: { displayName: true } },
      },
    }),
  ]);

  const rows = calls.map((c) => ({
    id: c.id,
    startedAt: c.startedAt,
    fromNumber: c.fromNumber,
    direction: c.direction,
    status: c.status,
    outcomeType: c.outcomeType,
    durationSeconds: c.durationSeconds,
    detectedLanguage: c.detectedLanguage,
    costUnits: c.costUnits,
    agentName: c.agent?.displayName ?? null,
  }));

  return (
    <CallsClient
      tenantSlug={tenantSlug}
      token={token}
      calls={rows}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      filters={{ status, outcome, q }}
    />
  );
}
