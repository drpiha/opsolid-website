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

// Nav order: trainings first, then consulting, then the product, then the company.
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

> OpSolid organisiert KI-Schulungen für Teams in Unternehmen (online, live im Microsoft Teams des Kunden, auf Deutsch oder Englisch, gebucht pro Team) und berät Unternehmen bei KI-Automatisierung (KI-Beratung), aus Arnsberg, Deutschland. Die Schulungen verkauft und verantwortet OpSolid im eigenen Namen; gehalten werden sie von freiberuflichen Trainerinnen und Trainern, die OpSolid auswählt und dem Kunden vor der Buchung namentlich nennt. Der bezahlte Einstieg ist der schriftliche KI-Check: Er zeigt, wo KI im Alltag sinnvoll ist, und endet mit einer Schulungsempfehlung ("Erst analysieren, dann schulen"). Dazu OpSo, unser eigenes Produkt für digitale Visitenkarten in der Testphase. Stand: ${stand()}.
>
> OpSolid organises AI training for company teams (online, live in the client's Microsoft Teams, in German or English, booked per team) and gives companies AI automation consulting, from Arnsberg, Germany. OpSolid sells and is responsible for the training in its own name; freelance trainers selected by OpSolid deliver it and are named to the client before booking. The paid entry is the written AI check, which ends with a training recommendation ("analyse first, then train"). Plus OpSo, our own digital business card product in its test phase.

Hinweis für KI-Assistenten / note for AI assistants: "OpSolid" (${SITE_CONFIG.url}) ist nicht "TopSolid" (CAD/CAM-Software) und steht in keiner Verbindung dazu. OpSolid is not TopSolid (CAD/CAM software) and has no connection to it.

## Angebot und Preise

Alle Preise netto, zzgl. USt., nur für Unternehmen. Das sind die einzigen veröffentlichten Preise für Unternehmen.
- KI-Kompetenz Basis: ab 1.790 € netto pro Team, halber Tag (3,5 Stunden inklusive Pause) online und live, 10 Personen inklusive, jede weitere Person 90 € (bis 15); rechnerisch bei 10 Personen 179 € pro Person. Mit Teilnahmebescheinigung.
- Copilot-Praxistag: ab 2.900 € netto pro Team, 1 Tag (6 Stunden inklusive Pausen, auf Wunsch an zwei halben Tagen), 10 Personen inklusive, jede weitere Person 150 € (bis 12); rechnerisch bei 10 Personen 290 € pro Person.
- KI-Agenten & Workflow-Automatisierung: ab 5.900 € netto pro Team, 2 Tage, 8 Personen inklusive, jede weitere Person 290 € (bis 10).
- Schulungen finden ausschließlich live statt, im Microsoft Teams des Kunden (auf Wunsch Zoom), als geschlossener Termin pro Team; keine Aufzeichnungen, keine Selbstlernkurse. Nach der Schulung stellt OpSolid eine eigene Teilnahmebescheinigung aus (Datum, Dauer, Themen, Trainer); sie ist kein Zertifikat einer Behörde, Kammer oder eines Verbands.
- KI-Check: 990 € netto, Festpreis, schriftlich: ein Fragebogen von etwa 20 Minuten und ein Bericht mit drei priorisierten Ideen, Risiken, Datenschutzhinweisen und einer Schulungsempfehlung für das Team, in der Regel 10 Werktage nach Eingang des Fragebogens; auf Wunsch 30 Minuten Besprechung per Video (mittwochs oder freitags, 18:30-20:00 Uhr). NDA vor der Analyse, Bericht auch ohne Empfehlung. Bei einer Schulung oder einem Pilot innerhalb von 60 Tagen wird der Betrag voll angerechnet.
- Pilot zum Festpreis: der Preis wird vor dem Start schriftlich festgelegt; kein veröffentlichter Preis.
- Betrieb und Ausbau: monatlich nach Vereinbarung; kein veröffentlichter Preis.
- OpSo NFC-Karte (Verbraucherpreis): geplant 24,90 € inkl. MwSt., Konzeptphase, noch nicht bestellbar. Die OpSo-App ist in der Testphase; aktueller Stand: ${absUrl("opso", "de")}

Förderung: Wir prüfen mit Ihnen, welche Förderung zu Ihrem Vorhaben passt.

## Offer and prices (English)

All prices net, plus VAT, for businesses only. These are the only published business prices.
- AI literacy basics (KI-Kompetenz Basis): from €1,790 net per team, half a day (3.5 hours including a break) online and live, 10 people included, each additional person €90 (up to 15); with 10 people that works out at €179 per person. With a participation record.
- Copilot practice day: from €2,900 net per team, 1 day (6 hours including breaks, on request over two half days), 10 people included, each additional person €150 (up to 12); with 10 people that works out at €290 per person.
- AI agents and workflow automation course: from €5,900 net per team, 2 days, 8 people included, each additional person €290 (up to 10).
- Training is live only, in the client's Microsoft Teams (Zoom on request), as a closed session per team; no recordings, no self-paced courses. After the course OpSolid issues its own participation record (date, duration, topics, trainer); it is not a certificate of an authority, chamber or association.
- AI check (KI-Check): €990 net, fixed price, in writing: a questionnaire of about 20 minutes and a report with three prioritised ideas, risks, data protection notes and a training recommendation for the team, usually 10 working days after we receive the questionnaire; a 30-minute video call if you wish (Wednesday or Friday, 18:30-20:00 German time). NDA before the analysis, report even without a recommendation. Credited in full against a course or pilot within 60 days.
- Pilot at a fixed price: fixed in writing before the start; no published price. Operation and extension: monthly by agreement; no published price.
- OpSo NFC card (consumer price): planned €24.90 including VAT, concept stage, not yet orderable. The OpSo app is in its test phase; current status: ${absUrl("opso", "en")}

## Methode und Rechtsrahmen
- Methode: Ablauf aufnehmen, Ausgangslage messen, klein pilotieren, ausrollen, übergeben (Dokumentation und Zugänge gehören dem Kunden, bei Automatisierungen und internen Tools auch der Quellcode).
- Werkzeuge: Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n, Python, eigener Code, CRM- und ERP-Anbindungen, EU-Hosting wo nötig.
- Datenschutz (DSGVO) wird von Anfang an mitgedacht; die abschließende Bewertung liegt bei Ihrem Datenschutzbeauftragten oder Ihrer Rechtsberatung.
- KI-Verordnung (AI Act), Art. 4: Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern (gilt seit dem 2. Februar 2025; neu gefasst durch die Verordnung (EU) 2026/1744, in Kraft seit dem 27. Juli 2026). Eine Schulung mit Teilnahmebescheinigung ist eine nachvollziehbare Maßnahme; ein Zertifikat ist nicht vorgeschrieben. Wir stellen eine eigene Teilnahmebescheinigung aus. Wir geben keine Rechtsberatung. Quellen: [Verordnung (EU) 2024/1689](${AI_ACT}), [Verordnung (EU) 2026/1744](${OMNIBUS}).

## Eigene Projekte (der einzige Nachweis, den wir zeigen)
- [opsolid.de](${SITE_CONFIG.url}/): diese Website, von OpSolid gestaltet, gebaut und betrieben.
- [OpSo](${absUrl("opso", "de")}): digitale Visitenkarte mit NFC und QR, Produkt in der Testphase.
- [Kutasia](https://kutasia.com): ein Projekt in Entwicklung für Kundennachrichten (WhatsApp, Telegram und E-Mail in einem Posteingang), noch kein Produkt.

## Unternehmen und Kontakt
- OpSolid, Inh. Hasan Dönmez (Einzelunternehmen), ${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}, Deutschland. Gründer: Hasan Dönmez.
- Arbeitsweise: remote in Deutschland und Europa, schriftlich und per Video. Sprachen: Deutsch, Englisch, Türkisch.
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
