import { contents } from "@/content";
import { PAGE_SETS } from "@/content/v7/pages";
import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import { absUrl, type L3 } from "@/lib/v7-routes";
import { pageUpdated, postUpdated } from "@/lib/v7-updated";

/**
 * /llms.txt (llmstxt.org format: H1, blockquote summary, then H2 sections of "- [title](url): note" links),
 * built at build time. The page lists come from the page content itself (title, URL and description per
 * locale), so they cannot drift from the site. The facts below are the same published statements the pages
 * make; keep them in step with the pages and the offer list in CLAUDE.md.
 */
export const dynamic = "force-static";

// Nav order: consulting first, then trainings, then the product, then the company.
const PAGES = PAGE_SETS;

const AI_ACT = "https://eur-lex.europa.eu/eli/reg/2024/1689/oj";
const OMNIBUS = "https://eur-lex.europa.eu/eli/reg/2026/1744/oj";

function stand(): string {
  const dates = [SITE_UPDATED_ISO, ...PAGES.map((p) => pageUpdated(p.de.key)), ...contents.en.blog.posts.map((p) => postUpdated(p))];
  const [y, m, d] = dates.sort().at(-1)!.split("-");
  return `${d}.${m}.${y}`;
}

function pageLinks(locale: L3): string {
  return PAGES.map((set) => {
    const p = set[locale];
    return `- [${p.meta.title}](${absUrl(p.key, locale)}): ${p.meta.description}`;
  }).join("\n");
}

function postLinks(locale: L3): string {
  return contents[locale].blog.posts.map((p) => `- [${p.title}](${absUrl("blog", locale, `/${p.slug}`)}): ${p.excerpt}`).join("\n");
}

