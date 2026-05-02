"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { isLocale } from "@/lib/i18n";

const RESEND_COOLDOWN_S = 60;

// ---------------------------------------------------------------------------
// Mask email for display
// ---------------------------------------------------------------------------
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  const stars = "*".repeat(Math.max(local.length - 2, 3));
  return `${visible}${stars}@${domain}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  locale: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function MagicLinkClient({ locale }: Props) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const s = t.auth.magicLink;
  const errs = t.auth.errors;

  const safeLocale = isLocale(locale) ? locale : "en";
  const emailParam = searchParams.get("email") ?? "";
  const maskedEmail = emailParam ? maskEmail(emailParam) : "";

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function handleResend() {
    if (!emailParam || cooldown > 0 || resending) return;
    setResending(true);
    setResendError(null);
    setResendSuccess(false);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam, locale: safeLocale }),
      });
      if (res.status === 429) {
        setResendError(errs.rate_limited);
        return;
      }
      setResendSuccess(true);
      setCooldown(RESEND_COOLDOWN_S);
    } catch {
      setResendError(errs.generic);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-copper-500/20 bg-copper-500/8">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-copper-500"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-ink tracking-tight mb-2">
        {s.title}
      </h2>
      <p className="text-sm text-ink-400 mb-1">{s.subtitle}</p>
      {maskedEmail && (
        <p className="text-sm font-medium text-ink-200 mb-8">{maskedEmail}</p>
      )}

      {/* Error */}
      {resendError && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-signal-err/30 bg-signal-err/8 px-4 py-3 text-sm text-signal-err"
        >
          {resendError}
        </div>
      )}

      {/* Resend success */}
      {resendSuccess && (
        <div
          role="status"
          className="mb-5 rounded-md border border-signal-ok/30 bg-signal-ok/8 px-4 py-3 text-sm text-signal-ok"
        >
          {s.sentToEmail} {maskedEmail}
        </div>
      )}

      {/* Resend button */}
      {cooldown > 0 ? (
        <p className="text-xs text-ink-500 mb-6">
          {s.resendCooldown}{" "}
          <span className="font-medium text-ink-300 tabular-nums">{cooldown}s</span>
        </p>
      ) : (
        <button
          type="button"
          disabled={resending}
          onClick={handleResend}
          className="mb-6 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-300 hover:border-copper-500/50 hover:text-copper-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2"
        >
          {resending ? "…" : s.resendCta}
        </button>
      )}

      {/* Back link */}
      <div>
        <Link
          href={`/${safeLocale}/login`}
          className="text-xs text-ink-500 hover:text-copper-500 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          &larr; {s.backToLogin}
        </Link>
      </div>
    </div>
  );
}
