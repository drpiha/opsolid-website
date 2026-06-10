"use client";

// =============================================================================
// ResendLinkButton — lost-edit-link recovery affordance on the rejection view.
//
// POSTs to /api/card/edit/[orderId]/resend-link, which emails a fresh copy of
// the card-live message (public + edit links) to the order's STORED contact
// email. The response is { ok: true } regardless of whether the order exists,
// so this UI can promise nothing more specific than "if this order exists,
// the email is on its way".
//
// Copy is inline per locale, matching the surrounding EditRejectedView (a
// deliberately self-contained terminal page outside the content-file system).
// =============================================================================

import { useState } from "react";

const COPY: Record<"en" | "de" | "tr", { idle: string; sending: string; sent: string; rateLimited: string; hint: string }> = {
  en: {
    idle: "Email me the edit link",
    sending: "Sending…",
    sent: "If this order exists, the edit link is on its way to the email used at purchase.",
    rateLimited: "Too many attempts — please try again later.",
    hint: "We send it to the email address stored on the order — nowhere else.",
  },
  de: {
    idle: "Edit-Link per E-Mail senden",
    sending: "Wird gesendet…",
    sent: "Falls diese Bestellung existiert, ist der Edit-Link auf dem Weg an die hinterlegte E-Mail-Adresse.",
    rateLimited: "Zu viele Versuche — bitte später erneut versuchen.",
    hint: "Wir senden ihn ausschließlich an die in der Bestellung hinterlegte E-Mail-Adresse.",
  },
  tr: {
    idle: "Düzenleme linkini e-postama gönder",
    sending: "Gönderiliyor…",
    sent: "Bu sipariş mevcutsa, düzenleme linki kayıtlı e-posta adresine gönderildi.",
    rateLimited: "Çok fazla deneme — lütfen daha sonra tekrar deneyin.",
    hint: "Yalnızca siparişte kayıtlı e-posta adresine gönderilir.",
  },
};

export function ResendLinkButton({
  orderId,
  locale,
}: {
  orderId: string;
  locale: "en" | "de" | "tr";
}) {
  const t = COPY[locale] ?? COPY.en;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "rate_limited">("idle");

  const send = async () => {
    if (state === "sending" || state === "sent") return;
    setState("sending");
    try {
      const res = await fetch(`/api/card/edit/${orderId}/resend-link`, {
        method: "POST",
      });
      setState(res.status === 429 ? "rate_limited" : "sent");
    } catch {
      // Network failure — let the user retry.
      setState("idle");
    }
  };

  if (state === "sent") {
    return <p className="mt-6 text-sm text-ink-200">{t.sent}</p>;
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="btn btn-primary text-sm disabled:opacity-60"
      >
        {state === "sending" ? t.sending : t.idle}
      </button>
      {state === "rate_limited" && (
        <p className="mt-2 text-sm text-ink-300">{t.rateLimited}</p>
      )}
      <p className="mt-2 text-xs text-ink-300">{t.hint}</p>
    </div>
  );
}
