"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Row {
  id: string;
  orderNumber: number;
  slug: string | null;
  templateId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  callMeBack: boolean;
  amountLabel: string;
  status: string;
  contactedAt: string | null;
  createdAt: string;
}

export function AdminOrdersTable({
  rows,
  token,
  tab,
}: {
  rows: Row[];
  token: string;
  tab: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const callAdmin = async (
    orderId: string,
    action: "mark-contacted" | "cancel",
    note?: string
  ) => {
    setBusyId(orderId);
    const res = await fetch(
      `/api/admin/orders/${orderId}?token=${encodeURIComponent(token)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      }
    );
    setBusyId(null);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      alert(body.error ?? `HTTP ${res.status}`);
      return;
    }
    startTransition(() => router.refresh());
  };

  if (rows.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-10 text-center text-ink/60">
        No orders in this tab.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-left text-[11px] uppercase tracking-wider text-ink/50">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Template</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Card</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isBusy = busyId === r.id || pending;
            return (
              <tr key={r.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-4 font-mono text-xs text-ink/70">
                  <a
                    href={`/admin/orders/${r.id}?token=${encodeURIComponent(token)}`}
                    className="hover:text-brand hover:underline"
                  >
                    #{String(r.orderNumber).padStart(4, "0")}
                  </a>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`/admin/orders/${r.id}?token=${encodeURIComponent(token)}`}
                    className="font-medium text-ink hover:text-brand"
                  >
                    {r.contactName}
                  </a>
                  {r.callMeBack && (
                    <span className="ml-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      Call me back
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-xs text-ink/60">
                  <a
                    href={`tel:${r.contactPhone.replace(/\s/g, "")}`}
                    className="block text-ink hover:text-brand"
                  >
                    {r.contactPhone}
                  </a>
                  <a
                    href={`mailto:${r.contactEmail}`}
                    className="block hover:text-ink"
                  >
                    {r.contactEmail}
                  </a>
                </td>
                <td className="px-4 py-4 text-xs text-ink/60">
                  #{String(r.templateId).padStart(2, "0")}
                </td>
                <td className="px-4 py-4 text-xs text-ink/60">{r.amountLabel}</td>
                <td className="px-4 py-4">
                  <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ink/70">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs">
                  {r.slug ? (
                    <a
                      href={`/c/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-brand"
                    >
                      /c/{r.slug}
                    </a>
                  ) : (
                    <span className="text-ink/40">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-xs">
                  <div className="flex flex-col gap-2">
                    {tab === "callback" && !r.contactedAt && (
                      <button
                        onClick={() => {
                          const note =
                            window.prompt("Note (optional):") ?? undefined;
                          callAdmin(r.id, "mark-contacted", note || undefined);
                        }}
                        disabled={isBusy}
                        className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-ink/90 disabled:opacity-50"
                      >
                        Mark contacted
                      </button>
                    )}
                    {r.status !== "CANCELLED" && (
                      <button
                        onClick={() => {
                          if (!confirm(`Cancel order #${r.orderNumber}?`))
                            return;
                          callAdmin(r.id, "cancel");
                        }}
                        disabled={isBusy}
                        className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-ink/70 hover:border-ink hover:text-ink disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
