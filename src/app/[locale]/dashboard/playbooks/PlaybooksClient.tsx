"use client";

// =============================================================================
// PlaybooksClient — list + enable + test fire hero automations.
//
// Sits next to the Inbox in the dashboard. Demo-fair friendly: the
// "Test fire" button on each card runs the automation against the most
// recent open thread (for message.in triggers) or with empty extra
// (for calendar / scheduled / manual triggers).
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Locale = "de" | "en" | "tr";

interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  triggerType: string;
}

interface PlaybookRow {
  id: string;
  templateSlug: string | null;
  name: string;
  description: string | null;
  triggerType: string;
  triggerConfig: unknown;
  active: boolean;
  lastRunAt: string | null;
  lastRunOk: boolean | null;
  lastRunError: string | null;
  runCount: number;
}

const COPY: Record<Locale, {
  title: string;
  subtitle: string;
  catalogTitle: string;
  installedTitle: string;
  installCta: string;
  installing: string;
  installed: string;
  empty: string;
  testFire: string;
  testing: string;
  active: string;
  paused: string;
  toggleOn: string;
  toggleOff: string;
  delete: string;
  trigger: string;
  lastRun: string;
  never: string;
  runs: string;
  triggerNames: Record<string, string>;
}> = {
  de: {
    title: "Playbooks",
    subtitle: "Hero-Automatisierungen für Ihren Posteingang",
    catalogTitle: "Verfügbare Vorlagen",
    installedTitle: "Aktive Playbooks",
    installCta: "Aktivieren",
    installing: "Aktiviere …",
    installed: "Installiert",
    empty: "Noch kein Playbook aktiviert.",
    testFire: "Test-Lauf",
    testing: "Läuft …",
    active: "Aktiv",
    paused: "Pausiert",
    toggleOn: "Aktivieren",
    toggleOff: "Pausieren",
    delete: "Entfernen",
    trigger: "Trigger",
    lastRun: "Letzter Lauf",
    never: "Nie",
    runs: "Läufe",
    triggerNames: {
      "message.in": "Eingehende Nachricht",
      "thread.created": "Neue Konversation",
      "calendar.cancelled": "Termin abgesagt",
      schedule: "Zeitplan",
      manual: "Manuell",
    },
  },
  en: {
    title: "Playbooks",
    subtitle: "Hero automations for your inbox",
    catalogTitle: "Available templates",
    installedTitle: "Active playbooks",
    installCta: "Enable",
    installing: "Enabling …",
    installed: "Installed",
    empty: "No playbooks installed yet.",
    testFire: "Test fire",
    testing: "Running …",
    active: "Active",
    paused: "Paused",
    toggleOn: "Activate",
    toggleOff: "Pause",
    delete: "Remove",
    trigger: "Trigger",
    lastRun: "Last run",
    never: "Never",
    runs: "runs",
    triggerNames: {
      "message.in": "Inbound message",
      "thread.created": "New conversation",
      "calendar.cancelled": "Booking cancelled",
      schedule: "Schedule",
      manual: "Manual",
    },
  },
  tr: {
    title: "Playbook'lar",
    subtitle: "Inbox için hero otomasyonlar",
    catalogTitle: "Şablon kataloğu",
    installedTitle: "Aktif playbook'lar",
    installCta: "Etkinleştir",
    installing: "Ekleniyor …",
    installed: "Kuruldu",
    empty: "Henüz playbook eklenmedi.",
    testFire: "Test çalıştır",
    testing: "Çalışıyor …",
    active: "Aktif",
    paused: "Pasif",
    toggleOn: "Etkinleştir",
    toggleOff: "Duraklat",
    delete: "Sil",
    trigger: "Tetik",
    lastRun: "Son çalışma",
    never: "Hiç",
    runs: "çalıştı",
    triggerNames: {
      "message.in": "Gelen mesaj",
      "thread.created": "Yeni konuşma",
      "calendar.cancelled": "Randevu iptali",
      schedule: "Zamanlama",
      manual: "Manuel",
    },
  },
};

