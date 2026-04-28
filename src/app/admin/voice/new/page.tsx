"use client";

/**
 * Admin · new Voice tenant. Client component because the form posts via
 * fetch and shows the freshly minted tenantToken once on success (one-time
 * display with copy button — admin must save it).
 */

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface CreateResponse {
  id: string;
  slug: string;
  businessName: string;
  tenantToken: string;
}

export default function NewTenantPage() {
  const params = useSearchParams();
  const adminToken = params?.get("token") ?? "";
  const tokenQ = `?token=${encodeURIComponent(adminToken)}`;

  const [draft, setDraft] = useState({
    slug: "",
    businessName: "",
    contactEmail: "",
    timezone: "Europe/Berlin",
    mode: "standalone",
    businessCategory: "generic",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/voice/admin/tenants${tokenQ}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { data: CreateResponse };
      setCreated(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anlegen fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.tenantToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (created) {
    const dashboardUrl = `/voice/${created.slug}/overview?token=${encodeURIComponent(created.tenantToken)}`;
    return (
      <main className="min-h-screen bg-bg-0">
        <div className="mx-auto w-full max-w-2xl px-6 py-10">
          <Link
            href={`/admin/voice${tokenQ}`}
            className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 hover:text-copper-300"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Zurück
          </Link>
          <h1 className="mt-2 font-display text-[24px] font-medium text-ink">
            Tenant angelegt
          </h1>
          <p className="mt-2 text-[13px] text-ink-300">
            <span className="text-copper-300">Wichtig:</span> Der Tenant-Token wird hier nur einmal angezeigt. Speichern Sie ihn jetzt sicher ab.
          </p>

          <section className="panel mt-6 flex flex-col gap-3 px-5 py-5">
            <div>
              <span className="meta text-[10px] text-ink-400">
                Tenant-Token
              </span>
              <div className="mt-1 flex items-stretch gap-2">
                <input
                  readOnly
                  className="field flex-1 font-mono text-[12px]"
                  value={created.tenantToken}
                  aria-label="Tenant-Token"
                />
                <button
                  type="button"
                  onClick={copy}
                  className="btn btn-ghost btn-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-signal-ok" aria-hidden />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                      Kopieren
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 border-t border-line-soft pt-3 md:grid-cols-2">
              <Detail label="Slug" value={created.slug} mono />
              <Detail label="Firma" value={created.businessName} />
            </div>
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm mt-2 self-start"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Dashboard öffnen
            </a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-0">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Link
          href={`/admin/voice${tokenQ}`}
          className="meta mb-2 inline-flex items-center gap-1 text-[10px] text-ink-400 hover:text-copper-300"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Zurück
        </Link>
        <h1 className="mt-2 font-display text-[28px] font-medium text-ink">
          Neuen Voice-Kunden anlegen
        </h1>
        <p className="mt-1 text-[13px] text-ink-300">
          Slug ist URL-sicher; der Tenant-Token wird automatisch generiert und
          danach einmalig angezeigt.
        </p>

        <form onSubmit={submit} className="panel mt-6 flex flex-col gap-4 px-5 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Slug" required>
              <input
                required
                type="text"
                pattern="^[a-z0-9-]{3,40}$"
                className="field font-mono text-[12px]"
                placeholder="kebab-case-slug"
                value={draft.slug}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, slug: e.target.value.toLowerCase() }))
                }
              />
            </Field>
            <Field label="Firmenname" required>
              <input
                required
                type="text"
                className="field"
                value={draft.businessName}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, businessName: e.target.value }))
                }
              />
            </Field>
            <Field label="Kontakt-E-Mail" required>
              <input
                required
                type="email"
                className="field font-mono text-[12px]"
                value={draft.contactEmail}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, contactEmail: e.target.value }))
                }
              />
            </Field>
            <Field label="Zeitzone">
              <select
                className="field font-mono text-[12px]"
                value={draft.timezone}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, timezone: e.target.value }))
                }
              >
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Europe/Vienna">Europe/Vienna</option>
                <option value="Europe/Zurich">Europe/Zurich</option>
                <option value="Europe/Istanbul">Europe/Istanbul</option>
              </select>
            </Field>
            <Field label="Modus">
              <select
                className="field"
                value={draft.mode}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, mode: e.target.value }))
                }
              >
                <option value="standalone">Standalone</option>
                <option value="kutasia_module">Kutasia-Modul</option>
              </select>
            </Field>
            <Field label="Branche">
              <select
                className="field"
                value={draft.businessCategory}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, businessCategory: e.target.value }))
                }
              >
                <option value="generic">Allgemein</option>
                <option value="appointment">Termingeschäft</option>
                <option value="restaurant">Gastronomie</option>
                <option value="clinic">Praxis / Klinik</option>
                <option value="hotel">Hotel</option>
              </select>
            </Field>
          </div>

          {error && (
            <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-line-soft pt-4">
            <div className="meta inline-flex items-center gap-1 text-[10px] text-copper-300">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Tenant-Token wird einmalig nach dem Anlegen angezeigt
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : null}
              Anlegen
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="meta flex items-center gap-1 text-[10px] text-ink-400">
        {label}
        {required && (
          <span className="text-copper-400" aria-hidden>
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="meta text-[10px] text-ink-400">{label}</span>
      <div
        className={
          "mt-0.5 text-[13px] text-ink " +
          (mono ? "font-mono tabular-nums" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}
