// =============================================================================
// EMAIL SHELL — shared HTML wrapper + text-footer used by all customer emails.
// Plain-table layout, inline styles only, max-width 600px, single column.
// OpSolid editorial palette:
//   #15120F ink  |  #F4EFE6 paper  |  #E8A252 amber  |  #9CA3A0 steel
//
// Locale split (intentional, post-M6):
//   - `Locale` (7 entries) is the *auth* + *brand* locale set used by the
//     magic-link / welcome / password-reset templates. RTL is honoured for
//     the `ar` member.
//   - `TransactionalLocale` (3 entries) is the narrower set still used by
//     the order-scoped emails (cancellation, confirmation, lead-notification,
//     card-live, revision-ready, album-photo-pending). Those templates have
//     deeply localised copy (currencies, formal address forms, dates) that
//     is out of scope for the M6-followup translation pass; widening them
//     would require a separate copywriter sprint.
//
//   The shell renderers accept the wider `Locale` so auth emails work in all
//   seven; non-auth callers hand off `TransactionalLocale` which up-casts.
// =============================================================================

export type Locale = "en" | "de" | "tr" | "es" | "it" | "fr" | "ar";

/**
 * Narrow subset for transactional / order-scoped emails that haven't been
 * translated to the four new locales yet. Order-flow routes use this via
 * `normalizeLocale()` so they always pick a copy table that exists.
 */
export type TransactionalLocale = "en" | "de" | "tr";

const SUPPORTED: readonly Locale[] = [
  "en",
  "de",
  "tr",
  "es",
  "it",
  "fr",
  "ar",
] as const;

const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

/**
 * Narrow normaliser for the order-flow emails (cancellation, lead, etc).
 * Anything outside `en|de|tr` falls back to `en` because those templates
 * don't have copy for the wider set.
 */
export function normalizeLocale(value?: string | null): TransactionalLocale {
  if (value === "de" || value === "tr" || value === "en") return value;
  return "en";
}

/**
 * Wide picker for the auth-shell locale. Accepts BCP-47 tags like `de-AT`
 * or `pt-BR` — only the primary subtag matters. Anything outside the
 * 7-locale matrix falls back to `en`.
 */
export function pickLocale(input?: string | null): Locale {
  if (!input) return "en";
  const lc = String(input).toLowerCase().split("-")[0];
  return (SUPPORTED as readonly string[]).includes(lc) ? (lc as Locale) : "en";
}

export function isRtlLocale(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

const COLORS = {
  ink: "#15120F",
  paper: "#F4EFE6",
  paperWarm: "#FAF6EF",
  amber: "#E8A252",
  steel: "#9CA3A0",
  rule: "#D8CFBE",
} as const;

export interface ShellInput {
  preheader: string;
  headline: string;
  bodyInnerHtml: string;
  locale: Locale;
}

function footerCopy(locale: Locale): { line1: string; line2: string } {
  if (locale === "de") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "Abmelden: Antwort mit STOP.",
    };
  }
  if (locale === "tr") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "Abonelikten çıkmak için STOP yazarak yanıtlayın.",
    };
  }
  if (locale === "es") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "Para darse de baja, responda con STOP.",
    };
  }
  if (locale === "it") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "Per annullare l'iscrizione, rispondi con STOP.",
    };
  }
  if (locale === "fr") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "Pour vous désabonner, répondez par STOP.",
    };
  }
  if (locale === "ar") {
    return {
      line1: "OpSolid · opsolid.de",
      line2: "لإلغاء الاشتراك، الرجاء الرد بكلمة STOP.",
    };
  }
  return {
    line1: "OpSolid · opsolid.de",
    line2: "Unsubscribe by replying STOP.",
  };
}

export function renderShellHtml(input: ShellInput): string {
  const { preheader, headline, bodyInnerHtml, locale } = input;
  const footer = footerCopy(locale);
  const rtl = isRtlLocale(locale);
  // RTL: set dir="rtl" on the root + flip body alignment to right. CTA
  // buttons are wrapped in their own role=presentation tables that don't
  // depend on text-align, so they stay visually centered for both directions.
  const dirAttr = rtl ? ' dir="rtl"' : "";
  const bodyDirStyle = rtl
    ? "direction:rtl;text-align:right;"
    : "direction:ltr;text-align:left;";
  return `<!doctype html>
<html lang="${locale}"${dirAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.paperWarm};font-family:Georgia,'Times New Roman',serif;color:${COLORS.ink};${bodyDirStyle}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.paperWarm};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${COLORS.paper};border:1px solid ${COLORS.rule};">
        <tr>
          <td style="padding:28px 32px 16px 32px;border-bottom:1px solid ${COLORS.rule};${bodyDirStyle}">
            <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.steel};">OpSolid</div>
            <h1 style="margin:8px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:${COLORS.ink};font-weight:normal;">${escapeHtml(headline)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.55;color:${COLORS.ink};${bodyDirStyle}">
            ${bodyInnerHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px 32px;border-top:1px solid ${COLORS.rule};font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.08em;color:${COLORS.steel};${bodyDirStyle}">
            <div>${escapeHtml(footer.line1)}</div>
            <div style="margin-top:4px;">${escapeHtml(footer.line2)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function renderShellText(args: {
  headline: string;
  body: string;
  locale: Locale;
}): string {
  const footer = footerCopy(args.locale);
  return [
    args.headline,
    "".padEnd(args.headline.length, "="),
    "",
    args.body.trim(),
    "",
    "--",
    footer.line1,
    footer.line2,
  ].join("\n");
}

export function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
    <tr>
      <td style="background:${COLORS.amber};border:1px solid ${COLORS.ink};">
        <a href="${escapeAttr(href)}" style="display:inline-block;padding:12px 20px;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.ink};text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px 0;">${html}</p>`;
}

export function inlineLink(href: string, label: string): string {
  return `<a href="${escapeAttr(href)}" style="color:${COLORS.ink};text-decoration:underline;">${escapeHtml(label)}</a>`;
}

export function detailsTable(rows: Array<{ label: string; value: string }>): string {
  const tds = rows
    .map(
      (r) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.rule};width:40%;font-family:'Courier New',monospace;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.steel};">${escapeHtml(r.label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid ${COLORS.rule};color:${COLORS.ink};">${escapeHtml(r.value)}</td>
    </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;border-top:1px solid ${COLORS.rule};">${tds}</table>`;
}

export function qrImg(dataUrl: string, alt: string): string {
  return `<div style="margin:20px 0;text-align:center;">
    <img src="${escapeAttr(dataUrl)}" alt="${escapeAttr(alt)}" width="220" height="220" style="display:block;margin:0 auto;border:1px solid ${COLORS.rule};background:#fff;" />
  </div>`;
}

export function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://opsolid.de"
  );
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(s: string): string {
  return escapeHtml(s);
}
