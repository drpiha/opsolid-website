// =============================================================================
// Public fair / event participant directory
//   /:locale/events/:slug
//
// The web twin of GET /api/v1/events/[slug] (the mobile roster endpoint).
// Lists the event header + every attendee card that is PUBLISHED and marked
// visibility="public" — attendees who chose "unlisted" or "private" are
// never shown here, matching the promise in the order-form opt-in.
//
// The page doubles as the fair growth loop: a prominent "create your card"
// CTA deep-links to the order page with ?event=<slug> so new participants
// land in this same directory.
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { EventDirectoryPage, type DirectoryAttendee } from "./EventDirectoryPage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{3,80}$/;
// Same grace as the API: keep the roster reachable for a day after the fair
// ends (people follow up the morning after), then 404.
const PAST_GRACE_MS = 24 * 60 * 60 * 1000;

interface PageProps {
  params: { locale: string; slug: string };
}

async function loadEvent(slug: string) {
  if (!SLUG_RE.test(slug)) return null;
  const event = await prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      country: true,
      venue: true,
      startAt: true,
      endAt: true,
      description: true,
      isActive: true,
      attendees: {
        select: {
          card: {
            select: {
              slug: true,
              status: true,
              visibility: true,
              cardData: true,
              photoPath: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  });
  if (!event || !event.isActive) return null;
  if (event.endAt < new Date(Date.now() - PAST_GRACE_MS)) return null;
  return event;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const event = await loadEvent(params.slug);
  if (!event) return { title: "OpSolid · Events", robots: { index: false } };
  const title = `${event.name} — ${event.city}`;
  return {
    title,
    description: event.description ?? undefined,
    openGraph: { title, description: event.description ?? undefined },
  };
}

export default async function Page({ params }: PageProps) {
  const event = await loadEvent(params.slug);
  if (!event) notFound();

  const attendees: DirectoryAttendee[] = event.attendees
    .map((a) => a.card)
    .filter(
      (c) =>
        c.status === OrderStatus.PUBLISHED &&
        c.visibility === "public" &&
        c.slug,
    )
    .map((c) => {
      const cd = (c.cardData ?? {}) as {
        name?: string;
        title?: string;
        company?: string;
      };
      return {
        slug: c.slug as string,
        name: typeof cd.name === "string" ? cd.name : "",
        title: typeof cd.title === "string" ? cd.title : null,
        company: typeof cd.company === "string" ? cd.company : null,
        photoPath: c.photoPath,
      };
    })
    .filter((c) => c.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <EventDirectoryPage
      event={{
        slug: event.slug,
        name: event.name,
        city: event.city,
        country: event.country,
        venue: event.venue,
        startAt: event.startAt.toISOString(),
        endAt: event.endAt.toISOString(),
        description: event.description,
      }}
      attendees={attendees}
    />
  );
}