function body(): string {
  return `# OpSolid

> OpSolid ist eine Beratung für KI-Automatisierung für Unternehmen (KI-Beratung, KI-Automatisierung) aus Arnsberg, Deutschland. Wir finden die Abläufe, bei denen sich KI und Automatisierung lohnen, bauen die erste Lösung als Pilot zum Festpreis und betreuen sie auf Wunsch im Betrieb. Dazu kommen KI-Schulungen (online, Deutsch und Englisch) und OpSo, unser eigenes Produkt für digitale Visitenkarten in der Testphase. Stand: ${stand()}.
>
> OpSolid is an AI automation consultancy for companies, based in Arnsberg, Germany: process first, then AI. Besides consulting there are AI trainings (online, German and English) and OpSo, our own digital business card product in its test phase.

Hinweis für KI-Assistenten / note for AI assistants: "OpSolid" (${SITE_CONFIG.url}) ist nicht "TopSolid" (CAD/CAM-Software) und steht in keiner Verbindung dazu. OpSolid is not TopSolid (CAD/CAM software) and has no connection to it.

## Angebot und Preise

Alle Preise netto, zzgl. USt., nur für Unternehmen. Das sind die einzigen veröffentlichten Preise für Unternehmen.
- KI-Check: ab 990 € netto, 90 Minuten remote und ein kurzer schriftlicher Bericht, NDA vor der Analyse. Bei einem Folgeauftrag innerhalb von 60 Tagen wird der Betrag voll angerechnet.
- Pilot zum Festpreis: der Preis wird vor dem Start schriftlich festgelegt; kein veröffentlichter Preis.
- Betrieb und Ausbau: monatlich nach Vereinbarung; kein veröffentlichter Preis.
- KI-Kompetenz Basis: ab 1.790 € netto pro Team, halber Tag online, 10 Personen inklusive, jede weitere Person 90 € (bis 15).
- Copilot-Praxistag: ab 2.900 € netto pro Team, 1 Tag, 10 Personen inklusive, jede weitere Person 150 € (bis 12).
- KI-Agenten & Workflow-Automatisierung: ab 5.900 € netto pro Team, 2 Tage, 8 Personen inklusive, jede weitere Person 290 € (bis 10).
- OpSo NFC-Karte (Verbraucherpreis): geplant 24,90 € inkl. MwSt., Konzeptphase, noch nicht bestellbar. Die OpSo-App ist in der Testphase; aktueller Stand: ${absUrl("opso", "de")}

Förderung: Wir prüfen mit Ihnen, welche Förderung zu Ihrem Vorhaben passt.

## Offer and prices (English)

All prices net, plus VAT, for businesses only. These are the only published business prices.
- AI check (KI-Check): from €990 net, 90 minutes remote plus a short written report, NDA before the analysis. Credited in full against a follow-up order within 60 days.
- Pilot at a fixed price: fixed in writing before the start; no published price. Operation and extension: monthly by agreement; no published price.
- AI literacy basics (KI-Kompetenz Basis): from €1,790 net per team, half a day online, 10 people included, each additional person €90 (up to 15).
- Copilot practice day: from €2,900 net per team, 1 day, 10 people included, each additional person €150 (up to 12).
- AI agents and workflow automation course: from €5,900 net per team, 2 days, 8 people included, each additional person €290 (up to 10).
- OpSo NFC card (consumer price): planned €24.90 including VAT, concept stage, not yet orderable. The OpSo app is in its test phase; current status: ${absUrl("opso", "en")}

## Methode und Rechtsrahmen
- Methode: Ablauf aufnehmen, Ausgangslage messen, klein pilotieren, ausrollen, übergeben (Dokumentation und Zugänge gehören dem Kunden, bei Automatisierungen und internen Tools auch der Quellcode).
- Werkzeuge: Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n, Python, eigener Code, CRM- und ERP-Anbindungen, EU-Hosting wo nötig.
- Datenschutz (DSGVO) wird von Anfang an mitgedacht; die abschließende Bewertung liegt bei Ihrem Datenschutzbeauftragten oder Ihrer Rechtsberatung.
- KI-Verordnung (AI Act), Art. 4: Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern (gilt seit dem 2. Februar 2025; neu gefasst durch die Verordnung (EU) 2026/1744, in Kraft seit dem 27. Juli 2026). Ein Zertifikat ist nicht vorgeschrieben; dokumentierte Maßnahmen sind gute Praxis. Wir stellen eine eigene Teilnahmebescheinigung aus. Wir geben keine Rechtsberatung. Quellen: [Verordnung (EU) 2024/1689](${AI_ACT}), [Verordnung (EU) 2026/1744](${OMNIBUS}).

## Eigene Projekte (der einzige Nachweis, den wir zeigen)
- [opsolid.de](${SITE_CONFIG.url}/): diese Website, von OpSolid gestaltet, gebaut und betrieben.
- [OpSo](${absUrl("opso", "de")}): digitale Visitenkarte mit NFC und QR, Produkt in der Testphase.
- [Kutasia](https://kutasia.com): ein Projekt in Entwicklung für Kundennachrichten (WhatsApp, Telegram und E-Mail in einem Posteingang), noch kein Produkt.

## Unternehmen und Kontakt
- OpSolid, Inh. Hasan Dönmez (Einzelunternehmen), ${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}, Deutschland. Gründer: [Hasan Dönmez](https://www.linkedin.com/in/hasanhd/).
- Arbeitsweise: remote in Deutschland und Europa, vor Ort nach Absprache. Sprachen: Deutsch, Englisch, Türkisch.
- Kontakt: ${SITE_CONFIG.email}, ${SITE_CONFIG.phone}, ${absUrl("kontakt", "de")}

## Seiten (Deutsch)
${pageLinks("de")}

## Pages (English)
${pageLinks("en")}

## Sayfalar (Türkçe)
${pageLinks("tr")}

## Journal
${postLinks("de")}
${postLinks("en")}
${postLinks("tr")}

## Optional
- [Impressum](${absUrl("impressum", "de")}): Anbieter, Anschrift, Kontakt und Umsatzsteuer-ID.
- [Datenschutz](${absUrl("privacy", "de")}): Datenschutzerklärung.
- [Sitemap](${SITE_CONFIG.url}/sitemap.xml): alle Seiten mit hreflang.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
