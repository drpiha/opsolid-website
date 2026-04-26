/**
 * Overview page — landing screen for a Voice Agent tenant.
 *
 * Server component: loads aggregates + recent calls in parallel and hands
 * a flat data prop to the OverviewClient. Tenant token validation is the
 * layout's job; we just trust `params` here.
 */

import { prisma } from "@/lib/prisma";
import OverviewClient from "./OverviewClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OverviewPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      businessName: true,
      status: true,
      mode: true,
      contactEmail: true,
    },
  });

  if (!tenant) {
    // Layout would already have shown the unauthorized screen; keep this
    // defensive so TypeScript narrows.
    return null;
  }

  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);

  // Aggregate the last 30 days of calls. We read the joined fields we need
  // for the recent-calls table in a single query and compute counts client
  // side via groupBy/count for the stat cards.
  const [
    totalCalls,
    answeredCalls,
    appointmentCalls,
    transferredCalls,
    durationAgg,
    activeAgent,
    activePhone,
    recentCalls,
    agentsCount,
    phoneCount,
    businessHoursCount,
  ] = await Promise.all([
    prisma.voiceCall.count({
      where: {
        agent: { tenantId: tenant.id },
        startedAt: { gte: since30d },
      },
    }),
    prisma.voiceCall.count({
      where: {
        agent: { tenantId: tenant.id },
        startedAt: { gte: since30d },
        disposition: "answered",
      },
    }),
    prisma.voiceCall.count({
      where: {
        agent: { tenantId: tenant.id },
        startedAt: { gte: since30d },
        outcomeType: "appointment_booked",
      },
    }),
    prisma.voiceCall.count({
      where: {
        agent: { tenantId: tenant.id },
        startedAt: { gte: since30d },
        OR: [
          { disposition: "transferred" },
          { outcomeType: "transferred" },
        ],
      },
    }),
    prisma.voiceCall.aggregate({
      where: {
        agent: { tenantId: tenant.id },
        startedAt: { gte: since30d },
        durationSeconds: { gt: 0 },
      },
      _avg: { durationSeconds: true },
    }),
    prisma.voiceAgent.findFirst({
      where: { tenantId: tenant.id, status: "active" },
      select: { id: true, name: true, displayName: true, language: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.voicePhoneNumber.findFirst({
      where: { tenantId: tenant.id, status: "active" },
      select: {
        id: true,
        e164Number: true,
        friendlyName: true,
        agentId: true,
      },
      orderBy: { importedAt: "desc" },
    }),
    prisma.voiceCall.findMany({
      where: { agent: { tenantId: tenant.id } },
      orderBy: { startedAt: "desc" },
      take: 5,
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
    prisma.voiceAgent.count({ where: { tenantId: tenant.id } }),
    prisma.voicePhoneNumber.count({ where: { tenantId: tenant.id } }),
    prisma.voiceBusinessHours.count({
      where: { tenantId: tenant.id, isOverride: false },
    }),
  ]);

  const recentRows = recentCalls.map((c) => ({
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
    <OverviewClient
      tenantSlug={tenantSlug}
      token={token}
      tenant={{
        businessName: tenant.businessName,
        status: tenant.status,
        mode: tenant.mode,
      }}
      stats={{
        totalCalls,
        answeredCalls,
        appointmentCalls,
        transferredCalls,
        avgDurationSec: durationAgg._avg.durationSeconds ?? 0,
      }}
      agent={
        activeAgent
          ? {
              id: activeAgent.id,
              displayName: activeAgent.displayName,
              language: activeAgent.language,
            }
          : null
      }
      phone={
        activePhone
          ? {
              id: activePhone.id,
              e164Number: activePhone.e164Number,
              friendlyName: activePhone.friendlyName,
              hasAgent: Boolean(activePhone.agentId),
            }
          : null
      }
      recentCalls={recentRows}
      checklist={{
        agent: agentsCount > 0,
        phone: phoneCount > 0,
        hours: businessHoursCount >= 7,
        testCall: totalCalls > 0,
      }}
    />
  );
}
