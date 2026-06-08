import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/config/card-templates";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { AdminOrdersTable } from "./AdminOrdersTable";

// Constant-time token compare (avoids the timing side-channel the plain `!==`
// had). Length mismatch short-circuits to false.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

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

  // Primary gate: a logged-in member with role=ADMIN (no token in the URL).
  // Fallback gate: the shared ADMIN_TOKEN (constant-time) for ops convenience.
  const refresh = cookies().get(REFRESH_COOKIE_NAME)?.value;
  const sessionUser = refresh ? await getSessionUser(refresh) : null;
  const isSessionAdmin = sessionUser?.role === "ADMIN";
  const tokenOk = Boolean(expected) && safeEqual(token, expected ?? "");

  if (!isSessionAdmin && !tokenOk) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">Sign in required</h1>
        <p className="mt-4 text-ink/60">
          Sign in with an admin account, or open this page from a valid admin link.
        </p>
        <a href="/login" className="mt-6 inline-block underline underline-offset-4">
          Sign in
        </a>
      </main>
    );
  }

  const [callbackOrders, designOrders, activeOrders, pendingOrders] =
    await Promise.all([
      prisma.cardOrder.findMany({
        where: {
          callMeBack: true,
          contactedAt: null,
          status: { in: ["AWAITING_DESIGN", "PUBLISHED"] },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.cardOrder.findMany({
        where: { status: "AWAITING_DESIGN" },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.cardOrder.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.cardOrder.findMany({
        where: { status: "PENDING_PAYMENT" },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

  const tabs = [
    { key: "callback", label: `Call-me-back (${callbackOrders.length})` },
    { key: "design", label: `In design (${designOrders.length})` },
    { key: "active", label: `Active (${activeOrders.length})` },
    { key: "pending", label: `Pending (${pendingOrders.length})` },
  ] as const;

  const active = tabs.find((t) => t.key === tab) ?? tabs[0];
  const rows =
    active.key === "callback"
      ? callbackOrders
      : active.key === "design"
      ? designOrders
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
