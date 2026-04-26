"use client";

/**
 * TranscriptViewer — chat-style rendering of a call transcript. Agent turns
 * are left-aligned on neutral surface; caller turns are right-aligned with a
 * subtle copper tint so the asymmetry is readable at a glance.
 *
 * The schema stores transcripts as JSON arrays. We accept a normalized
 * `TranscriptSegment` shape so any provider mapper can feed this component.
 */

import { Bot, User2, Loader2 } from "lucide-react";
import { formatOffset } from "./format";
import { cn } from "@/lib/utils";

export interface TranscriptSegment {
  /** "agent" / "ai" → agent bubble; otherwise caller bubble. */
  role: string;
  text: string;
  /** Seconds offset from call start. */
  offsetSeconds?: number | null;
  /** Optional ISO timestamp (used as title hover text). */
  timestamp?: string | null;
}

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  isLoading?: boolean;
  /** Title shown above the transcript stream. */
  title?: string;
}

function isAgent(role: string) {
  const r = (role ?? "").toLowerCase();
  return r === "agent" || r === "ai" || r === "assistant" || r === "bot";
}

export default function TranscriptViewer({
  segments,
  isLoading = false,
  title = "Transkript",
}: TranscriptViewerProps) {
  return (
    <section className="panel flex h-full flex-col overflow-hidden p-0">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <h3 className="font-display text-[14px] font-medium text-ink">
          {title}
        </h3>
        <span className="meta text-[10px] text-ink-400">
          {segments.length} {segments.length === 1 ? "Segment" : "Segmente"}
        </span>
      </header>

      <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
        {isLoading && (
          <div className="flex items-center gap-2 text-ink-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span className="text-[12px]">Transkript wird geladen…</span>
          </div>
        )}

        {!isLoading && segments.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-bg-2 text-ink-400"
            >
              <Bot className="h-5 w-5" />
            </div>
            <p className="text-[13px] text-ink-300">
              Kein Transkript verfügbar
            </p>
            <p className="max-w-xs text-[11px] text-ink-400">
              Transkripte werden nach Anrufende automatisch erstellt.
            </p>
          </div>
        )}

        {segments.map((seg, idx) => {
          const agentTurn = isAgent(seg.role);
          return (
            <div
              key={idx}
              className={cn(
                "flex w-full gap-2.5",
                agentTurn ? "justify-start" : "justify-end",
              )}
            >
              {agentTurn && <Avatar kind="agent" />}
              <div
                className={cn(
                  "flex max-w-[78%] flex-col gap-1",
                  agentTurn ? "items-start" : "items-end",
                )}
              >
                <span
                  className="meta text-[10px] text-ink-400"
                  title={seg.timestamp ?? undefined}
                >
                  {agentTurn ? "Agent" : "Anrufer"} ·{" "}
                  <span className="font-mono normal-case tracking-normal">
                    {formatOffset(seg.offsetSeconds ?? null)}
                  </span>
                </span>
                <div
                  className={cn(
                    "rounded-md border px-3.5 py-2.5 text-[13px] leading-relaxed",
                    agentTurn
                      ? "border-line bg-bg-3 text-ink-200"
                      : "border-line-hot bg-copper-500/[0.10] text-ink",
                  )}
                >
                  {seg.text}
                </div>
              </div>
              {!agentTurn && <Avatar kind="caller" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Avatar({ kind }: { kind: "agent" | "caller" }) {
  if (kind === "agent") {
    return (
      <div
        aria-hidden
        className="mt-5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-hot/60 bg-copper-500/[0.10] text-copper-300"
      >
        <Bot className="h-3.5 w-3.5" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="mt-5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-bg-3 text-ink-300"
    >
      <User2 className="h-3.5 w-3.5" />
    </div>
  );
}
