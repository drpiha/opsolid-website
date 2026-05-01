/**
 * Admin · tenant detail. Shows token (masked + reveal toggle), status
 * controls, quick stats, and a deep link into the customer dashboard.
 */

import { timingSafeEqual } from "node:crypto";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { formatDateTime, maskToken } from "@/components/voice/dashboard/format";
import TenantTokenReveal from "./TenantTokenReveal";
import TenantStatusControl from "./TenantStatusControl";
import DiagnosticsCard from "./DiagnosticsCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Voice tenant",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ token?: string }>;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function NoticeShell({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-0 px-6">
      <div className="panel w-full max-w-md px-6 py-8 text-center">
        <h1 className="font-display text-[16px] font-medium text-ink">
          {title}
        </h1>
        <div className="mt-2 text-[13px] leading-relaxed text-ink-300">
          {body}
        </div>
      </div>
    </main>
  );
}

export default async function AdminTenantDetail({
  params,
  searchParams,
}: PageProps) {
  const { tenantId } = await params;
  const { token = "" } = await searchParams;
  const expected = process.env.VOICE_ADMIN_TOKEN;

  if (!expected) {
    return <NoticeShell title="Voice Admin nicht konfiguriert" body="VOICE_ADMIN_TOKEN fehlt." />;
  }
  if (!token || !safeEqual(token, expected)) {
    return <NoticeShell title="401" body="Ungültiger Admin-Token." />;
  }

  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: { agents: true, phoneNumbers: true },
      },
    },
  });
  if (!tenant) {
    return <NoticeShell title="Tenant nicht gefunden" body="Prüfen Sie den Link." />;
  }

  const callsLast30 = await prisma.voiceCall.count({
    where: {
      agent: { tenantId: tenant.id },
      startedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  const tokenQ = `?token=${encodeURIComponent(token)}`;
  const dashboardUrl = `/voice/${tenant.slug}/overview?token=${encodeURIComponent(tenant.tenantToken)}`;

  return (
    <main className="min-h-screen bg-bg-0">
      <div className="mx-auto w-full max-w-[1080px] px-6 py-10">
        <Link
          href={`/admin/voice${tokenQ}`}
          className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 hover:text-copper-300"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Alle Tenants
        </Link>

        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="meta text-[10px] text-copper-300">
              <ShieldCheck className="mr-1 inline h-3 w-3" aria-hidden />
              Plattform-Admin · {tenant.mode}
            </span>
            <h1 className="mt-2 font-display text-[28px] font-medium tracking-tight text-ink">
              {tenant.businessName}
            </h1>
            <p className="meta mt-1 text-[10px] text-ink-400">
              /{tenant.slug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VoiceStatusBadge status={tenant.status} size="md" />
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Dashboard öffnen
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick stats */}
          <section className="panel flex flex-col gap-3 px-5 py-5">
            <h3 className="font-display text-[14px] font-medium text-ink">
              Quick Stats
            </h3>
            <dl className="grid grid-cols-3 gap-3">
              <Stat label="Agenten" value={tenant._count.agents} />
              <Stat label="Nummern" value={tenant._count.phoneNumbers} />
              <Stat label="Anrufe (30d)" value={callsLast30} highlight />
            </dl>
            <div className="mt-2 flex flex-col gap-1 border-t border-line-soft pt-3 text-[12px] text-ink-300">
              <Row label="Erstellt" value={formatDateTime(tenant.createdAt)} />
              <Row label="Aktualisiert" value={formatDateTime(tenant.updatedAt)} />
              <Row label="Trial-Ende" value={tenant.trialEndsAt ? formatDateTime(tenant.trialEndsAt) : "—"} />
              <Row label="Provider" value={tenant.providerName} />
              <Row label="Branche" value={tenant.businessCategory ?? "—"} />
              <Row label="Kontakt" value={tenant.contactEmail} />
            </div>
          </section>

          {/* Status control */}
          <TenantStatusControl
            tenantId={tenant.id}
            currentStatus={tenant.status}
            adminToken={token}
          />

          {/* System diagnostics — shared health snapshot, useful while
              wiring up a new tenant or debugging webhook issues. */}
          <DiagnosticsCard adminToken={token} />
        </div>

        {/* Token reveal panel */}
        <section className="panel mt-6 flex flex-col gap-3 px-5 py-5">
          <header className="flex items-center justify-between">
            <h3 className="font-display text-[14px] font-medium text-ink">
              Tenant-Token
            </h3>
            <span className="meta font-mono text-[10px] normal-case tracking-normal text-ink-400">
              {maskToken(tenant.tenantToken)}
            </span>
          </header>
          <TenantTokenReveal token={tenant.tenantToken} />
          <p className="meta text-[10px] text-ink-400">
            Verwenden Sie diesen Token, um dem Kunden einen Dashboard-Link zu geben:&nbsp;
            <span className="font-mono normal-case tracking-normal text-ink-300">
              /voice/{tenant.slug}?token=…
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-bg-2 px-3 py-3">
      <span className="meta text-[10px] text-ink-400">{label}</span>
      <div
        className={`mt-1 font-display text-[22px] tabular-nums ${highlight ? "text-copper-300" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="meta text-[10px] text-ink-400">{label}</span>
      <span className="text-[12px] text-ink-200">{value}</span>
    </div>
  );
}
