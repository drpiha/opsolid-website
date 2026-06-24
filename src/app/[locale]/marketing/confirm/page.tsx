// =============================================================================
// /[locale]/marketing/confirm — DOI confirmation landing page.
//
// Reads ?token, calls confirmMarketingConsent server-side (no client fetch, no
// separate API route), and renders a friendly result:
//   confirmed → consent now active
//   already   → was already confirmed
//   invalid   → unknown / missing token
//
// v2 tokens only (bg-bg-*, text-ink/ink-*, copper, .panel, .btn). Reminder:
// slash-opacity on ink/bg/line is a NO-OP — use explicit steps (text-ink-300);
// only copper/NN + signal-* take opacity.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import {
  confirmMarketingConsent,
  type ConfirmResult,
} from "@/lib/marketing/consent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirm subscription | OpSolid",
  robots: { index: false },
};

type State = ConfirmResult | "missing";

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
    confirmed: {
      title: "Anmeldung bestätigt",
      body: "Vielen Dank. Ihre Einwilligung ist aktiv — Sie erhalten gelegentlich Produktneuigkeiten und Angebote zu OpSo Smart. Sie können sich jederzeit über den Abmeldelink in jeder E-Mail abmelden.",
      cta: "Zur Startseite",
    },
    already: {
      title: "Bereits bestätigt",
      body: "Ihre Anmeldung war bereits bestätigt. Sie müssen nichts weiter tun.",
      cta: "Zur Startseite",
    },
    invalid: {
      title: "Link ungültig",
      body: "Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an, falls Sie Produktneuigkeiten erhalten möchten.",
      cta: "Zur Startseite",
    },
    missing: {
      title: "Link ungültig",
      body: "Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an, falls Sie Produktneuigkeiten erhalten möchten.",
      cta: "Zur Startseite",
    },
    back: "OpSolid · opsolid.de",
  },
  en: {
    confirmed: {
      title: "Subscription confirmed",
      body: "Thank you. Your consent is active — you'll occasionally receive product news and offers about OpSo Smart. You can unsubscribe at any time via the link in every email.",
      cta: "Back to home",
    },
    already: {
      title: "Already confirmed",
      body: "Your subscription was already confirmed. There's nothing more to do.",
      cta: "Back to home",
    },
    invalid: {
      title: "Invalid link",
      body: "This confirmation link is invalid or has expired. Please opt in again if you'd like to receive product news.",
      cta: "Back to home",
    },
    missing: {
      title: "Invalid link",
      body: "This confirmation link is invalid or has expired. Please opt in again if you'd like to receive product news.",
      cta: "Back to home",
    },
    back: "OpSolid · opsolid.de",
  },
  tr: {
    confirmed: {
      title: "Abonelik onaylandı",
      body: "Teşekkürler. İzniniz aktif — ara sıra OpSo Smart hakkında ürün haberleri ve teklifler alacaksınız. Her e-postadaki bağlantı ile istediğiniz zaman abonelikten çıkabilirsiniz.",
      cta: "Ana sayfaya dön",
    },
    already: {
      title: "Zaten onaylandı",
      body: "Aboneliğiniz zaten onaylanmıştı. Yapmanız gereken başka bir şey yok.",
      cta: "Ana sayfaya dön",
    },
    invalid: {
      title: "Geçersiz bağlantı",
      body: "Bu onay bağlantısı geçersiz veya süresi dolmuş. Ürün haberleri almak istiyorsanız lütfen yeniden abone olun.",
      cta: "Ana sayfaya dön",
    },
    missing: {
      title: "Geçersiz bağlantı",
      body: "Bu onay bağlantısı geçersiz veya süresi dolmuş. Ürün haberleri almak istiyorsanız lütfen yeniden abone olun.",
      cta: "Ana sayfaya dön",
    },
    back: "OpSolid · opsolid.de",
  },
};

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en;
}

export default async function MarketingConfirmPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  const locale = params.locale ?? "en";
  const token = searchParams.token;

  const state: State = token
    ? await confirmMarketingConsent(token)
    : "missing";

  const localeCopy = getCopy(locale);
  const copy = localeCopy[state];
  const ok = state === "confirmed" || state === "already";

  return (
    <section className="min-h-[70vh] bg-bg-1 flex items-center justify-center px-4 py-24">
      <div className="panel w-full max-w-md p-8 text-center">
        <div
          className={
            ok
              ? "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-copper-500/30 bg-copper-500/10"
              : "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-signal-err/30 bg-signal-err/10"
          }
        >
          {ok ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-copper-500"
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
