"use client";

// =============================================================================
// OwnerWelcome — first-visit onboarding sheet for a fresh card owner.
//
// Shown once per card (localStorage flag) when the owner lands on their live
// card right after creation. Three plain steps answer the questions every
// new owner has — "which link do I share?", "where do my private links
// live?", "where are my stats?" — then gets out of the way forever.
// =============================================================================

import * as React from "react";
import { BarChart3, LogIn, Mail, Share2, X } from "lucide-react";

interface Labels {
  title: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
  manageCta: string;
  loginCta: string;
  loginBody: string;
  dismiss: string;
}

interface Props {
  /** Per-card storage key suffix so a second card shows the tour again. */
  cardKey: string;
  manageHref: string;
  /** When set (unclaimed card), invites the owner to log in and own the card
   *  on their account so it's manageable from any device without the token. */
  loginHref?: string;
  labels: Labels;
}

export function OwnerWelcome({ cardKey, manageHref, loginHref, labels }: Props) {
  const storageKey = `opsolid-owner-welcome-${cardKey}`;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!window.localStorage.getItem(storageKey)) setOpen(true);
    } catch {
      /* private mode — skip the tour rather than re-showing forever */
    }
  }, [storageKey]);

  const dismiss = React.useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  if (!open) return null;

  const steps: { icon: React.ReactNode; title: string; body: string }[] = [
    {
      icon: <Share2 size={16} className="text-copper-600" />,
      title: labels.step1Title,
      body: labels.step1Body,
    },
    {
      icon: <Mail size={16} className="text-copper-600" />,
      title: labels.step2Title,
      body: labels.step2Body,
    },
    {
      icon: <BarChart3 size={16} className="text-copper-600" />,
      title: labels.step3Title,
      body: labels.step3Body,
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm">
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_24px_64px_-16px_rgba(20,18,15,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-neutral-900">🎉 {labels.title}</p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={labels.dismiss}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={16} />
          </button>
        </div>
        <ol className="mt-3 space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-copper-500/10">
                {step.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-neutral-900">
                  {step.title}
                </span>
                <span className="block text-xs leading-relaxed text-neutral-500">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center gap-2">
          <a
            href={manageHref}
            onClick={dismiss}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-copper-500 px-4 py-2 text-sm font-semibold text-white hover:bg-copper-600"
          >
            <BarChart3 size={14} />
            {labels.manageCta}
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
          >
            {labels.dismiss}
          </button>
        </div>
        {loginHref && (
          <a
            href={loginHref}
            onClick={dismiss}
            className="mt-3 flex items-start gap-2 rounded-2xl border border-copper-500/25 bg-copper-500/[0.06] px-3 py-2.5 text-left hover:border-copper-500/45"
          >
            <LogIn size={15} className="mt-0.5 shrink-0 text-copper-600" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-neutral-900">
                {labels.loginCta}
              </span>
              <span className="block text-xs leading-relaxed text-neutral-500">
                {labels.loginBody}
              </span>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
