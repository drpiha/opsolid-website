// =============================================================================
// GET /api/v1/cards/[id]/export — Pro-only HTML export.
//
// Returns a self-contained `text/html` document (single file, all CSS inlined,
// no external scripts, no JS). The owner can save the file from their
// browser / share sheet and host it anywhere — gives Pro users an "exit
// story" without locking them in.
//
// Auth: bearer-only. Authorization: card.userId === user.id. Pro-gated:
// 402 `pro_required` for free users.
//
// We deliberately render a hand-tuned HTML rather than an SSR snapshot of
// the React tree — the React app uses dynamic theme tokens, fonts loaded
// from /api/fonts, and other deps that don't survive a static export. The
// minimal hand-tuned page captures everything a "card v-card" needs and
// renders identically offline.
//
// Returns the HTML directly (text/html) with a `Content-Disposition:
// attachment` so the browser triggers a download. Mobile callers who can
// open the URL in the in-app browser get a "Save / Share" sheet via the
// browser's native UI.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { isPro } from "@/lib/auth/pro";
import { CardDataSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(s: string): string | null {
  try {
    const u = new URL(s);
    if (u.protocol === "http:" || u.protocol === "https:" || u.protocol === "mailto:" || u.protocol === "tel:") {
      return u.toString();
    }
    return null;
  } catch {
    return null;
  }
}

interface RenderInput {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  socials?: Record<string, string>;
  services?: Array<{ title: string; priceLabel?: string; description?: string }>;
  customButtons?: Array<{ label: string; href?: string }>;
  primaryHex: string;
  accentHex: string;
}

function renderHtml(card: RenderInput, slug: string): string {
  const primary = card.primaryHex || "#1AA6B7";
  const accent = card.accentHex || "#C27940";
  const name = escapeHtml(card.name);
  const title = card.title ? escapeHtml(card.title) : "";
  const company = card.company ? escapeHtml(card.company) : "";
  const bio = card.bio ? escapeHtml(card.bio) : "";

  const contactRow = (label: string, value: string, href?: string) => {
    const v = escapeHtml(value);
    if (href) {
      const safe = safeUrl(href);
      if (!safe) return "";
      return `<li><span class="lbl">${label}</span><a href="${safe}">${v}</a></li>`;
    }
    return `<li><span class="lbl">${label}</span>${v}</li>`;
  };

  const contacts: string[] = [];
  if (card.email) contacts.push(contactRow("Email", card.email, `mailto:${card.email}`));
  if (card.phone) contacts.push(contactRow("Phone", card.phone, `tel:${card.phone.replace(/[^0-9+]/g, "")}`));
  if (card.whatsapp) {
    const wa = card.whatsapp.replace(/[^0-9]/g, "");
    contacts.push(contactRow("WhatsApp", card.whatsapp, `https://wa.me/${wa}`));
  }
  if (card.website) contacts.push(contactRow("Website", card.website, card.website));
  if (card.address) contacts.push(contactRow("Address", card.address));

  const socials: string[] = [];
  if (card.socials) {
    for (const [platform, val] of Object.entries(card.socials)) {
      if (typeof val !== "string" || !val.trim()) continue;
      const url = safeUrl(val) ?? safeUrl(`https://${val}`);
      if (!url) continue;
      socials.push(
        `<a class="social" href="${url}">${escapeHtml(platform)}</a>`,
      );
    }
  }

  const services = (card.services ?? [])
    .map(
      (s) =>
        `<li><div class="svc-title">${escapeHtml(s.title)}${
          s.priceLabel ? ` <span class="svc-price">${escapeHtml(s.priceLabel)}</span>` : ""
        }</div>${s.description ? `<div class="svc-desc">${escapeHtml(s.description)}</div>` : ""}</li>`,
    )
    .join("");

  const buttons = (card.customButtons ?? [])
    .map((b) => {
      if (!b.href) return "";
      const safe = safeUrl(b.href);
      if (!safe) return "";
      return `<a class="btn" href="${safe}">${escapeHtml(b.label)}</a>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${name}${company ? ` · ${company}` : ""}</title>
<meta name="description" content="${name}${title ? ` — ${title}` : ""}${company ? ` at ${company}` : ""}" />
<style>
  :root {
    --primary: ${primary};
    --accent: ${accent};
    --bg: #faf7f1;
    --ink: #1a1a1a;
    --muted: #6b6b6b;
    --line: #e5e1d8;
    --card: #ffffff;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    min-height: 100vh;
    padding: 32px 16px 64px;
  }
  .card {
    max-width: 420px;
    margin: 0 auto;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .header {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--line);
    background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 8%, white) 0%, white 100%);
  }
  .name { font-size: 28px; font-weight: 600; margin: 0 0 4px; letter-spacing: -0.01em; }
  .title { color: var(--muted); font-size: 15px; margin: 0; }
  .company { color: var(--accent); font-size: 14px; margin: 6px 0 0; font-weight: 500; }
  .bio { padding: 16px 24px 0; color: #444; font-size: 14px; }
  .section { padding: 18px 24px; border-top: 1px solid var(--line); }
  .section h3 { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px; }
  ul.contacts { list-style: none; padding: 0; margin: 0; }
  ul.contacts li { padding: 8px 0; border-bottom: 1px solid var(--line); display: flex; align-items: baseline; }
  ul.contacts li:last-child { border-bottom: none; }
  .lbl { width: 84px; flex-shrink: 0; color: var(--muted); font-size: 13px; }
  ul.contacts a { color: var(--primary); text-decoration: none; word-break: break-word; }
  ul.contacts a:hover { text-decoration: underline; }
  .socials { display: flex; flex-wrap: wrap; gap: 8px; }
  a.social { padding: 6px 12px; background: var(--bg); border: 1px solid var(--line); border-radius: 999px; color: var(--ink); text-decoration: none; font-size: 13px; }
  a.social:hover { border-color: var(--primary); color: var(--primary); }
  ul.services { list-style: none; padding: 0; margin: 0; }
  ul.services li { padding: 12px 0; border-bottom: 1px solid var(--line); }
  ul.services li:last-child { border-bottom: none; }
  .svc-title { font-weight: 500; }
  .svc-price { color: var(--accent); font-size: 13px; margin-left: 8px; }
  .svc-desc { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .buttons { display: flex; flex-direction: column; gap: 8px; }
  a.btn { display: block; padding: 12px 16px; background: var(--primary); color: #fff; text-decoration: none; border-radius: 10px; text-align: center; font-weight: 500; }
  a.btn:hover { filter: brightness(0.95); }
  footer { text-align: center; color: var(--muted); font-size: 11px; margin-top: 24px; }
  footer a { color: inherit; }
</style>
</head>
<body>
  <article class="card">
    <header class="header">
      <h1 class="name">${name}</h1>
      ${title ? `<p class="title">${title}</p>` : ""}
      ${company ? `<p class="company">${company}</p>` : ""}
    </header>
    ${bio ? `<div class="bio"><p>${bio}</p></div>` : ""}
    ${
      contacts.length
        ? `<section class="section"><h3>Contact</h3><ul class="contacts">${contacts.join("")}</ul></section>`
        : ""
    }
    ${
      socials.length
        ? `<section class="section"><h3>Social</h3><div class="socials">${socials.join("")}</div></section>`
        : ""
    }
    ${
      services
        ? `<section class="section"><h3>Services</h3><ul class="services">${services}</ul></section>`
        : ""
    }
    ${
      buttons
        ? `<section class="section"><h3>Links</h3><div class="buttons">${buttons}</div></section>`
        : ""
    }
  </article>
  <footer>
    <p>Verso · <a href="https://opsolid.de/c/${escapeHtml(slug)}">opsolid.de/c/${escapeHtml(slug)}</a></p>
  </footer>
</body>
</html>`;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    if (!isPro(user)) {
      return applyCors(
        errorJson("pro_required", "Pro subscription required.", 402),
        req,
      );
    }

    const limit = rateLimit("cards:export", req, user, RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const card = await prisma.cardOrder.findFirst({
      where: { id: params.id, userId: user.id },
      select: {
        id: true,
        slug: true,
        cardData: true,
        brandPrimaryHex: true,
        brandAccentHex: true,
      },
    });
    if (!card) {
      return applyCors(
        errorJson("card_not_found", "Card not found.", 404),
        req,
      );
    }

    const parsed = CardDataSchema.safeParse(card.cardData);
    if (!parsed.success) {
      return applyCors(
        errorJson("card_invalid", "Card data invalid — cannot export.", 422),
        req,
      );
    }

    const data = parsed.data as Record<string, unknown> & {
      name: string;
      title?: string;
      company?: string;
      bio?: string;
      email?: string;
      phone?: string;
      whatsapp?: string;
      website?: string;
      address?: string;
      socials?: Record<string, string>;
      services?: Array<{ title: string; priceLabel?: string; description?: string }>;
      customButtons?: Array<{ label: string; href?: string }>;
    };

    const html = renderHtml(
      {
        name: data.name,
        title: data.title,
        company: data.company,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        website: data.website,
        address: data.address,
        socials: data.socials,
        services: data.services,
        customButtons: data.customButtons,
        primaryHex: card.brandPrimaryHex ?? "#1AA6B7",
        accentHex: card.brandAccentHex ?? "#C27940",
      },
      card.slug ?? "card",
    );

    const filename = `verso-${(card.slug ?? "card").replace(/[^a-z0-9-]/gi, "-")}.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/:id/export] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
