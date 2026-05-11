"use client";

// =============================================================================
// ContactFormBlock — owner-configured lead form rendered at wrapper level.
//
// Renders when cardData.contactForm.enabled === true. Fields, labels, and
// submitLabel come from the owner's config. Submission POSTs to the existing
// /api/cards/[slug]/lead endpoint (M3 — Form-builder-lite).
//
// The LeadInputSchema at the API layer accepts: name, email, phone, company,
// message, interest, meetingContext, consent. The contactForm.fields array
// drives which of name/email/message are rendered (the three currently
// supported keys). Additional fields added in future schema iterations will
// flow through automatically when their key is added to the `key` enum.
//
// Returns null when contactForm is absent or disabled.
// =============================================================================

import { useState } from "react";
import type { CardData } from "@/lib/validation";

interface Props {
  slug: string;
  contactForm: CardData["contactForm"] | null;
  /** Brand-primary hex — used for the submit button background. */
  primaryHex?: string | null;
  /** Localised section heading. */
  heading?: string;
  /** Accent hex — used for the heading hairline. */
  accentHex?: string | null;
  /** Locale (en/de/tr) for all user-facing copy in this form. */
  locale?: "en" | "de" | "tr";
}

const COPY = {
  en: {
    consentMissing: "Please agree to data storage to send.",
    requiredField: (label: string) => `"${label}" is required.`,
    submitError: "Couldn't send — please try again.",
    networkError: "Network error. Please try again.",
    consentLabel: "I agree that my data may be stored and used to process my request.",
    successTitle: "Thanks for your message!",
    successBody: "I will get back to you as soon as possible.",
  },
  de: {
    consentMissing: "Bitte stimme der Datenspeicherung zu.",
    requiredField: (label: string) => `"${label}" ist ein Pflichtfeld.`,
    submitError: "Fehler beim Senden. Bitte versuche es erneut.",
    networkError: "Netzwerkfehler. Bitte versuche es erneut.",
    consentLabel: "Ich stimme zu, dass meine Daten gespeichert und zur Bearbeitung meiner Anfrage verwendet werden.",
    successTitle: "Danke für deine Nachricht!",
    successBody: "Ich werde mich so bald wie möglich bei dir melden.",
  },
  tr: {
    consentMissing: "Göndermek için verilerin saklanmasına izin ver.",
    requiredField: (label: string) => `"${label}" zorunlu alan.`,
    submitError: "Gönderilemedi — lütfen tekrar dene.",
    networkError: "Ağ hatası. Lütfen tekrar dene.",
    consentLabel: "Verilerimin saklanmasını ve talebimi işlemek için kullanılmasını kabul ediyorum.",
    successTitle: "Mesajın için teşekkürler!",
    successBody: "En kısa sürede sana dönüş yapacağım.",
  },
} as const;

type FieldValues = Record<string, string>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

const FIELD_TYPE: Record<string, "email" | "tel" | "text" | "textarea"> = {
  email: "email",
  phone: "tel",
  message: "textarea",
};

export function ContactFormBlock({
  slug,
  contactForm,
  primaryHex,
  heading = "Kontakt",
  accentHex,
  locale = "de",
}: Props) {
  const [values, setValues] = useState<FieldValues>({});
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!contactForm?.enabled || !contactForm.fields?.length) return null;

  const t = COPY[locale];
  const primary = primaryHex ?? "#C27940";
  const fields = contactForm.fields;

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(t.consentMissing);
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);

    const body: Record<string, unknown> = { consent: true };
    for (const field of fields) {
      const val = (values[field.key] ?? "").trim();
      if (field.required && !val) {
        setErrorMsg(t.requiredField(field.label));
        setStatus("idle");
        return;
      }
      body[field.key] = val;
    }
    // name is required by the API schema; ensure it's always present.
    if (!body.name) body.name = (values.name ?? "").trim() || "–";

    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setErrorMsg(json.error ?? t.submitError);
        setStatus("error");
        return;
      }
      setStatus("success");
      setValues({});
      setConsent(false);
    } catch {
      setErrorMsg(t.networkError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="mt-6">
        <div className="rounded-xl border border-line bg-bg-2 px-5 py-6 text-center">
          <p className="text-sm font-semibold text-ink">{t.successTitle}</p>
          <p className="mt-1 text-xs text-ink-300">{t.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <h2
        className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-ink-300"
        style={
          accentHex
            ? { borderBottom: `1px solid ${accentHex}40`, paddingBottom: 6 }
            : undefined
        }
      >
        {heading}
      </h2>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        noValidate
        className="grid gap-3"
      >
        {fields.map((field) => {
          const inputType = FIELD_TYPE[field.key] ?? "text";
          const val = values[field.key] ?? "";

          if (inputType === "textarea") {
            return (
              <div key={field.key} className="flex flex-col gap-1">
                <label
                  htmlFor={`cf-${field.key}`}
                  className="text-xs font-medium text-ink-300"
                >
                  {field.label}
                  {field.required && (
                    <span aria-hidden className="ml-0.5 text-red-500">
                      *
                    </span>
                  )}
                </label>
                <textarea
                  id={`cf-${field.key}`}
                  name={field.key}
                  rows={4}
                  required={field.required}
                  value={val}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full rounded-xl border border-line bg-bg-1 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-400 focus:border-line-firm focus:outline-none focus:ring-2 focus:ring-line-firm/30 resize-none"
                  placeholder={field.label}
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label
                htmlFor={`cf-${field.key}`}
                className="text-xs font-medium text-ink-300"
              >
                {field.label}
                {field.required && (
                  <span aria-hidden className="ml-0.5 text-red-500">
                    *
                  </span>
                )}
              </label>
              <input
                id={`cf-${field.key}`}
                type={inputType}
                name={field.key}
                required={field.required}
                value={val}
                onChange={(e) => handleChange(field.key, e.target.value)}
                autoComplete={field.key === "email" ? "email" : field.key === "name" ? "name" : "off"}
                className="w-full rounded-xl border border-line bg-bg-1 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-400 focus:border-line-firm focus:outline-none focus:ring-2 focus:ring-line-firm/30"
                placeholder={field.label}
              />
            </div>
          );
        })}

        {/* Consent checkbox — required by the API schema */}
        <label className="flex cursor-pointer items-start gap-2.5 text-xs text-ink-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-ink"
            required
          />
          <span>{t.consentLabel}</span>
        </label>

        {errorMsg && (
          <p role="alert" className="text-xs text-red-600">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: primary }}
        >
          {status === "submitting" ? "…" : contactForm.submitLabel}
        </button>
      </form>
    </section>
  );
}
