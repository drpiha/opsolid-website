// GET /api/card/edit/[orderId]/crm?t=<editToken>
// Returns leads and card-to-card connections for the card owner's CRM panel.
// Gated by the same edit token as the PATCH endpoint.
//
// Query params:
//   ?search=<text>    — search in lead name/email/company/message/ownerNotes
//   ?status=<status>  — filter leads by status
//   ?tag=<tag>        — filter by tag (exact match in tags array)
//   ?limit=<n>        — pagination limit (default 50, max 200)
//   ?offset=<n>       — pagination offset (default 0)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || undefined;
    const statusFilter = url.searchParams.get("status")?.trim() || undefined;
    const tagFilter = url.searchParams.get("tag")?.trim() || undefined;
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "", 10);
    const offsetRaw = parseInt(url.searchParams.get("offset") ?? "", 10);
    const limit = isNaN(limitRaw) ? DEFAULT_LIMIT : Math.min(Math.max(1, limitRaw), MAX_LIMIT);
    const offset = isNaN(offsetRaw) ? 0 : Math.max(0, offsetRaw);

    const searchFilter = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
            { message: { contains: search, mode: "insensitive" as const } },
            { ownerNotes: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const leadWhere = {
      orderId: order.id,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(tagFilter ? { tags: { has: tagFilter } } : {}),
      ...searchFilter,
    };

    const [leads, connections] = await Promise.all([
      prisma.cardLead.findMany({
        where: leadWhere,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          interest: true,
          meetingContext: true,
          company: true,
          ownerNotes: true,
          tags: true,
          status: true,
          priority: true,
          lastContactedAt: true,
          createdAt: true,
        },
      }),
      prisma.cardConnection.findMany({
        where: {
          ownerCardId: order.id,
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(tagFilter ? { tags: { has: tagFilter } } : {}),
        },
        orderBy: { createdAt: "desc" },
        // Fetch without JS-level limit so search can filter first, then we slice.
        // When no search is active, we still apply limit+offset here for efficiency.
        ...(search ? {} : { skip: offset, take: limit }),
        select: {
          id: true,
          source: true,
          eventName: true,
          note: true,
          status: true,
          tags: true,
          priority: true,
          lastContactedAt: true,
          createdAt: true,
          visitorCard: {
            select: {
              slug: true,
              cardData: true,
            },
          },
        },
      }),
    ]);

    const connectionsRaw = connections.map((c) => {
      const data = c.visitorCard.cardData as { name?: string; email?: string; phone?: string; company?: string } | null;
      return {
        id: c.id,
        visitorSlug: c.visitorCard.slug,
        visitorName: data?.name ?? c.visitorCard.slug,
        visitorEmail: data?.email ?? null,
        visitorPhone: data?.phone ?? null,
        _visitorCompany: data?.company ?? null, // search-only, stripped before output
        source: c.source,
        eventName: c.eventName,
        note: c.note,
        status: c.status,
        tags: c.tags,
        priority: c.priority,
        lastContactedAt: c.lastContactedAt,
        createdAt: c.createdAt,
      };
    });

    // Apply JS-level search filter for connections (cardData JSON fields).
    const filtered = search
      ? (() => {
          const q = search.toLowerCase();
          return connectionsRaw
            .filter((c) =>
              (c.visitorName ?? "").toLowerCase().includes(q) ||
              (c.visitorEmail ?? "").toLowerCase().includes(q) ||
              (c._visitorCompany ?? "").toLowerCase().includes(q) ||
              (c.note ?? "").toLowerCase().includes(q)
            )
            .slice(offset, offset + limit);
        })()
      : connectionsRaw;

    // Strip the internal search helper before sending to client.
    const connectionsOut = filtered.map(({ _visitorCompany: _unused, ...rest }) => rest);

    return NextResponse.json({ leads, connections: connectionsOut });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/crm GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
