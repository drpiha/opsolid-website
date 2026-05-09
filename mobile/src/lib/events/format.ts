// -----------------------------------------------------------------------
// Sprint F2 — event date formatting helpers (locale-aware).
//
// Uses Intl.DateTimeFormat from the runtime — already cross-locale capable on
// Hermes. Single-day events render "Tue, 15 May" (no end). Multi-day events
// render "15-17 May" if same month, otherwise "29 Apr - 2 May".
// -----------------------------------------------------------------------

import type { Locale } from '../i18n/locale';

function intlLocale(locale: Locale): string {
  if (locale === 'de') return 'de-DE';
  if (locale === 'tr') return 'tr-TR';
  return 'en-US';
}

export function formatEventDateRange(
  startIso: string,
  endIso: string,
  locale: Locale,
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const tag = intlLocale(locale);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat(tag, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(start);
  }

  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  if (sameMonth) {
    const monthName = new Intl.DateTimeFormat(tag, { month: 'short' }).format(start);
    return `${start.getDate()}–${end.getDate()} ${monthName}`;
  }

  const startStr = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
  }).format(start);
  const endStr = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
  }).format(end);
  return `${startStr} – ${endStr}`;
}

export function formatEventLongDate(
  startIso: string,
  endIso: string,
  locale: Locale,
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const tag = intlLocale(locale);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  if (sameDay) {
    return new Intl.DateTimeFormat(tag, dateOpts).format(start);
  }

  const startStr = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
  }).format(start);
  const endStr = new Intl.DateTimeFormat(tag, dateOpts).format(end);
  return `${startStr} – ${endStr}`;
}
