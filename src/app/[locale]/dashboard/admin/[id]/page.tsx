// =============================================================================
// /dashboard/admin/[id] — READ-ONLY leads for a single card.
//
// SECURITY: re-runs the same role gate as the admin index. notFound() (404) for
// any non-ADMIN so a non-admin can never reach another user's leads, and never
// learns the route exists. The card id is a server-side lookup; we 404 on a
// missing card too.
//
// CardLead's foreign key is `orderId` (NOT `cardId`) — the public schema names
// the card row `CardOrder`. There is no `consent` column on CardLead; we show
// the fields that actually exist (name/email/phone/message/interest/
// meetingContext/company/status/priority/createdAt).
//
// Admin-only — inline English strings (do not touch src/content/*).
// =============================================================================

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionUser, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { LocaleLink } from "@/components/shared/LocaleLink";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Card Leads · OpSolid",
  robots: { index: false, follow: false },
};

interface Props {
  params: { locale: string; id: string };
}

function formatDate(d: Date): string {
  try {
    return d.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

const PRIORITY_LABEL: Record<number, string> = {
  0: "normal",
  1: "high",
  2: "urgent",
};

export default async function DashboardAdminLeadsPage({ params }: Props) {
  const { id } = params;

  // --- Role gate (defence-in-depth; same as the index) ----------------------
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
  const user = refreshToken ? await getSessionUser(refreshToken) : null;
  if (!user || user.role !== "ADMIN") {
    notFound();
  }

  // --- Card context + its leads ---------------------------------------------
  const card = await prisma.cardOrder.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      contactName: true,
      contactEmail: true,
      status: true,
    },
  });
  if (!card) {
    notFound();
  }

  const leads = await prisma.cardLead.findMany({
    where: { orderId: id },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      interest: true,
      meetingContext: true,
      company: true,
      status: true,
      priority: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <LocaleLink
          href="/dashboard/admin"
          className="text-xs text-copper-600 hover:text-copper-700"
        >
          ← All cards
        </LocaleLink>
        <h1 className="mt-2 font-display text-2xl font-medium text-ink">
          Leads · {card.contactName || "Untitled card"}
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          {card.contactEmail}
          {card.slug ? (
            <>
              {" · "}
              <a
                href={`/c/${card.slug}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-copper-600 underline underline-offset-2 hover:text-copper-700"
              >
                /c/{card.slug}
              </a>
            </>
          ) : null}
          {" · "}
          {leads.length} lead{leads.length === 1 ? "" : "s"}
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-line bg-bg-1 px-6 py-16 text-center">
          <p className="text-sm text-ink-400">No leads captured for this card.</p>
        </div>
      ) : (
        <div
          role="region"
          aria-label="Card leads table"
          tabIndex={0}
          className="overflow-x-auto rounded-2xl border border-line bg-bg-1"
        >
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Phone
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Company
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Interest / Context
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Message
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-ink-400" scope="col">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-line-soft align-top"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {lead.name || "—"}
                  </td>
                  <td className="break-all px-4 py-3 text-ink-200">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-copper-600 underline underline-offset-2 hover:text-copper-700"
                      >
                        {lead.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-200">
                    {lead.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-200">{lead.company || "—"}</td>
                  <td className="px-4 py-3 text-ink-200">
                    {lead.interest || "—"}
                    {lead.meetingContext ? (
                      <span className="block text-[11px] text-ink-400">
                        {lead.meetingContext}
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-[280px] px-4 py-3 text-ink-200">
                    <span className="block whitespace-pre-wrap break-words">
                      {lead.message || "—"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-300">
                    {lead.status}
                    {lead.priority > 0 ? (
                      <span className="block text-[11px] text-signal-warn">
                        {PRIORITY_LABEL[lead.priority] ?? `p${lead.priority}`}
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-300">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
