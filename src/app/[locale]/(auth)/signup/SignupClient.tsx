"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { isLocale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Schema — password is optional; when supplied it must be strong.
// ---------------------------------------------------------------------------
const SignupSchema = z.object({
  email: z.string().trim().email({ message: "invalid_email" }),
  name: z.string().trim().max(100).optional().or(z.literal("").transform(() => undefined)),
  password: z
    .string()
    .optional()
    .refine(
      (v) => !v || (v.length >= 12 && /[a-zA-Z]/.test(v) && /[0-9]/.test(v)),
      { message: "weak_password" },
    ),
});

type SignupFields = z.infer<typeof SignupSchema>;

// ---------------------------------------------------------------------------
// Masked email helper (unused for now — keep for reuse)
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _maskEmail(email: string): string {
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
export function SignupClient({ locale }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const s = t.auth.signup;
  const errs = t.auth.errors;

  const safeLocale = isLocale(locale) ? locale : "en";

  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupFields>({
    resolver: zodResolver(SignupSchema),
    mode: "onBlur",
  });

  // Focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Map API error code to localised copy
  function mapApiError(code: string): string {
    const map: Record<string, string> = {
      invalid_email: errs.invalid_email,
      weak_password: errs.weak_password,
      email_in_use: errs.email_in_use,
      email_unavailable: errs.email_unavailable,
      invalid_credentials: errs.invalid_credentials,
      rate_limited: errs.rate_limited,
      invalid_input: errs.invalid_input,
    };
    return map[code] ?? errs.generic;
  }

  // Map schema error message key to localised copy
  function fieldError(msg?: string): string | undefined {
    if (!msg) return undefined;
    const map: Record<string, string> = {
      invalid_email: errs.invalid_email,
      weak_password: errs.weak_password,
    };
    return map[msg] ?? msg;
  }

  // Primary: magic-link path
  async function handleMagicLink() {
    const email = getValues("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setApiError(errs.invalid_email);
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: safeLocale }),
      });
      if (res.status === 429) {
        setApiError(errs.rate_limited);
        return;
      }
      // 202 = success (always, per privacy design)
      router.push(`/${safeLocale}/magic-link?email=${encodeURIComponent(email)}`);
    } catch {
      setApiError(errs.generic);
    } finally {
      setSubmitting(false);
    }
  }

  // Secondary: password path
  async function handlePasswordSignup(data: SignupFields) {
    if (!data.password) {
      await handleMagicLink();
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name || undefined,
          locale: safeLocale,
        }),
      });
      if (res.status === 202) {
        // Server treated it as magic-link (shouldn't happen here but handle it)
        router.push(`/${safeLocale}/magic-link?email=${encodeURIComponent(data.email)}`);
        return;
      }
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          error?: { code?: string };
        };
        setApiError(mapApiError(json.error?.code ?? "generic"));
        return;
      }
      router.push(`/${safeLocale}/dashboard/cards`);
    } catch {
      setApiError(errs.generic);
    } finally {
      setSubmitting(false);
    }
  }

  const { ref: emailRhfRef, ...emailRest } = register("email");

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-ink tracking-tight mb-1">
        {s.title}
      </h2>
      <p className="text-sm text-ink-400 mb-8">{s.subtitle}</p>

      {/* API error banner */}
      {apiError && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-signal-err/30 bg-signal-err/8 px-4 py-3 text-sm text-signal-err"
        >
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(handlePasswordSignup)} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="signup-email"
            className="block text-xs font-medium text-ink-300 mb-1.5 tracking-wide uppercase"
          >
            {s.emailLabel}
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signup-email-err" : undefined}
            className={`w-full rounded-md border bg-bg-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-500 outline-none transition-colors focus:border-copper-500 focus:ring-1 focus:ring-copper-500/30 ${
              errors.email ? "border-signal-err" : "border-line"
            }`}
            placeholder="you@company.com"
            {...emailRest}
            ref={(el) => {
              emailRhfRef(el);
              emailRef.current = el;
            }}
          />
          {errors.email && (
            <p id="signup-email-err" className="mt-1.5 text-xs text-signal-err">
              {fieldError(errors.email.message)}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="signup-name"
            className="block text-xs font-medium text-ink-300 mb-1.5 tracking-wide uppercase"
          >
            {s.nameLabel}
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`w-full rounded-md border bg-bg-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-500 outline-none transition-colors focus:border-copper-500 focus:ring-1 focus:ring-copper-500/30 ${
              errors.name ? "border-signal-err" : "border-line"
            }`}
            placeholder="Alex Chen"
            {...register("name")}
          />
        </div>

        {/* Password expander */}
        {!passwordExpanded ? (
          <button
            type="button"
            onClick={() => setPasswordExpanded(true)}
            className="mb-5 text-xs text-ink-400 hover:text-copper-500 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {s.expandPassword}
          </button>
        ) : (
          <div className="mb-5">
            <label
              htmlFor="signup-password"
              className="block text-xs font-medium text-ink-300 mb-1.5 tracking-wide uppercase"
            >
              {s.passwordLabel}
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "signup-password-err" : "signup-password-hint"
              }
              className={`w-full rounded-md border bg-bg-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-500 outline-none transition-colors focus:border-copper-500 focus:ring-1 focus:ring-copper-500/30 ${
                errors.password ? "border-signal-err" : "border-line"
              }`}
              placeholder="min. 12 characters"
              {...register("password")}
            />
            {errors.password ? (
              <p id="signup-password-err" className="mt-1.5 text-xs text-signal-err">
                {fieldError(errors.password.message)}
              </p>
            ) : (
              <p id="signup-password-hint" className="mt-1.5 text-xs text-ink-500">
                Min 12 chars · at least one letter and one number
              </p>
            )}
          </div>
        )}

        {/* Primary CTA — magic link */}
        {!passwordExpanded && (
          <button
            type="button"
            disabled={submitting}
            onClick={handleMagicLink}
            className="w-full rounded-md bg-copper-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-copper-600 active:bg-copper-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2"
          >
            {submitting ? "…" : s.magicLinkCta}
          </button>
        )}

        {/* Secondary CTA — password submit (only shown when expander is open) */}
        {passwordExpanded && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-copper-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-copper-600 active:bg-copper-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2"
          >
            {submitting ? "…" : "Create account"}
          </button>
        )}

        {/* Divider + magic link secondary when password is open */}
        {passwordExpanded && (
          <div className="mt-3 flex items-center gap-3">
            <span className="flex-1 border-t border-line" />
            <button
              type="button"
              disabled={submitting}
              onClick={handleMagicLink}
              className="text-xs text-ink-400 hover:text-copper-500 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:underline"
            >
              {s.magicLinkCta} →
            </button>
            <span className="flex-1 border-t border-line" />
          </div>
        )}
      </form>

      {/* Footer link */}
      <p className="mt-8 text-xs text-ink-500 text-center">
        {s.alreadyHaveAccount}{" "}
        <Link
          href={`/${safeLocale}/login`}
          className="text-copper-500 hover:text-copper-600 transition-colors font-medium"
        >
          {s.signInLink}
        </Link>
      </p>
    </div>
  );
}
