// =============================================================================
// /api/admin/events — operator CRUD for fair / event directory entries.
//
// GET   — list events (newest startAt first) + attendee counts
// POST  — create an event; slug auto-generated from the name (lowercase,
//         de-accented, deduped with a numeric suffix) unless a manual slug
//         is supplied
// PATCH — toggle isActive (soft on/off; an inactive event 404s publicly)
//
// Auth: same browser ADMIN_TOKEN pattern as /api/admin/cards/* — token in
// ?token=… (browser fetch) or x-admin-token header.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeSlugBase } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const CreateInput = z
  .object({
    name: z.string().trim().min(2).max(160),
    city: z.string().trim().min(1).max(80),
    country: z.string().trim().max(80).optional(),
    venue: z.string().trim().max(160).optional(),
    description: z.string().trim().max(1000).optional(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]{3,80}$/)
      .optional(),
  })
  .strict();

const ToggleInput = z
  .object({
    eventId: z.string().min(1).max(64),
    isActive: z.boolean(),
  })
  .strict();

async function uniqueEventSlug(base: string): Promise<string> {
  const root = normalizeSlugBase(base).slice(0, 70) || "event";
  let candidate = root;
  for (let i = 2; i < 50; i++) {
    const taken = await prisma.event.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

function serialize(e: {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string | null;
  venue: string | null;
  startAt: Date;
  endAt: Date;
  description: string | null;
  isActive: boolean;
}, attendees: number) {
  return {
    id: e.id,
    slug: e.slug,
    name: e.name,
    city: e.city,
    country: e.country,
    venue: e.venue,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt.toISOString(),
    description: e.description,
    isActive: e.isActive,
    attendees,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
    take: 100,
    include: { _count: { select: { attendees: true } } },
  });

  return NextResponse.json({
    events: events.map((e) => serialize(e, e._count.attendees)),
  });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = CreateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", detail: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(parsed.data.endAt);
  if (endAt < startAt) {
    return NextResponse.json({ error: "end_before_start" }, { status: 400 });
  }

  let slug: string;
  if (parsed.data.slug) {
    const taken = await prisma.event.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (taken) {
      return NextResponse.json({ error: "slug_taken" }, { status: 409 });
    }
    slug = parsed.data.slug;
  } else {
    slug = await uniqueEventSlug(parsed.data.name);
  }

  const event = await prisma.event.create({
    data: {
      slug,
      name: parsed.data.name,
      city: parsed.data.city,
      country: parsed.data.country,
      venue: parsed.data.venue,
      description: parsed.data.description,
      startAt,
      endAt,
    },
  });

  return NextResponse.json({ event: serialize(event, 0) });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = ToggleInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const result = await prisma.event.updateMany({
    where: { id: parsed.data.eventId },
    data: { isActive: parsed.data.isActive },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "event_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
