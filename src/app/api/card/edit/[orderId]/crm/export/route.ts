// GET /api/card/edit/[orderId]/crm/export?t=<editToken>
// Returns a CSV file with all leads and connections for the card owner.
// Auth: editToken via requireEditToken.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

/** Wrap a CSV field in double-quotes and escape internal double-quotes as "". */
function csvField(value: string | null | undefined): string {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function csvRow(fields: (string | null | undefined)[]): string {
  return fields.map(csvField).join(",");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const [leads, connections] = await Promise.all([
      prisma.cardLead.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          company: true,
          meetingContext: true,
          interest: true,
          message: true,
          ownerNotes: true,
          tags: true,
          status: true,
          priority: true,
          lastContactedAt: true,
          createdAt: true,
        },
      }),
      prisma.cardConnection.findMany({
        where: { ownerCardId: order.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          source: true,
          eventName: true,
          note: true,
          tags: true,
          status: true,
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

    const dateStr = new Date().toISOString().slice(0, 10);
    const slug = order.slug ?? order.id;
    const filename = `opsolid-crm-${slug}-${dateStr}.csv`;

    const headers = [
      "Type",
      "Name",
      "Email",
      "Phone",
      "Company",
      "MeetingContext",
      "Interest",
      "Message",
      "OwnerNotes",
      "Tags",
      "Status",
      "Priority",
      "Source",
      "CreatedAt",
      "LastContactedAt",
      "EventName",
    ];

    const rows: string[] = [headers.map(csvField).join(",")];

    for (const lead of leads) {
      rows.push(
        csvRow([
          "Lead",
          lead.name,
          lead.email ?? null,
          lead.phone ?? null,
          lead.company ?? null,
          lead.meetingContext ?? null,
          lead.interest ?? null,
          lead.message ?? null,
          lead.ownerNotes ?? null,
          lead.tags.join("; "),
          lead.status,
          String(lead.priority),
          null, // source — not stored on leads
          lead.createdAt.toISOString(),
          lead.lastContactedAt ? lead.lastContactedAt.toISOString() : null,
          null, // eventName — not applicable to leads
        ])
      );
    }

    for (const conn of connections) {
      const cardData = conn.visitorCard.cardData as {
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
      } | null;

      rows.push(
        csvRow([
          "Connection",
          cardData?.name ?? conn.visitorCard.slug,
          cardData?.email ?? null,
          cardData?.phone ?? null,
          cardData?.company ?? null,
          null, // meetingContext — not available for connections
          null, // interest — not available for connections
          conn.note ?? null,
          null, // ownerNotes — not available for connections
          conn.tags.join("; "),
          conn.status,
          String(conn.priority),
          conn.source ?? null,
          conn.createdAt.toISOString(),
          conn.lastContactedAt ? conn.lastContactedAt.toISOString() : null,
          conn.eventName ?? null,
        ])
      );
    }

    const csv = rows.join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[crm/export GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