export function PlaybooksClient() {
  const params = useParams();
  const locale = ((params?.locale as Locale | undefined) ?? "de") as Locale;
  const copy = COPY[locale] ?? COPY.de;

  const [catalog, setCatalog] = useState<CatalogEntry[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/inbox/playbooks");
    if (!res.ok) return;
    const data = (await res.json()) as {
      catalog: CatalogEntry[];
      playbooks: PlaybookRow[];
    };
    setCatalog(data.catalog);
    setPlaybooks(data.playbooks);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const installedSlugs = new Set(playbooks.map((p) => p.templateSlug));

  async function install(slug: string) {
    setBusy(`install:${slug}`);
    try {
      await fetch("/api/inbox/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug: slug, active: true }),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function toggle(p: PlaybookRow) {
    setBusy(`toggle:${p.id}`);
    try {
      await fetch(`/api/inbox/playbooks/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function testFire(p: PlaybookRow) {
    setBusy(`fire:${p.id}`);
    try {
      await fetch(`/api/inbox/playbooks/${p.id}/test-fire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function remove(p: PlaybookRow) {
    setBusy(`del:${p.id}`);
    try {
      await fetch(`/api/inbox/playbooks/${p.id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(null);
    }
  }

  function fmtTrigger(t: string) {
    return copy.triggerNames[t] ?? t;
  }

  function fmtLastRun(p: PlaybookRow) {
    if (!p.lastRunAt) return copy.never;
    const when = new Date(p.lastRunAt).toLocaleString(
      locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB",
      { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" },
    );
    return p.lastRunOk === false ? `${when} · ✗ ${p.lastRunError ?? "error"}` : when;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink">{copy.title}</h1>
        <p className="mt-1 text-sm text-ink-400">{copy.subtitle}</p>
      </header>

      <section>
        <h2 className="meta mono-label mb-3 text-ink-400">
          {copy.installedTitle}
        </h2>
        {playbooks.length === 0 ? (
          <p className="rounded-2xl border border-line-soft bg-bg-2 p-6 text-sm text-ink-400">
            {copy.empty}
          </p>
        ) : (
          <ul className="space-y-2">
            {playbooks.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-line bg-bg-1 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-ink">
                        {p.name}
                      </h3>
                      <span
                        className={`chip text-xs ${p.active ? "chip-hot" : ""}`}
                      >
                        {p.active ? copy.active : copy.paused}
                      </span>
                    </div>
                    {p.description && (
                      <p className="mt-1 text-sm text-ink-400">{p.description}</p>
                    )}
                    <p className="mono-label mt-2 text-[10px] text-ink-300">
                      {copy.trigger}: {fmtTrigger(p.triggerType)} · {copy.lastRun}:{" "}
                      {fmtLastRun(p)} · {p.runCount} {copy.runs}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      className="chip text-xs"
                      disabled={busy?.startsWith("fire:")}
                      onClick={() => testFire(p)}
                    >
                      {busy === `fire:${p.id}` ? copy.testing : copy.testFire}
                    </button>
                    <button
                      className="chip text-xs"
                      disabled={busy?.startsWith("toggle:")}
                      onClick={() => toggle(p)}
                    >
                      {p.active ? copy.toggleOff : copy.toggleOn}
                    </button>
                    <button
                      className="chip text-xs text-signal-err"
                      disabled={busy?.startsWith("del:")}
                      onClick={() => remove(p)}
                    >
                      {copy.delete}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="meta mono-label mb-3 text-ink-400">
          {copy.catalogTitle}
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {catalog.map((entry) => {
            const isInstalled = installedSlugs.has(entry.slug);
            return (
              <li
                key={entry.slug}
                className="flex flex-col rounded-2xl border border-line bg-bg-1 p-4"
              >
                <h3 className="text-sm font-semibold text-ink">{entry.name}</h3>
                <p className="mt-1 flex-1 text-xs text-ink-400">
                  {entry.description}
                </p>
                <p className="mono-label mt-3 text-[10px] text-ink-300">
                  {copy.trigger}: {fmtTrigger(entry.triggerType)}
                </p>
                <button
                  className={`mt-3 self-start text-xs ${isInstalled ? "chip" : "btn btn-primary btn-sm"}`}
                  disabled={isInstalled || busy === `install:${entry.slug}`}
                  onClick={() => install(entry.slug)}
                >
                  {isInstalled
                    ? copy.installed
                    : busy === `install:${entry.slug}`
                      ? copy.installing
                      : copy.installCta}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
