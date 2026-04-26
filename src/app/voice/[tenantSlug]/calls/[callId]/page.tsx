/**
 * Call detail page — header strip, two-column layout (transcript + meta),
 * extracted fields, event timeline, action buttons.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Hash,
  PhoneIncoming,
  PhoneOutgoing,
  Sparkles,
  Smile,
  Timer,
  User2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/voice/dashboard/PageHeader";
import TranscriptViewer, {
  type TranscriptSegment,
} from "@/components/voice/dashboard/TranscriptViewer";
import VoiceStatusBadge from "@/components/voice/dashboard/VoiceStatusBadge";
import {
  formatDateTime,
  formatDuration,
  formatEuroCents,
  LANGUAGE_LABELS,
  OUTCOME_LABELS,
} from "@/components/voice/dashboard/format";
import CallActions from "./CallActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ tenantSlug: string; callId: string }>;
  searchParams: Promise<{ token?: string }>;
}

function normalizeTranscript(json: unknown): TranscriptSegment[] {
  if (!Array.isArray(json)) return [];
  return json
    .map((seg): TranscriptSegment | null => {
      if (typeof seg !== "object" || seg === null) return null;
      const s = seg as Record<string, unknown>;
      const role = String(s.role ?? s.speaker ?? "user");
      const text = String(s.text ?? s.content ?? s.message ?? "");
      if (!text.trim()) return null;
      const offsetSeconds =
        typeof s.offsetSeconds === "number"
          ? s.offsetSeconds
          : typeof s.offset_ms === "number"
          ? Math.floor((s.offset_ms as number) / 1000)
          : typeof s.offsetMs === "number"
          ? Math.floor((s.offsetMs as number) / 1000)
          : null;
      const timestamp =
        typeof s.timestamp === "string"
          ? (s.timestamp as string)
          : typeof s.time === "string"
          ? (s.time as string)
          : null;
      return { role, text, offsetSeconds, timestamp };
    })
    .filter(Boolean) as TranscriptSegment[];
}

export default async function CallDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { tenantSlug, callId } = await params;
  const { token = "" } = await searchParams;

  const call = await prisma.voiceCall.findUnique({
    where: { id: callId },
    include: {
      agent: {
        select: { id: true, displayName: true, name: true, tenantId: true },
      },
      phoneNumber: {
        select: { e164Number: true, friendlyName: true },
      },
      events: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!call) notFound();

  // Cross-check tenant slug matches the call's agent.tenant.
  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });
  if (!tenant || tenant.id !== call.agent.tenantId) notFound();

  const transcript = normalizeTranscript(call.transcriptJson);
  const extracted =
    typeof call.extractedFields === "object" && call.extractedFields !== null
      ? (call.extractedFields as Record<string, unknown>)
      : {};
  const tokenQuery = `?token=${encodeURIComponent(token)}`;
  const directionLabel = call.direction === "outbound" ? "Ausgehend" : "Eingehend";
  const DirectionIcon =
    call.direction === "outbound" ? PhoneOutgoing : PhoneIncoming;

  return (
    <>
      <Link
        href={`/voice/${tenantSlug}/calls${tokenQuery}`}
        className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 transition-colors hover:text-copper-300"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Zurück zum Protokoll
      </Link>

      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <DirectionIcon className="h-3 w-3" aria-hidden />
            {directionLabel} · {call.providerName}
          </span>
        }
        title={call.callerName ?? call.fromNumber}
        description={`Anruf vom ${formatDateTime(call.startedAt)}`}
        actions={
          <>
            <VoiceStatusBadge status={call.status} size="md" />
            {call.outcomeType && (
              <span className="inline-flex items-center rounded-pill border border-line-hot bg-copper-500/[0.08] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-copper-300">
                {OUTCOME_LABELS[call.outcomeType] ?? call.outcomeType}
              </span>
            )}
          </>
        }
      />

      {/* ---------- Two-column layout ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ---- Left: Transcript + summary ---- */}
        <div className="flex flex-col gap-6">
          <TranscriptViewer segments={transcript} />

          <section className="panel flex flex-col gap-3 px-5 py-5">
            <header className="flex items-center justify-between">
              <h3 className="font-display text-[14px] font-medium text-ink">
                Zusammenfassung
              </h3>
              <CallActions
                callId={call.id}
                tenantId={call.agent.tenantId}
                token={token}
                hasAppointmentOpportunity={
                  call.outcomeType === "callback_requested" ||
                  call.outcomeType === "appointment_booked"
                }
              />
            </header>
            {call.summaryText ? (
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink-200">
                {call.summaryText}
              </p>
            ) : (
              <p className="text-[12px] text-ink-400">
                Noch keine Zusammenfassung verfügbar.
              </p>
            )}
          </section>
        </div>

        {/* ---- Right: Metadata + Extracted fields + Events ---- */}
        <aside className="flex flex-col gap-6">
          <section className="panel flex flex-col gap-3 px-5 py-5">
            <h3 className="font-display text-[14px] font-medium text-ink">
              Metadaten
            </h3>
            <dl className="grid grid-cols-1 gap-3">
              <MetaRow
                icon={<DirectionIcon className="h-3.5 w-3.5" />}
                label="Von"
                value={call.fromNumber}
                mono
              />
              <MetaRow
                icon={<PhoneIncoming className="h-3.5 w-3.5" />}
                label="An"
                value={call.toNumber}
                mono
              />
              <MetaRow
                icon={<Timer className="h-3.5 w-3.5" />}
                label="Dauer"
                value={formatDuration(call.durationSeconds)}
                mono
              />
              <MetaRow
                icon={<Globe className="h-3.5 w-3.5" />}
                label="Sprache"
                value={
                  call.detectedLanguage
                    ? LANGUAGE_LABELS[call.detectedLanguage] ??
                      call.detectedLanguage.toUpperCase()
                    : "—"
                }
              />
              <MetaRow
                icon={<Smile className="h-3.5 w-3.5" />}
                label="Stimmung"
                value={call.sentiment ?? "—"}
              />
              <MetaRow
                icon={<User2 className="h-3.5 w-3.5" />}
                label="Agent"
                value={call.agent.displayName}
              />
              <MetaRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Beginn"
                value={formatDateTime(call.startedAt)}
              />
              <MetaRow
                icon={<Hash className="h-3.5 w-3.5" />}
                label="Provider-ID"
                value={call.providerCallId}
                mono
                truncate
              />
              <MetaRow
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Kosten"
                value={formatEuroCents(call.costUnits)}
                mono
              />
            </dl>
          </section>

          {/* Extracted fields */}
          <section className="panel flex flex-col gap-3 px-5 py-5">
            <h3 className="font-display text-[14px] font-medium text-ink">
              Extrahierte Felder
            </h3>
            {Object.keys(extracted).length === 0 ? (
              <p className="text-[12px] text-ink-400">
                Keine strukturierten Daten erkannt.
              </p>
            ) : (
              <dl className="grid grid-cols-1 gap-2">
                {Object.entries(extracted).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[100px_1fr] items-baseline gap-3 border-b border-line-soft py-1.5 last:border-b-0"
                  >
                    <dt className="meta text-[10px] text-ink-400">{key}</dt>
                    <dd className="text-[12px] leading-snug text-ink-200">
                      {value === null || value === undefined || value === ""
                        ? <span className="text-ink-400">—</span>
                        : typeof value === "object"
                          ? <code className="font-mono text-[11px]">{JSON.stringify(value)}</code>
                          : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* Events */}
          <section className="panel flex flex-col gap-3 px-5 py-5">
            <h3 className="font-display text-[14px] font-medium text-ink">
              Ereignisprotokoll
            </h3>
            {call.events.length === 0 ? (
              <p className="text-[12px] text-ink-400">
                Keine Ereignisse erfasst.
              </p>
            ) : (
              <ol className="relative flex flex-col gap-3 border-l border-line pl-4">
                {call.events.map((evt) => (
                  <li key={evt.id} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-pill bg-copper-500 shadow-bloom-sm"
                    />
                    <div className="text-[12px] text-ink-200">
                      {evt.eventType}
                    </div>
                    <div className="meta text-[10px] text-ink-400">
                      {formatDateTime(evt.createdAt)}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}

function MetaRow({
  icon,
  label,
  value,
  mono,
  truncate,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-3">
      <dt className="meta inline-flex items-center gap-1.5 text-[10px] text-ink-400">
        <span className="text-ink-400" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd
        className={[
          "text-[13px] text-ink-200",
          mono ? "font-mono tabular-nums text-[12px]" : "",
          truncate ? "truncate" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
