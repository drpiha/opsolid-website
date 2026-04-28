"use client";

// =============================================================================
// SendMyInfoButton — visitor leaves their contact for the card owner.
//
// POSTs to /api/cards/[slug]/lead with GDPR consent. Strings come from the
// owner's persisted locale (DE/EN/TR), passed in as a `labels` bag so this
// stays a leaf component without importing the content dictionary directly.
//
// Phase 8 — ported from a hand-rolled modal to Radix Dialog so focus trap,
// scroll lock, ESC handling, and z-index stacking all behave correctly.
// =============================================================================

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Send, X, CheckCircle2 } from "lucide-react";

export interface SendLabels {
  triggerLabel: string;
  modalTitle: string;
  modalSubtitle: string;
  submitLabel: string;
  submittingLabel: string;
  closeLabel: string;
  successTitle: string;
  successBody: string;
  successCloseLabel: string;
  consentRequired: string;
  submitFailed: string;
  networkError: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  companyLabel: string;
  meetingContextLabel: string;
  meetingContextPh: string;
  interestLabel: string;
  messageLabel: string;
  messagePh: string;
  consentText: string;
  requiredMark: string;
}

interface Props {
  slug: string;
  /** Source query string already encoded with leading "?" (or empty). */
  sourceQs: string;
  primary: string;
  labels: SendLabels;
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function SendMyInfoButton({ slug, sourceQs, primary, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const consent = form.querySelector<HTMLInputElement>("#smart-consent");
    if (!consent?.checked) {
      setState({ kind: "error", message: labels.consentRequired });
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
          message: body?.error ?? labels.submitFailed,
        });
        return;
      }
      setState({ kind: "ok" });
    } catch {
      setState({ kind: "error", message: labels.networkError });
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setState({ kind: "idle" });
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
          style={{
            borderColor: primary,
            color: primary,
            background: `${primary}10`,
          }}
        >
          <Send size={15} strokeWidth={2.2} />
          {labels.triggerLabel}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[101] mx-auto w-full max-w-md overflow-hidden rounded-t-3xl bg-bg-1 ring-1 ring-line outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-4 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="truncate text-base font-semibold text-ink">
                {labels.modalTitle}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 truncate text-xs text-ink-300">
                {labels.modalSubtitle}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={labels.closeLabel}
                className="ml-3 rounded-full p-1.5 text-ink-300 hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </Dialog.Close>
          </header>

          {state.kind === "ok" ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: `${primary}22`, color: primary }}
              >
                <CheckCircle2 size={26} strokeWidth={2.2} />
              </div>
              <h4 className="text-lg font-semibold text-ink">
                {labels.successTitle}
              </h4>
              <p className="text-sm text-ink-300">{labels.successBody}</p>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="mt-2 rounded-pill border border-line bg-bg-2 px-5 py-2 text-sm font-medium text-ink hover:bg-bg-3"
                >
                  {labels.successCloseLabel}
                </button>
              </Dialog.Close>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid max-h-[80vh] gap-3 overflow-y-auto px-5 py-5 text-sm"
              noValidate
            >
              <Field
                label={labels.nameLabel}
                requiredMark={labels.requiredMark}
                name="name"
                autoComplete="name"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={labels.phoneLabel}
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  inputMode="tel"
                />
                <Field
                  label={labels.emailLabel}
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </div>
              <Field
                label={labels.companyLabel}
                name="company"
                autoComplete="organization"
              />
              <Field
                label={labels.meetingContextLabel}
                name="meetingContext"
                placeholder={labels.meetingContextPh}
              />
              <Field label={labels.interestLabel} name="interest" />
              <label className="grid gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                  {labels.messageLabel}
                </span>
                <textarea
                  name="message"
                  rows={3}
                  className="rounded-xl border border-line bg-bg-2 px-3 py-2 text-sm text-ink placeholder-ink-400 focus:border-line-firm focus:outline-none focus:ring-1 focus:ring-line-firm"
                  placeholder={labels.messagePh}
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
                <span>{labels.consentText}</span>
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
                {state.kind === "submitting"
                  ? labels.submittingLabel
                  : labels.submitLabel}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
  requiredMark = "*",
}: {
  label: string;
  name: string;
  autoComplete?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text" | "numeric" | "url";
  required?: boolean;
  placeholder?: string;
  requiredMark?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
        {label}
        {required && (
          <span className="ml-1 text-signal-err">{requiredMark}</span>
        )}
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
