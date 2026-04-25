"use client";

// =============================================================================
// SendMyInfoButton — "Bilgilerimi Gönder" CTA + modal form.
//
// Visitor opens this from the public card page to send their own contact
// details to the card owner. POSTs to /api/cards/[slug]/lead which stores a
// CardLead row (email notification + admin listing land in Phase 2).
//
// Form fields use HTML autocomplete tokens so mobile browsers offer the
// visitor's saved profile in one tap. We deliberately do not include any
// silent / passive collection — the form is opt-in with a GDPR consent box.
// =============================================================================

import { useState, useEffect } from "react";
import { Send, X, CheckCircle2 } from "lucide-react";

interface Props {
  slug: string;
  /** Source query string already encoded with leading "?" (or empty). */
  sourceQs: string;
  primary: string;
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function SendMyInfoButton({ slug, sourceQs, primary }: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const consent = form.querySelector<HTMLInputElement>("#smart-consent");
    if (!consent?.checked) {
      setState({ kind: "error", message: "Bitte Datenschutzhinweis bestätigen." });
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch(
        `/api/cards/${encodeURIComponent(slug)}/lead${sourceQs}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            phone: String(data.get("phone") ?? "").trim(),
            company: String(data.get("company") ?? "").trim(),
            message: String(data.get("message") ?? "").trim(),
            interest: String(data.get("interest") ?? "").trim(),
            meetingContext: String(data.get("meetingContext") ?? "").trim(),
            consent: true,
          }),
        },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setState({
          kind: "error",
          message: body?.error ?? "Senden fehlgeschlagen. Bitte später erneut versuchen.",
        });
        return;
      }
      setState({ kind: "ok" });
    } catch {
      setState({ kind: "error", message: "Netzwerkfehler. Bitte erneut versuchen." });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setState({ kind: "idle" });
          setOpen(true);
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
        style={{
          borderColor: primary,
          color: primary,
          background: `${primary}10`,
        }}
      >
        <Send size={15} strokeWidth={2.2} />
        Meine Daten senden
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="smart-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-bg-1 ring-1 ring-line sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 id="smart-modal-title" className="text-base font-semibold text-ink">
                Meine Daten senden
              </h3>
              <button
                type="button"
                aria-label="Schließen"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-ink-300 hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </header>

            {state.kind === "ok" ? (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: `${primary}22`, color: primary }}
                >
                  <CheckCircle2 size={26} strokeWidth={2.2} />
                </div>
                <h4 className="text-lg font-semibold text-ink">Vielen Dank!</h4>
                <p className="text-sm text-ink-300">
                  Ihre Daten wurden gesendet. Sie hören in Kürze von uns.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-pill border border-line bg-bg-2 px-5 py-2 text-sm font-medium text-ink hover:bg-bg-3"
                >
                  Schließen
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-3 px-5 py-5 text-sm"
                noValidate
              >
                <Field label="Name" name="name" autoComplete="name" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Telefon"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    inputMode="tel"
                  />
                  <Field
                    label="E-Mail"
                    name="email"
                    autoComplete="email"
                    type="email"
                  />
                </div>
                <Field label="Unternehmen" name="company" autoComplete="organization" />
                <Field
                  label="Wo haben wir uns kennengelernt?"
                  name="meetingContext"
                  placeholder="Hannover Messe, LinkedIn, Empfehlung …"
                />
                <Field label="Interesse / Thema" name="interest" />
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    Nachricht
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    className="rounded-xl border border-line bg-bg-2 px-3 py-2 text-sm text-ink placeholder-ink-400 focus:border-line-firm focus:outline-none focus:ring-1 focus:ring-line-firm"
                    placeholder="Worum geht's?"
                  />
                </label>
                <label className="flex items-start gap-2 text-xs text-ink-300">
                  <input
                    id="smart-consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 accent-current"
                    style={{ accentColor: primary }}
                  />
                  <span>
                    Ich stimme zu, dass meine Angaben zur Kontaktaufnahme verarbeitet
                    werden (DSGVO).
                  </span>
                </label>

                {state.kind === "error" && (
                  <p className="text-xs text-signal-err">{state.message}</p>
                )}

                <button
                  type="submit"
                  disabled={state.kind === "submitting"}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-depth-2 transition active:scale-[0.99] disabled:opacity-60"
                  style={{ background: primary }}
                >
                  {state.kind === "submitting" ? "Wird gesendet…" : "Senden"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  name,
  autoComplete,
  type = "text",
  inputMode,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text" | "numeric" | "url";
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
        {label}
        {required && <span className="ml-1 text-signal-err">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-line bg-bg-2 px-3 py-2 text-sm text-ink placeholder-ink-400 focus:border-line-firm focus:outline-none focus:ring-1 focus:ring-line-firm"
      />
    </label>
  );
}
