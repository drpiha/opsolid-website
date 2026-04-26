"use client";

/**
 * CallLogTable — primary data table for the Anrufprotokoll page and any
 * embedded "recent calls" widgets. Pure presentation; the parent owns the
 * data source so it can paginate/filter on the server.
 */

import Link from "next/link";
import { PhoneIncoming, PhoneOutgoing, ArrowRight } from "lucide-react";
import VoiceStatusBadge from "./VoiceStatusBadge";
import {
  formatDateTime,
  formatDuration,
  formatEuroCents,
  LANGUAGE_LABELS,
  OUTCOME_LABELS,
} from "./format";
import { cn } from "@/lib/utils";

export interface CallLogRow {
  id: string;
  startedAt: Date | string | null;
  fromNumber: string;
  toNumber?: string;
  direction: string;
  status: string;
  outcomeType?: string | null;
  durationSeconds?: number | null;
  detectedLanguage?: string | null;
  costUnits?: number | null;
  agentName?: string | null;
}

interface CallLogTableProps {
  calls: CallLogRow[];
  tenantSlug: string;
  token: string;
  /** Compact mode for embed-on-overview rendering (drops Cost + Lang cols). */
  compact?: boolean;
  /** Empty state customization. */
  emptyTitle?: string;
  emptyHint?: string;
}

export default function CallLogTable({
  calls,
  tenantSlug,
  token,
  compact = false,
  emptyTitle = "Noch keine Anrufe",
  emptyHint = "Konfigurieren Sie einen Agenten und verbinden Sie eine Rufnummer.",
}: CallLogTableProps) {
  if (calls.length === 0) {
    return (
      <div className="panel flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-hot/50 bg-copper-500/[0.06] text-copper-300"
        >
          <PhoneIncoming className="h-5 w-5" />
        </div>
        <p className="font-display text-[15px] text-ink">{emptyTitle}</p>
        <p className="max-w-sm text-[13px] text-ink-400">{emptyHint}</p>
      </div>
    );
  }

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <div className="panel overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <Th>Zeit</Th>
              <Th>Anrufer</Th>
              <Th>Ergebnis</Th>
              <Th align="right">Dauer</Th>
              {!compact && <Th>Sprache</Th>}
              <Th>Status</Th>
              <Th>Agent</Th>
              {!compact && <Th align="right">Kosten</Th>}
              <Th align="right" />
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => {
              const href = `/voice/${tenantSlug}/calls/${call.id}${tokenQuery}`;
              const DirectionIcon =
                call.direction === "outbound" ? PhoneOutgoing : PhoneIncoming;
              return (
                <tr
                  key={call.id}
                  className="group border-b border-line-soft transition-colors last:border-b-0 hover:bg-bg-2"
                >
                  <Td>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-ink-200 hover:text-ink"
                    >
                      <DirectionIcon
                        className="h-3.5 w-3.5 text-ink-400"
                        aria-hidden
                      />
                      <span className="font-mono text-[12px] tabular-nums">
                        {formatDateTime(call.startedAt)}
                      </span>
                    </Link>
                  </Td>
                  <Td>
                    <span className="font-mono text-[12px] text-ink-200">
                      {call.fromNumber || "—"}
                    </span>
                  </Td>
                  <Td>
                    <OutcomeChip outcome={call.outcomeType ?? null} />
                  </Td>
                  <Td align="right">
                    <span className="font-mono text-[12px] tabular-nums text-ink-300">
                      {formatDuration(call.durationSeconds)}
                    </span>
                  </Td>
                  {!compact && (
                    <Td>
                      <span className="meta text-[10px] text-ink-400">
                        {call.detectedLanguage
                          ? LANGUAGE_LABELS[call.detectedLanguage] ??
                            call.detectedLanguage.toUpperCase()
                          : "—"}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <VoiceStatusBadge status={call.status} />
                  </Td>
                  <Td>
                    <span className="text-[12px] text-ink-300">
                      {call.agentName ?? "—"}
                    </span>
                  </Td>
                  {!compact && (
                    <Td align="right">
                      <span className="font-mono text-[12px] tabular-nums text-ink-400">
                        {formatEuroCents(call.costUnits)}
                      </span>
                    </Td>
                  )}
                  <Td align="right">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-[12px] text-ink-400 transition-colors group-hover:text-copper-300"
                    >
                      Details
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
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
      className={cn(
        "meta whitespace-nowrap px-4 py-3 text-[10px] font-medium",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-4 py-3 align-middle",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {children}
    </td>
  );
}

function OutcomeChip({ outcome }: { outcome: string | null }) {
  if (!outcome) {
    return <span className="text-[12px] text-ink-400">—</span>;
  }
  const label = OUTCOME_LABELS[outcome] ?? outcome.replace(/_/g, " ");
  // Color tier mirrored from VoiceStatusBadge but kept inline so the chip
  // is consistently smaller (no dot — outcomes are noisier).
  const tone = (() => {
    switch (outcome) {
      case "appointment_booked":
        return "border-signal-ok/30 bg-signal-ok/[0.08] text-signal-ok";
      case "order_placed":
        return "border-line-hot bg-copper-500/[0.08] text-copper-300";
      case "callback_requested":
        return "border-signal-warn/30 bg-signal-warn/[0.08] text-signal-warn";
      case "transferred":
        return "border-line-hot bg-copper-500/[0.08] text-copper-300";
      case "info_provided":
      case "no_action":
        return "border-line bg-bg-2 text-ink-300";
      case "error":
        return "border-signal-err/30 bg-signal-err/[0.08] text-signal-err";
      default:
        return "border-line bg-bg-2 text-ink-300";
    }
  })();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.06em]",
        tone,
      )}
    >
      {label}
    </span>
  );
}
