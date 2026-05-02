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

      <p className="mt-8 text-center text-xs text-ink-500">
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
