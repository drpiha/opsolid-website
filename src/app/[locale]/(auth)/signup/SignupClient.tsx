"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { isLocale } from "@/lib/i18n";
// GDPR / §7 UWG — the EXACT marketing opt-in checkbox wording. Imported from
// the client-safe copy module (no prisma / no node:crypto), which is the SAME
// source of truth the signup/magic-link routes persist as `consentText`, so the
// stored consent always equals what the user saw.
import { marketingCheckboxText } from "@/lib/marketing/copy";

// M3 — when the visitor lands here from a public-card "Create yours" CTA,
// the URL carries `?ref=<slug-or-code>`. Persist it in a cookie so the
// post-magic-link callback (which doesn't have URL state) can still find it
// and credit the referrer once the new user has an authenticated session.
const REF_COOKIE_NAME = "verso_ref";
const REF_COOKIE_TTL_S = 60 * 60 * 24 * 7; // 7 days

interface Props {
  locale: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 12;

export function SignupClient({ locale }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeLocale = isLocale(locale) ? locale : "en";

  const s = t.auth.signup;
  const errs = t.auth.errors;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // GDPR / §7 UWG — separate marketing opt-in. UNTICKED by default (Planet49);
  // never pre-checked.
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"magic" | "password" | null>(null);

  // M3 — stash any inbound `?ref=` so the post-auth callback can attribute.
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    // Length-clamp + character allowlist before persisting; the redeem route
    // re-validates, but we want to keep junk out of the cookie jar entirely.
    const cleaned = ref.slice(0, 80).replace(/[^A-Za-z0-9_-]/g, "");
    if (!cleaned) return;
    try {
      document.cookie = [
        `${REF_COOKIE_NAME}=${cleaned}`,
        "Path=/",
        `Max-Age=${REF_COOKIE_TTL_S}`,
        "SameSite=Lax",
      ].join("; ");
    } catch {
      /* ignore — we'll fall back to no-attribution if cookies are blocked */
    }
  }, [searchParams]);

  function validateEmail(value: string): boolean {
    if (!EMAIL_RE.test(value)) {
      setEmailError(errs.invalid_email);
      return false;
    }
    setEmailError(null);
    return true;
  }

  function validatePassword(value: string): boolean {
    if (value.length < PASSWORD_MIN || !/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
      setPasswordError(errs.weak_password);
      return false;
    }
    setPasswordError(null);
    return true;
  }

  async function handleMagicSignup(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validateEmail(email)) return;

    setSubmitError(null);
    setSubmitting("magic");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          locale: safeLocale,
          marketingOptIn,
        }),
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

  async function handlePasswordSignup(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    setSubmitError(null);
    setSubmitting("password");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
          locale: safeLocale,
          marketingOptIn,
        }),
      });
      if (res.status === 409) {
        setSubmitError(errs.email_in_use);
        return;
      }
      if (res.status === 429) {
        setSubmitError(errs.rate_limited);
        return;
      }
      if (!res.ok) {
        setSubmitError(errs.generic);
        return;
      }
      router.push(`/${safeLocale}/dashboard/cards`);
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
        onSubmit={showPassword ? handlePasswordSignup : handleMagicSignup}
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

        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-ink-300 mb-1.5"
          >
            {s.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field w-full"
          />
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
              autoComplete="new-password"
              minLength={PASSWORD_MIN}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              onBlur={() => password && validatePassword(password)}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-err" : undefined}
              className="field w-full"
            />
            {passwordError && (
              <p id="password-err" className="mt-1 text-xs text-signal-err">
                {passwordError}
              </p>
            )}
          </div>
        )}

        {/* GDPR / §7 UWG — separate, UNTICKED-by-default marketing opt-in.
            Distinct from any terms/privacy consent; never pre-checked. */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="marketingOptIn"
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-copper-500"
          />
          <label
            htmlFor="marketingOptIn"
            className="text-xs leading-relaxed text-ink-400 cursor-pointer"
          >
            {marketingCheckboxText(safeLocale)}
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting !== null}
          className="btn btn-primary w-full"
        >
          {submitting === "magic" || submitting === "password"
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
            {s.expandPassword}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowPassword(false);
              setPassword("");
              setPasswordError(null);
              setSubmitError(null);
            }}
            className="block w-full text-center text-xs text-ink-500 hover:text-copper-500 transition-colors"
          >
            {s.magicLinkCta}
          </button>
        )}
      </form>

      <p className="mt-8 text-center text-xs text-ink-500">
        {s.alreadyHaveAccount}{" "}
        <Link
          href={`/${safeLocale}/login`}
          className="text-copper-500 hover:underline"
        >
          {s.signInLink}
        </Link>
      </p>
    </div>
  );
}
