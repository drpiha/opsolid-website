"use client";

/**
 * KnowledgeBaseEditor — grouped list of VoiceKnowledgeBaseItem rows with
 * inline add form. Items are grouped by `itemType`. Tags are stored as a
 * comma-separated string in the form, normalized on save.
 *
 * Uses the unified API:
 *   POST   /api/voice/[tenantId]/knowledge-base
 *   DELETE /api/voice/[tenantId]/knowledge-base/[id]
 */

import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface KnowledgeBaseItem {
  id: string;
  itemType: string;
  title: string;
  content: string;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
}

interface KnowledgeBaseEditorProps {
  items: KnowledgeBaseItem[];
  tenantId: string;
  token: string;
  onUpdate?: () => void;
}

const ITEM_TYPES: { value: string; label: string }[] = [
  { value: "faq", label: "FAQ" },
  { value: "menu", label: "Speisekarte" },
  { value: "pricing", label: "Preise" },
  { value: "policy", label: "Richtlinie" },
  { value: "team", label: "Team" },
  { value: "location", label: "Standort" },
  { value: "custom", label: "Sonstiges" },
];

const ITEM_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  ITEM_TYPES.map((t) => [t.value, t.label]),
);

interface NewItemDraft {
  itemType: string;
  title: string;
  content: string;
  tagsRaw: string;
}

const EMPTY_DRAFT: NewItemDraft = {
  itemType: "faq",
  title: "",
  content: "",
  tagsRaw: "",
};

export default function KnowledgeBaseEditor({
  items,
  tenantId,
  token,
  onUpdate,
}: KnowledgeBaseEditorProps) {
  const [draft, setDraft] = useState<NewItemDraft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgeBaseItem[]>();
    for (const item of items) {
      const key = item.itemType || "custom";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const tags = draft.tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch(
        `/api/voice/${tenantId}/knowledge-base${tokenQuery}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: draft.itemType,
            title: draft.title.trim(),
            content: draft.content.trim(),
            tags,
          }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDraft(EMPTY_DRAFT);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eintrag wirklich löschen?")) return;
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/voice/${tenantId}/knowledge-base/${id}${tokenQuery}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
    } finally {
      setBusyId(null);
    }
  };

  const toggleGroup = (key: string) =>
    setOpenGroups((p) => ({ ...p, [key]: !(p[key] ?? true) }));

  return (
    <div className="flex flex-col gap-5">
      {/* ---------- Add form ---------- */}
      <form onSubmit={handleAdd} className="panel flex flex-col gap-4 px-5 py-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-[14px] font-medium text-ink">
            <Plus className="h-4 w-4 text-copper-400" aria-hidden />
            Neuer Eintrag
          </h3>
          <span className="meta text-[10px] text-ink-400">
            {items.length} Einträge gesamt
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr]">
          <select
            className="field"
            value={draft.itemType}
            onChange={(e) =>
              setDraft((p) => ({ ...p, itemType: e.target.value }))
            }
            aria-label="Typ"
          >
            {ITEM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="field"
            placeholder="Titel"
            value={draft.title}
            onChange={(e) =>
              setDraft((p) => ({ ...p, title: e.target.value }))
            }
            aria-label="Titel"
          />
        </div>
        <textarea
          className="field min-h-[110px] resize-y font-mono text-[12px] leading-relaxed"
          placeholder="Inhalt — z.B. Antwort auf eine häufige Frage"
          value={draft.content}
          onChange={(e) =>
            setDraft((p) => ({ ...p, content: e.target.value }))
          }
          aria-label="Inhalt"
        />
        <input
          type="text"
          className="field font-mono text-[12px]"
          placeholder="Tags, kommagetrennt (z.B. öffnungszeiten, anfahrt)"
          value={draft.tagsRaw}
          onChange={(e) =>
            setDraft((p) => ({ ...p, tagsRaw: e.target.value }))
          }
          aria-label="Tags"
        />
        {error && (
          <div className="rounded-md border border-signal-err/30 bg-signal-err/[0.08] px-3 py-2 text-[12px] text-signal-err">
            {error}
          </div>
        )}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={adding || !draft.title.trim() || !draft.content.trim()}
            className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Plus className="h-3.5 w-3.5" aria-hidden />
            )}
            Hinzufügen
          </button>
        </div>
      </form>

      {/* ---------- Existing items, grouped ---------- */}
      {grouped.length === 0 ? (
        <div className="panel flex flex-col items-center gap-2 px-6 py-12 text-center">
          <BookOpen className="h-6 w-6 text-ink-400" aria-hidden />
          <p className="text-[13px] text-ink-300">
            Noch keine Einträge in der Wissensbasis.
          </p>
          <p className="max-w-sm text-[11px] text-ink-400">
            Fügen Sie häufige Fragen, Speisekarten oder Preise hinzu, damit der Agent sie zitieren kann.
          </p>
        </div>
      ) : (
        grouped.map(([type, list]) => {
          const isOpen = openGroups[type] ?? true;
          return (
            <section key={type} className="panel overflow-hidden p-0">
              <button
                type="button"
                onClick={() => toggleGroup(type)}
                className="flex w-full items-center justify-between border-b border-line px-5 py-3 text-left transition-colors hover:bg-bg-2"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown
                      className="h-3.5 w-3.5 text-ink-400"
                      aria-hidden
                    />
                  ) : (
                    <ChevronRight
                      className="h-3.5 w-3.5 text-ink-400"
                      aria-hidden
                    />
                  )}
                  <span className="font-display text-[13px] font-medium text-ink">
                    {ITEM_TYPE_LABEL[type] ?? type}
                  </span>
                </div>
                <span className="meta text-[10px] text-ink-400">
                  {list.length} {list.length === 1 ? "Eintrag" : "Einträge"}
                </span>
              </button>
              {isOpen && (
                <ul className="divide-y divide-line">
                  {list.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-start md:justify-between md:gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[13px] font-medium text-ink">
                          {item.title}
                        </div>
                        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-300">
                          {item.content.slice(0, 240)}
                          {item.content.length > 240 ? "…" : ""}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-pill border border-line bg-bg-2 px-2 py-[2px] font-mono text-[10px] uppercase tracking-tight text-ink-300"
                              >
                                <TagIcon className="h-2.5 w-2.5" aria-hidden />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={busyId === item.id}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1.5 text-[11px] text-ink-400 transition-colors",
                          "hover:border-signal-err/50 hover:bg-signal-err/[0.08] hover:text-signal-err",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                        aria-label={`${item.title} löschen`}
                      >
                        {busyId === item.id ? (
                          <Loader2
                            className="h-3 w-3 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <Trash2 className="h-3 w-3" aria-hidden />
                        )}
                        Löschen
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
