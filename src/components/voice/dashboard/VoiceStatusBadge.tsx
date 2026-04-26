/**
 * VoiceStatusBadge — small chip with a colored dot, mapping arbitrary
 * status / outcome strings used across the Voice Agent schema to a
 * consistent visual language.
 *
 * Color tiers (semantic, not decorative):
 *   ok      → active, ended, answered, completed, done
 *   neutral → draft, pending, initiated, ringing
 *   warn    → paused, suspended, trial, no_answer, busy, callback_requested
 *   err     → archived, released, cancelled, failed, error
 *   hot     → in_progress, processing, transferred, appointment_booked, order_placed
 *
 * The chip itself uses .chip + an inline dot — no inline styles needed.
 */

import { cn } from "@/lib/utils";

type Tone = "ok" | "neutral" | "warn" | "err" | "hot";

const STATUS_TONE: Record<string, Tone> = {
  // tenant / agent / phone
  active: "ok",
  draft: "neutral",
  paused: "warn",
  archived: "err",
  trial: "warn",
  suspended: "warn",
  cancelled: "err",
  released: "err",
  pending: "neutral",
  inactive: "neutral",
  error: "err",

  // call status
  ringing: "neutral",
  in_progress: "hot",
  ended: "ok",
  failed: "err",
  busy: "warn",
  no_answer: "warn",

  // call disposition
  answered: "ok",
  voicemail: "neutral",
  transferred: "hot",
  abandoned: "warn",

  // call outcome
  appointment_booked: "ok",
  order_placed: "hot",
  callback_requested: "warn",
  info_provided: "neutral",
  no_action: "neutral",

  // processing
  processing: "hot",
  done: "ok",

  // test runs
  initiated: "neutral",
  completed: "ok",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Aktiv",
  draft: "Entwurf",
  paused: "Pausiert",
  archived: "Archiviert",
  trial: "Test",
  suspended: "Gesperrt",
  cancelled: "Storniert",
  released: "Freigegeben",
  pending: "Ausstehend",
  inactive: "Inaktiv",
  error: "Fehler",

  ringing: "Klingelt",
  in_progress: "Laufend",
  ended: "Beendet",
  failed: "Fehlgeschlagen",
  busy: "Besetzt",
  no_answer: "Keine Antwort",

  answered: "Angenommen",
  voicemail: "Mailbox",
  transferred: "Weitergeleitet",
  abandoned: "Abgebrochen",

  appointment_booked: "Termin gebucht",
  order_placed: "Bestellung",
  callback_requested: "Rückruf",
  info_provided: "Info gegeben",
  no_action: "Keine Aktion",

  processing: "Verarbeitung",
  done: "Fertig",

  initiated: "Gestartet",
  completed: "Abgeschlossen",
};

export interface VoiceStatusBadgeProps {
  status: string;
  /** Override the derived German label (useful for raw provider strings). */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const TONE_CLASSES: Record<Tone, { dot: string; text: string; ring: string }> = {
  ok: {
    dot: "bg-signal-ok shadow-[0_0_6px_rgba(127,178,134,0.55)]",
    text: "text-signal-ok",
    ring: "border-signal-ok/30 bg-signal-ok/[0.08]",
  },
  neutral: {
    dot: "bg-ink-400",
    text: "text-ink-300",
    ring: "border-line bg-bg-2",
  },
  warn: {
    dot: "bg-signal-warn shadow-[0_0_6px_rgba(212,162,58,0.55)]",
    text: "text-signal-warn",
    ring: "border-signal-warn/30 bg-signal-warn/[0.08]",
  },
  err: {
    dot: "bg-signal-err shadow-[0_0_6px_rgba(184,81,75,0.55)]",
    text: "text-signal-err",
    ring: "border-signal-err/30 bg-signal-err/[0.08]",
  },
  hot: {
    dot: "bg-copper-400 shadow-bloom-sm",
    text: "text-copper-300",
    ring: "border-line-hot bg-copper-500/[0.08]",
  },
};

export default function VoiceStatusBadge({
  status,
  label,
  size = "sm",
  className,
}: VoiceStatusBadgeProps) {
  const key = (status ?? "").toLowerCase();
  const tone: Tone = STATUS_TONE[key] ?? "neutral";
  const text =
    (label ?? STATUS_LABEL[key] ?? key.replace(/_/g, " ")) || "—";
  const t = TONE_CLASSES[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border font-mono uppercase tracking-[0.08em]",
        size === "sm"
          ? "px-2 py-[3px] text-[10px]"
          : "px-2.5 py-1 text-[11px]",
        t.ring,
        t.text,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-pill", t.dot)}
      />
      <span className="leading-none">{text}</span>
    </span>
  );
}
