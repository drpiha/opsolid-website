/**
 * Shared formatting helpers for the Voice Agent dashboard. Kept tiny and
 * dependency-free so they can be imported from both server and client
 * components.
 */

/** "2m 34s" / "47s" / "1h 3m". Falsy / negative input → em dash. */
export function formatDuration(seconds?: number | null): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) {
    return "—";
  }
  const total = Math.round(seconds);
  if (total < 60) return `${total}s`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h ${mm}m` : `${h}h`;
}

/** "MM:SS" elapsed offset for transcript timestamps. */
export function formatOffset(seconds?: number | null): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Localized German short date+time, e.g. "26.04. 14:32". */
export function formatDateTime(input: Date | string | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Day-only German format ("26. Apr 2026"). */
export function formatDate(input: Date | string | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Cents → "€12,34" German locale. costUnits is treated as cents. */
export function formatEuroCents(cents?: number | null): string {
  if (typeof cents !== "number" || !Number.isFinite(cents)) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Human-friendly outcome label. */
export const OUTCOME_LABELS: Record<string, string> = {
  appointment_booked: "Termin gebucht",
  order_placed: "Bestellung",
  callback_requested: "Rückruf",
  info_provided: "Info gegeben",
  transferred: "Weitergeleitet",
  no_action: "Keine Aktion",
  error: "Fehler",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  tr: "Türkçe",
  en: "English",
  multilingual: "Mehrsprachig",
};

export const PROMPT_TEMPLATE_LABELS: Record<string, string> = {
  generic_receptionist: "Allgemeine Rezeption",
  appointment_business: "Terminbuchung",
  restaurant_reservation: "Restaurant Reservierung",
  restaurant_order: "Restaurant Bestellung",
  clinic: "Arztpraxis",
  hotel: "Hotel",
};

export const WEEKDAYS_DE_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
export const WEEKDAYS_DE_LONG = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
] as const;

/** Mask a token preserving the first 8 chars. */
export function maskToken(token: string): string {
  if (!token) return "••••••••";
  return token.length > 8 ? `${token.slice(0, 8)}••••` : "••••••••";
}
