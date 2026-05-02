import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifying… | OpSolid",
  robots: { index: false },
};

// ---------------------------------------------------------------------------
// Locale-aware copy (inline — no useLocale hook in server components)
// ---------------------------------------------------------------------------
const COPY: Record<
  string,
  { errorTitle: string; errorBody: string; requestNewLink: string; backToLogin: string }
> = {
  en: {
    errorTitle: "Link expired or invalid",
    errorBody:
      "This magic link has already been used or has expired. Please request a new one.",
    requestNewLink: "Request a new link",
    backToLogin: "Back to sign in",
  },
  de: {
    errorTitle: "Link abgelaufen oder ungültig",
    errorBody:
      "Dieser Magic Link wurde bereits verwendet oder ist abgelaufen. Bitte fordern Sie einen neuen an.",
    requestNewLink: "Neuen Link anfordern",
    backToLogin: "Zurück zur Anmeldung",
  },
  tr: {
    errorTitle: "Bağlantı süresi doldu veya geçersiz",
    errorBody:
      "Bu sihirli bağlantı zaten kullanılmış veya süresi dolmuş. Lütfen yeni bir tane isteyin.",
    requestNewLink: "Yeni bağlantı iste",
    backToLogin: "Giriş sayfasına dön",
  },
};

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en;
}

// ---------------------------------------------------------------------------
// Server component — verify magic-link token on the server side.
//
// Design decision: the token is consumed via a server-side fetch to
// /api/auth/magic-link/verify (GET). This keeps the token out of client JS
// and allows us to set the refresh cookie from the API response before the
// redirect fires. On success we follow the API's redirect to /dashboard/cards.
// On failure we render an error UI with a link back to /login.
// ---------------------------------------------------------------------------
export default async function MagicLinkVerifyPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  const locale = params.locale ?? "en";
  const token = searchParams.token;
  const copy = getCopy(locale);

  if (!token) {
    // No token — show error immediately without hitting the API
    return <ErrorUI locale={locale} copy={copy} />;
  }

  // Build the absolute URL for the API route so we can call it server-side
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, "");

  let apiRedirectTarget: string | null = null;
  let verifyOk = false;

  try {
    const res = await fetch(
      `${siteUrl}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`,
      {
        redirect: "manual", // Don't follow — we need to inspect the Location header
        cache: "no-store",
      },
    );

    if (res.status === 302 || res.status === 301) {
      const location = res.headers.get("location");
      if (location && !location.includes("error=")) {
        apiRedirectTarget = location;
        verifyOk = true;
      }
    }
    // 200 without redirect = unexpected; treat as error
  } catch {
    // Network error — show error UI
  }

  if (verifyOk && apiRedirectTarget) {
    // Note: cookies set by the API won't transfer this way because we're doing
    // a server-to-server fetch. The API route already handles its own redirect
    // with the cookie set. For the page-level verify flow, redirect the browser
    // directly to the API endpoint so the cookie flows through normally.
    redirect(`/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`);
  }

  return <ErrorUI locale={locale} copy={copy} />;
}

// ---------------------------------------------------------------------------
// Error UI
// ---------------------------------------------------------------------------
function ErrorUI({
  locale,
  copy,
}: {
  locale: string;
  copy: ReturnType<typeof getCopy>;
}) {
  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-signal-err/20 bg-signal-err/8">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-signal-err"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-ink tracking-tight mb-2">
        {copy.errorTitle}
      </h2>
      <p className="text-sm text-ink-400 mb-8 max-w-xs mx-auto">{copy.errorBody}</p>

      <div className="flex flex-col items-center gap-3">
        <Link
          href={`/${locale}/login`}
          className="rounded-md bg-copper-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-copper-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2"
        >
          {copy.requestNewLink}
        </Link>
        <Link
          href={`/${locale}/login`}
          className="text-xs text-ink-500 hover:text-copper-500 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          &larr; {copy.backToLogin}
        </Link>
      </div>
    </div>
  );
}
