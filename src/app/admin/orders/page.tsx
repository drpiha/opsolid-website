import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/config/card-templates";
import { AdminOrdersTable } from "./AdminOrdersTable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Orders",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string; tab?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { token = "", tab = "callback" } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">Not configured</h1>
        <p className="mt-4 text-ink/60">
          Set <code>ADMIN_TOKEN</code> in <code>.env</code> to enable this page.
        </p>
      </main>
    );
  }
  if (token !== expected) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">401</h1>
        <p className="mt-4 text-ink/60">
          Append <code>?token=…</code> to the URL.
        </p>
      </main>
    );
  }

  const [callbackOrders, activeOrders, pendingOrders] = await Promise.all([
    prisma.cardOrder.findMany({
      where: { callMeBack: true, contactedAt: null, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.cardOrder.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.cardOrder.findMany({
      where: { status: { in: ["PENDING_PAYMENT", "PAID"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const tabs = [
    { key: "callback", label: `Call-me-back (${callbackOrders.length})` },
    { key: "active", label: `Active (${activeOrders.length})` },
    { key: "pending", label: `Pending (${pendingOrders.length})` },
  ] as const;

  const active = tabs.find((t) => t.key === tab) ?? tabs[0];
  const rows =
    active.key === "callback"
      ? callbackOrders
      : active.key === "active"
      ? activeOrders
      : pendingOrders;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-display-sm text-ink">Orders</h1>
        <p className="mt-2 text-body text-ink/60">
          Self-serve DBC orders. Keep the URL private.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <a
              key={t.key}
              href={`/admin/orders?token=${encodeURIComponent(token)}&tab=${t.key}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                t.key === active.key
                  ? "bg-ink text-white"
                  : "border border-neutral-200 bg-white text-ink hover:bg-neutral-100"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>

        <AdminOrdersTable
          rows={rows.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            slug: o.slug,
            templateId: o.templateId,
            contactName: o.contactName,
            contactEmail: o.contactEmail,
            contactPhone: o.contactPhone,
            callMeBack: o.callMeBack,
            amountLabel: `${formatEuro(o.amountCents)} · ${o.billingMode}`,
            status: o.status,
            contactedAt: o.contactedAt ? o.contactedAt.toISOString() : null,
            createdAt: o.createdAt.toISOString(),
          }))}
          token={token}
          tab={active.key}
        />
      </div>
    </main>
  );
}
