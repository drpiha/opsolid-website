"use client";

// =============================================================================
// DomainPanel — admin UI for the per-card custom domain (Phase 6 Part A).
//
// Lets ops staff:
//   - Save a customer-supplied hostname  (POST  /api/admin/cards/:id/domain)
//   - Run DNS verification                (POST  /api/admin/cards/:id/domain/verify)
//   - Clear the domain                    (POST  /api/admin/cards/:id/domain { domain: null })
//
// BETA banner is intentional and stays until the Traefik catch-all router
// is deployed (see plan §A "Custom Domain" — UNRESOLVED ops blocker).
// =============================================================================

import { useState } from "react";

interface Props {
  orderId: string;
  token: string;
  currentDomain: string | null;
  verified: boolean;
  verifiedAt: string | null;
}

type FormState = "idle" | "submitting" | "ok" | "error";

interface VerifyResult {
  verified: boolean;
  records: string[];
  hint?: string;
  customDomainVerifiedAt?: string | null;
}

export function DomainPanel({
  orderId,
  token,
  currentDomain,
  verified,
  verifiedAt,
}: Props) {
  const [domain, setDomain] = useState<string>(currentDomain ?? "");
  const [savedDomain, setSavedDomain] = useState<string | null>(currentDomain);
  const [isVerified, setIsVerified] = useState<boolean>(verified);
  const [verifiedAtState, setVerifiedAtState] = useState<string | null>(verifiedAt);

  const [saveState, setSaveState] = useState<FormState>("idle");
  const [verifyState, setVerifyState] = useState<FormState>("idle");
  const [clearState, setClearState] = useState<FormState>("idle");

  const [error, setError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

  const tokenQS = `?token=${encodeURIComponent(token)}`;
  const saveUrl = `/api/admin/cards/${orderId}/domain${tokenQS}`;
  const verifyUrl = `/api/admin/cards/${orderId}/domain/verify${tokenQS}`;

  async function handleSave() {
    setError(null);
    setVerifyResult(null);
    setSaveState("submitting");
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) {
      setSaveState("error");
      setError("Enter a hostname or use Clear domain.");
      return;
    }
    try {
      const res = await fetch(saveUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      });
      const body = (await res.json().catch(() => null)) as
        | {
            error?: string;
            customDomain?: string | null;
            customDomainVerified?: boolean;
            customDomainVerifiedAt?: string | null;
          }
        | null;
      if (!res.ok) {
        setSaveState("error");
        setError(body?.error ?? `HTTP ${res.status}`);
        return;
      }
      setSavedDomain(body?.customDomain ?? trimmed);
      setIsVerified(Boolean(body?.customDomainVerified));
      setVerifiedAtState(body?.customDomainVerifiedAt ?? null);
      setSaveState("ok");
    } catch (e) {
      setSaveState("error");
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  async function handleVerify() {
    setError(null);
    setVerifyState("submitting");
    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const body = (await res.json().catch(() => null)) as
        | (VerifyResult & { error?: string })
        | null;
      if (!res.ok) {
        setVerifyState("error");
        setError(body?.error ?? `HTTP ${res.status}`);
        return;
      }
      setVerifyResult({
        verified: Boolean(body?.verified),
        records: body?.records ?? [],
        hint: body?.hint,
        customDomainVerifiedAt: body?.customDomainVerifiedAt ?? null,
      });
      setIsVerified(Boolean(body?.verified));
      if (body?.verified && body.customDomainVerifiedAt) {
        setVerifiedAtState(body.customDomainVerifiedAt);
      }
      setVerifyState("ok");
    } catch (e) {
      setVerifyState("error");
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  async function handleClear() {
    setError(null);
    setVerifyResult(null);
    setClearState("submitting");
    try {
      const res = await fetch(saveUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain: null }),
      });
      const body = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!res.ok) {
        setClearState("error");
        setError(body?.error ?? `HTTP ${res.status}`);
        return;
      }
      setDomain("");
      setSavedDomain(null);
      setIsVerified(false);
      setVerifiedAtState(null);
      setClearState("ok");
    } catch (e) {
      setClearState("error");
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:col-span-2">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-heading-sm text-ink">Custom domain</h2>
          <span className="rounded-full bg-signal-warn/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/80">
            Beta
          </span>
        </div>
        {savedDomain && (
          <StatusBadge verified={isVerified} verifiedAt={verifiedAtState} />
        )}
      </div>

      <p className="mb-4 rounded-xl border border-signal-warn/40 bg-signal-warn/10 px-3 py-2 text-xs text-ink/80">
        Beta — DNS routing pending. Production traffic for third-party hosts is
        not yet live; the resolver works in dev only until the Traefik catch-all
        router is deployed.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="grid gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
            Customer hostname
          </span>
          <input
            type="text"
            inputMode="url"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="card.theirdomain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 font-mono text-sm text-ink"
          />
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "submitting" || !domain.trim()}
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saveState === "submitting"
            ? "Saving…"
            : saveState === "ok"
            ? "Saved!"
            : "Save"}
        </button>

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifyState === "submitting" || !savedDomain}
          className="rounded-full border border-ink/20 bg-white px-4 py-2 text-xs font-semibold text-ink disabled:opacity-50"
        >
          {verifyState === "submitting" ? "Verifying…" : "Verify now"}
        </button>
      </div>

      {savedDomain && (
        <div className="mt-4 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-semibold text-ink/70">Saved:</span>
            <code className="font-mono text-ink">{savedDomain}</code>
            {verifiedAtState && (
              <span className="text-ink/50">
                verified {new Date(verifiedAtState).toLocaleString("de-DE")}
              </span>
            )}
          </div>

          {!isVerified && (
            <div className="grid gap-1">
              <p className="font-semibold text-ink/70">CNAME instruction</p>
              <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-[11px] text-ink">
                {`CNAME  ${savedDomain}  →  card.opsolid.de`}
              </pre>
              <p className="text-ink/60">
                After the CNAME is in place (DNS may take up to 24h), press
                <em> Verify now</em>.
              </p>
            </div>
          )}

          {verifyResult && (
            <div className="grid gap-1 rounded-lg border border-neutral-200 bg-white p-3">
              <p className="font-semibold text-ink/70">
                Verify result:{" "}
                <span
                  className={
                    verifyResult.verified ? "text-brand" : "text-signal-err"
                  }
                >
                  {verifyResult.verified ? "verified" : "not verified"}
                </span>
              </p>
              {verifyResult.records.length > 0 ? (
                <ul className="ml-4 list-disc text-ink/70">
                  {verifyResult.records.map((r, i) => (
                    <li key={i}>
                      <code className="font-mono text-[11px]">{r}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink/60">
                  No CNAME records found for this hostname.
                </p>
              )}
              {verifyResult.hint && (
                <p className="text-ink/60">{verifyResult.hint}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleClear}
            disabled={clearState === "submitting"}
            className="justify-self-start text-[11px] text-signal-err underline disabled:opacity-50"
          >
            {clearState === "submitting" ? "Clearing…" : "Clear domain"}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-signal-err">{error}</p>}
    </section>
  );
}

function StatusBadge({
  verified,
  verifiedAt,
}: {
  verified: boolean;
  verifiedAt: string | null;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        verified
          ? "bg-brand/10 text-brand"
          : "bg-neutral-200 text-ink/60"
      }`}
      title={verifiedAt ?? undefined}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          verified ? "bg-brand" : "bg-ink/30"
        }`}
      />
      {verified ? "verified" : "pending"}
    </span>
  );
}
