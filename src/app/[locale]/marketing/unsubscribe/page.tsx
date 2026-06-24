// =============================================================================
// /[locale]/marketing/unsubscribe — one-click unsubscribe landing page.
//
// Reads ?token, calls unsubscribeMarketingConsent server-side (no client
// fetch, no separate API route), and renders a confirmation. Unsubscribe is
// intentionally lenient/idempotent — a second click on the same link still
// reports success.
//
// v2 tokens only (bg-bg-*, text-ink/ink-*, copper, .panel, .btn). Reminder:
// slash-opacity on ink/bg/line is a NO-OP — use explicit steps (text-ink-300);
// only copper/NN + signal-* take opacity.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import {
  unsubscribeMarketingConsent,
  type UnsubscribeResult,
} from "@/lib/marketing/consent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe | OpSolid",
  robots: { index: false },
};

type State = UnsubscribeResult | "missing";

interface ResultCopy {
  title: string;
  body: string;
  cta: string;
}

const COPY: Record<
  string,
  Record<State, ResultCopy> & { back: string }
> = {
  de: {
    unsubscribed: {
      title: "Abgemeldet",
      body: "Sie wurden abgemeldet und erhalten keine Marketing-E-Mails mehr von OpSolid. Transaktionale E-Mails (z. B. zu Ihrem Konto) sind davon nicht betroffen.",
      cta: "Zur Startseite",
    },
    invalid: {
      title: "Link ungültig",
      body: "Dieser Abmeldelink ist ungültig oder abgelaufen. Falls Sie weiterhin Marketing-E-Mails erhalten, schreiben Sie an info@opsolid.de.",
      cta: "Zur Startseite",
    },
    missing: {
      title: "Link ungültig",
      body: "Dieser Abmeldelink ist ungültig oder abgelaufen. Falls Sie weiterhin Marketing-E-Mails erhalten, schreiben Sie an info@opsolid.de.",
      cta: "Zur Startseite",
    },
    back: "OpSolid · opsolid.de",
  },
  en: {
    unsubscribed: {
      title: "Unsubscribed",
      body: "You've been unsubscribed and won't receive any more marketing email from OpSolid. Transactional emails (e.g. about your account) are not affected.",
      cta: "Back to home",
    },
    invalid: {
      title: "Invalid link",
      body: "This unsubscribe link is invalid or has expired. If you still receive marketing email, write to info@opsolid.de.",
      cta: "Back to home",
    },
    missing: {
      title: "Invalid link",
      body: "This unsubscribe link is invalid or has expired. If you still receive marketing email, write to info@opsolid.de.",
      cta: "Back to home",
    },
    back: "OpSolid · opsolid.de",
  },
  tr: {
    unsubscribed: {
      title: "Abonelikten çıkıldı",
      body: "Abonelikten çıkarıldınız ve OpSolid'den artık pazarlama e-postası almayacaksınız. İşlemsel e-postalar (ör. hesabınızla ilgili) bundan etkilenmez.",
      cta: "Ana sayfaya dön",
    },
    invalid: {
      title: "Geçersiz bağlantı",
      body: "Bu abonelikten çıkma bağlantısı geçersiz veya süresi dolmuş. Hâlâ pazarlama e-postası alıyorsanız info@opsolid.de adresine yazın.",
      cta: "Ana sayfaya dön",
    },
    missing: {
      title: "Geçersiz bağlantı",
      body: "Bu abonelikten çıkma bağlantısı geçersiz veya süresi dolmuş. Hâlâ pazarlama e-postası alıyorsanız info@opsolid.de adresine yazın.",
      cta: "Ana sayfaya dön",
    },
    back: "OpSolid · opsolid.de",
  },
};

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en;
}

export default async function MarketingUnsubscribePage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  const locale = params.locale ?? "en";
  const token = searchParams.token;

  const state: State = token
    ? await unsubscribeMarketingConsent(token)
    : "missing";

  const localeCopy = getCopy(locale);
  const copy = localeCopy[state];
  const ok = state === "unsubscribed";

  return (
    <section className="min-h-[70vh] bg-bg-1 flex items-center justify-center px-4 py-24">
      <div className="panel w-full max-w-md p-8 text-center">
        <div
          className={
            ok
              ? "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-bg-3"
              : "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-signal-err/30 bg-signal-err/10"
          }
        >
          {ok ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-ink-300"
              aria-hidden="true"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-signal-err"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <h1 className="text-xl font-semibold text-ink tracking-tight mb-3">
          {copy.title}
        </h1>
        <p className="text-sm text-ink-300 mb-8 leading-relaxed">{copy.body}</p>

        <Link href={`/${locale}`} className="btn btn-primary">
          {copy.cta}
        </Link>

        <p className="mt-8 text-xs text-ink-400">{localeCopy.back}</p>
      </div>
    </section>
  );
}
