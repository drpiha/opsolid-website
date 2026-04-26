/**
 * Platform admin · Voice tenants list. Admin token comparison happens
 * server-side; the page never renders any tenant data without a valid match.
 */

import { timingSafeEqual } from "node:crypto";
import Link from "next/link";
import { ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import { formatDateTime } from "@/components/voice/dashboard/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Voice",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
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

export default async function AdminVoicePage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;
  const expected = process.env.VOICE_ADMIN_TOKEN;

  if (!expected) {
    return (
      <NoticeShell
        title="Voice Admin nicht konfiguriert"
        body={
          <>
            Setzen Sie <code className="font-mono">VOICE_ADMIN_TOKEN</code> in
            der Umgebung, um diese Seite zu aktivieren.
          </>
        }
      />
    );
  }

  if (!token || !safeEqual(token, expected)) {
    return (
      <NoticeShell
        title="401 — Zugriff verweigert"
        body={
          <>
            Hängen Sie <code className="font-mono">?token=…</code> an die URL an.
          </>
        }
      />
    );
  }

  const tenants = await prisma.voiceTenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { agents: true } },
      agents: {
        select: {
          calls: { select: { startedAt: true }, orderBy: { startedAt: "desc" }, take: 1 },
        },
      },
    },
  });

  const tokenQ = `?token=${encodeURIComponent(token)}`;

  return (
    <main className="min-h-screen bg-bg-0">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-10 lg:px-10">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <span className="meta text-[10px] text-copper-300">
              <ShieldCheck className="mr-1 inline h-3 w-3" aria-hidden />
              Plattform-Admin
            </span>
            <h1 className="mt-2 font-display text-[28px] font-medium tracking-tight text-ink">
              Voice-Kunden
            </h1>
            <p className="mt-1 text-[13px] text-ink-300">
              {tenants.length} Tenants gesamt. Privater Bereich — Link nicht weitergeben.
            </p>
          </div>
          <Link
            href={`/admin/voice/new${tokenQ}`}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Neuen Kunden anlegen
          </Link>
        </header>

        {tenants.length === 0 ? (
          <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="font-display text-[15px] text-ink">
              Noch keine Tenants vorhanden
            </p>
            <Link
              href={`/admin/voice/new${tokenQ}`}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Ersten Kunden anlegen
            </Link>
          </div>
        ) : (
          <section className="panel overflow-hidden p-0">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-ink-400">
                  <Th>Slug / Name</Th>
                  <Th>Modus</Th>
                  <Th>Status</Th>
                  <Th align="right">Agenten</Th>
                  <Th>Letzter Anruf</Th>
                  <Th align="right" />
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => {
                  const lastCall = t.agents
                    .map((a) => a.calls[0]?.startedAt)
                    .filter(Boolean)
                    .sort((a, b) => (b!.getTime() - a!.getTime()))[0];
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-line-soft last:border-b-0 hover:bg-bg-2"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/voice/${t.id}${tokenQ}`}
                          className="block"
                        >
                          <div className="font-display text-[14px] font-medium text-ink">
                            {t.businessName}
                          </div>
                          <div className="meta text-[10px] text-ink-400">
                            /{t.slug}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="meta text-[10px] text-ink-300">
                          {t.mode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <VoiceStatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink-300">
                        {t._count.agents}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-ink-400">
                        {lastCall ? formatDateTime(lastCall) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/voice/${t.id}${tokenQ}`}
                          className="inline-flex items-center gap-1 text-[12px] text-copper-300 hover:text-copper-200"
                        >
                          Öffnen
                          <ArrowRight className="h-3 w-3" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}

function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`meta px-4 py-3 text-[10px] font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}
