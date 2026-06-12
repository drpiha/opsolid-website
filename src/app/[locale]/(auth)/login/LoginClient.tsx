"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { isLocale } from "@/lib/i18n";

interface Props {
  locale: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginClient({ locale }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? `/${locale}/dashboard/cards`;
  const safeLocale = isLocale(locale) ? locale : "en";

  const s = t.auth.login;
  const errs = t.auth.errors;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"magic" | "password" | null>(null);

  function validateEmail(value: string): boolean {
    if (!EMAIL_RE.test(value)) {
      setEmailError(errs.invalid_email);
      return false;
    }
    setEmailError(null);
    return true;
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validateEmail(email)) return;

    setSubmitError(null);
    setSubmitting("magic");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: safeLocale }),
      });
      if (res.status === 429) {
        setSubmitError(errs.rate_limited);
        return;
      }
      router.push(`/${safeLocale}/magic-link?email=${encodeURIComponent(email)}`);
    } catch {
      setSubmitError(errs.generic);
    } finally {
      setSubmitting(null);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validateEmail(email)) return;
    if (!password) {
      setSubmitError(errs.invalid_credentials);
      return;
    }

    setSubmitError(null);
    setSubmitting("password");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 429) {
        setSubmitError(errs.rate_limited);
        return;
      }
      if (!res.ok) {
        setSubmitError(errs.invalid_credentials);
        return;
      }
      router.push(next);
    } catch {
      setSubmitError(errs.generic);
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="w-full">
      <h1 className="font-display text-2xl font-semibold text-ink tracking-tight mb-2">
        {s.title}
      </h1>
      <p className="text-sm text-ink-400 mb-8">{s.subtitle}</p>

      {submitError && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-signal-err/30 bg-signal-err/8 px-4 py-3 text-sm text-signal-err"
        >
          {submitError}
        </div>
      )}

      <form
        onSubmit={showPassword ? handlePasswordLogin : handleMagicLink}
        className="space-y-4"
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-ink-300 mb-1.5"
          >
            {s.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            onBlur={() => email && validateEmail(email)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-err" : undefined}
            className="field w-full"
          />
          {emailError && (
            <p id="email-err" className="mt-1 text-xs text-signal-err">
              {emailError}
            </p>
          )}
        </div>

        {showPassword && (
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-ink-300 mb-1.5"
            >
              {s.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field w-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting !== null}
          className="btn btn-primary w-full"
        >
          {submitting === "magic"
            ? "…"
            : submitting === "password"
              ? "…"
              : showPassword
                ? s.passwordLabel
                : s.magicLinkCta}
        </button>

        {!showPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(true)}
            className="block w-full text-center text-xs text-ink-500 hover:text-copper-500 transition-colors"
          >
            {s.passwordCta}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowPassword(false);
              setPassword("");
              setSubmitError(null);
            }}
            className="block w-full text-center text-xs text-ink-500 hover:text-copper-500 transition-colors"
          >
            {s.magicLinkCta}
          </button>
        )}
      </form>

      {/* Divider + Google */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
          {s.orDivider}
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <a
        href={`/api/auth/google?next=${encodeURIComponent(next.replace(`/${safeLocale}`, ""))}&mobile=0&locale=${safeLocale}`}
        className="btn btn-ghost mt-4 w-full flex items-center justify-center gap-2.5 border border-line hover:border-copper-500/40"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.48h4.844a4.14 4.14 0 01-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        {s.googleCta}
      </a>

      <p className="mt-6 text-center text-xs text-ink-500">
        {s.dontHaveAccount}{" "}
        <Link
          href={`/${safeLocale}/signup`}
          className="text-copper-500 hover:underline"
        >
          {s.signUpLink}
        </Link>
      </p>
    </div>
  );
}
