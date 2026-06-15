// =============================================================================
// Owner self-service management page
//   /:locale/card/manage/:orderId?t=:editToken
//
// The owner-facing twin of the admin order detail: 30-day stats, short-link
// management (create / toggle / QR per channel), and the lead inbox. Gated by
// the same per-order edit token as the editor, so it works for account-less
// owners straight from the "your card is live" email.
//
// Server component: verifies the token, aggregates stats with direct Prisma
// queries (no API round-trip), then hands off to CardManageClient for the
// interactive parts (link CRUD + lead status, which call /api/card/manage/*).
// =============================================================================

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { getSiteUrl } from "@/lib/stripe";
import { CardManageClient } from "./CardManageClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_DAYS = 30;

interface PageProps {
  params: { locale: string; orderId: string };
  searchParams: { t?: string };
}

export default async function CardManagePage({
  params,
  searchParams,
}: PageProps) {
  const { orderId } = params;
  const token = searchParams.t ?? "";
  const locale = (["en", "de", "tr"].includes(params.locale)
    ? params.locale
    : "en") as "en" | "de" | "tr";

  let order;
  try {
    order = await requireEditToken(token, orderId);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return <ManageRejectedView reason={err.code} locale={locale} />;
    }
    throw err;
  }

  const isPublished = order.status === OrderStatus.PUBLISHED && !!order.slug;
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [views, leadsCount, saves, shares, scans, links, leads] =
    await Promise.all([
      prisma.cardView.count({
        where: { orderId: order.id, createdAt: { gte: cutoff } },
      }),
      prisma.cardLead.count({ where: { orderId: order.id } }),
      prisma.savedCard.count({
        where: { cardOrderId: order.id, createdAt: { gte: cutoff } },
      }),
      prisma.shareEvent.count({
        where: { sourceCardId: order.id, createdAt: { gte: cutoff } },
      }),
      prisma.scanEvent.count({
        where: { orderId: order.id, createdAt: { gte: cutoff } },
      }),
      prisma.cardLink.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { scanEvents: true } } },
      }),
      prisma.cardLead.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          company: true,
          message: true,
          interest: true,
          meetingContext: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const publicUrl = order.slug
    ? `${getSiteUrl().replace(/\/$/, "")}/c/${order.slug}`
    : null;

  return (
    <CardManageClient
      orderId={order.id}
      editToken={token}
      slug={order.slug}
      isPublished={isPublished}
      publicUrl={publicUrl}
      shortHost={process.env.NEXT_PUBLIC_SHORT_HOST?.trim() || "go.opsolid.de"}
      editHref={`/${locale}/card/edit/${order.id}?t=${token}`}
      cardHref={
        order.slug ? `/c/${order.slug}?owner=${order.editToken ?? ""}` : null
      }
      windowDays={WINDOW_DAYS}
      stats={{ views, leads: leadsCount, saves, shares, scans }}
      initialLinks={links.map((l) => ({
        id: l.id,
        code: l.code,
        label: l.label,
        source: l.source,
        campaign: l.campaign,
        medium: l.medium,
        eventName: l.eventName,
        active: l.active,
        scans: l._count.scanEvents,
        createdAt: l.createdAt.toISOString(),
      }))}
      initialLeads={leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
      }))}
    />
  );
}

// -----------------------------------------------------------------------------
// Rejection view — mirrors the edit page's terminal state, minus the resend
// machinery (the manage link always travels next to the edit link in email,
// so "recover via the edit page" is the one instruction that always works).
// -----------------------------------------------------------------------------
function ManageRejectedView({
  reason,
  locale,
}: {
  reason: "missing_token" | "not_found" | "bad_token";
  locale: "en" | "de" | "tr";
}) {
  const copy: Record<string, { title: string; body: string }> = {
    en: {
      title: "This management link is not valid",
      body: "The link is incomplete, expired, or the card does not exist. Open the link from your OpSolid card email, or use the edit link to recover access.",
    },
    de: {
      title: "Dieser Verwaltungslink ist ungültig",
      body: "Der Link ist unvollständig, abgelaufen oder die Karte existiert nicht. Öffnen Sie den Link aus Ihrer OpSolid-Karten-E-Mail oder nutzen Sie den Bearbeitungslink, um den Zugang wiederherzustellen.",
    },
    tr: {
      title: "Bu yönetim bağlantısı geçersiz",
      body: "Bağlantı eksik, süresi dolmuş veya kart bulunamadı. OpSolid kart e-postanızdaki bağlantıyı açın veya erişimi kurtarmak için düzenleme bağlantısını kullanın.",
    },
  };
  void reason;
  const c = copy[locale] ?? copy.en;

  return (
    <main className="editor-light min-h-screen bg-neutral-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-eyebrow uppercase tracking-wider text-ink-300">
          OpSolid · Digital Card
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink">{c.title}</h1>
        <p className="mt-4 text-body text-ink-200">{c.body}</p>
        <p className="mt-6 text-sm text-ink-300">
          <Link href={`/${locale}/contact`} className="underline underline-offset-4">
            Contact
          </Link>
        </p>
      </div>
    </main>
  );
}
