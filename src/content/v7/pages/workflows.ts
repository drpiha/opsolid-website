/**
 * KI-Agenten & Workflow-Automatisierung, the course page (key "workflows", /ki-schulungen/ki-agenten; owner decision
 * 73, 2026-11-15). Not the consulting page "KI-Assistenten" (key "agenten", /ki-beratung/ki-assistenten).
 *
 * Built by package P2 (PLAN 6.3) from the hub parts: light hero with the flow schema (the only hero that keeps it),
 * spec, this course's own run (RUN, design review R2), the two other routes moved from the hub, three FAQ items (the
 * price answer for this course only, R2), the CTA band. Only the
 * live facts of this course: 2 Tage, 8 Personen inklusive, bis 10, jede weitere Person 290 €, ab 5.900 € netto pro
 * Team, live online, Deutsch oder Englisch, agenda agreed with the team beforehand. No hours, no topic list and no
 * per-person figure (rule 1). German is the source; EN and TR are transcreations.
 */
import { ablauf } from "../hero-objects";
import { SITE_STR } from "../site";
import { page as hub } from "./schulungen";
import type { Block, L3, PageDef, PageSet } from "../types";


/**
 * The Ablauf of this course (design review R2): not the hub's run, which shows the KI-Kompetenz agenda. Four steps from
 * the live facts of this page (agenda agreed with the team beforehand, two days live in Microsoft Teams, the
 * Teilnahmebescheinigung). Design review R3: the first step shows the catalog cut on this course (drawn), the second a
 * drawn sample offer; the four-node flow stays in the hero only.
 */
const RUN: Record<L3, Block> = {
  de: {
    t: "steps",
    variant: "run",
    id: "ablauf",
    label: "Ablauf",
    h: "Von der Anfrage zu den zwei Tagen",
    lede: "Die Agenda der zwei Tage stimmen wir vorab mit Ihrem Team ab.",
    ground: "bench",
    etikett: "Ausschnitte · Katalog, Muster-Angebot, Schema, Muster-Bescheinigung",
    items: [
      {
        h: "Anfrage",
        p: "Sie schildern uns per Formular Team, Abläufe und Sprache. Drei Sätze genügen.",
        art: { draw: "katalog", lines: ["Schulung", "KI-Agenten & Workflow-", "Automatisierung"], label: "Sie erhalten", h: "Unsere Empfehlung", p: "Wir empfehlen die passende Schulung und nennen den Preis pro Team." },
      },
      {
        h: "Agenda abstimmen",
        p: "Die Agenda der zwei Tage stimmen wir vorab mit Ihrem Team ab, an Abläufen aus Ihrem Alltag. Die Trainerin oder den Trainer nennen wir Ihnen vor der Buchung namentlich.",
        art: { draw: "angebot", lines: ["Angebot"], label: "Sie erhalten", h: "Schriftliches Angebot", p: "Ein schriftliches Angebot pro Team. Vertrag und Rechnung laufen über OpSolid." },
      },
      {
        h: "Zwei Tage live",
        p: "Ein geschlossener Termin nur für Ihr Team, live in Ihrem eigenen Microsoft Teams. Geübt wird mit Beispieldaten, nie mit echten Kundendaten.",
        art: { draw: "termin", lines: ["Live · Microsoft Teams", "KI-Agenten"], label: "Sie erhalten", h: "Die Schulung", p: "Ihr Team hat KI-Agenten und Workflows an eigenen Abläufen geübt." },
      },
      {
        h: "Bescheinigung",
        p: "Wir stellen sie nach der Schulung aus, mit Datum, Dauer, Themen und Trainer.",
        art: { draw: "bescheinigung", lines: ["Teilnahme-", "bescheinigung"], label: "Sie erhalten", h: "Teilnahme\u00ADbescheinigung", p: "Eine nachvollziehbare Maßnahme für Ihre Unterlagen." },
      },
    ],
  },
  en: {
    t: "steps",
    variant: "run",
    id: "ablauf",
    label: "Process",
    h: "From enquiry to the two days",
    lede: "We agree the agenda for the two days with your team beforehand.",
    ground: "bench",
    etikett: "Cut-outs · catalogue, sample offer, schema, sample record",
    items: [
      {
        h: "Enquiry",
        p: "Tell us via the form about your team, workflows and language. Three sentences are enough.",
        art: { draw: "katalog", lines: ["Course", "AI agents & workflow", "automation"], label: "You receive", h: "Our recommendation", p: "We recommend the right course and name the price per team." },
      },
      {
        h: "Agree the agenda",
        p: "We agree the agenda for the two days with your team beforehand, based on workflows from your daily work. We name the trainer to you before you book.",
        art: { draw: "angebot", lines: ["Offer"], label: "You receive", h: "Written offer", p: "A written offer per team. Contract and invoice run through OpSolid." },
      },
      {
        h: "Two days live",
        p: "A closed session just for your team, live in your own Microsoft Teams. We practise with sample data, never with real customer data.",
        art: { draw: "termin", lines: ["Live · Microsoft Teams", "AI agents"], label: "You receive", h: "The course", p: "Your team has practised AI agents and workflows on its own processes." },
      },
      {
        h: "Record",
        p: "We issue it after the course, with date, duration, topics and trainer.",
        art: { draw: "bescheinigung", lines: ["Participation", "record"], label: "You receive", h: "Participation record", p: "A traceable measure for your files." },
      },
    ],
  },
  tr: {
    t: "steps",
    variant: "run",
    id: "ablauf",
    label: "Süreç",
    h: "Talepten iki güne",
    lede: "İki günün programını ekibinizle önceden birlikte belirleriz.",
    ground: "bench",
    etikett: "Kesitler · katalog, örnek teklif, şema, örnek belge",
    items: [
      {
        h: "Talep",
        p: "Formla ekibinizi, iş akışlarınızı ve dili anlatırsınız. Üç cümle yeter.",
        art: { draw: "katalog", lines: ["Eğitim", "YZ Ajanları ve İş Akışı", "Otomasyonu"], label: "Alacağınız", h: "Önerimiz", p: "Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz." },
      },
      {
        h: "Programı belirleme",
        p: "İki günün programını, günlük işinizden iş akışlarıyla ekibinizle önceden birlikte belirleriz. Eğitmeni rezervasyondan önce size adıyla bildiririz.",
        art: { draw: "angebot", lines: ["Teklif"], label: "Alacağınız", h: "Yazılı teklif", p: "Ekip başına yazılı bir teklif. Sözleşme ve fatura OpSolid üzerinden yürür." },
      },
      {
        h: "İki gün canlı",
        p: "Yalnızca ekibinize özel kapalı bir oturum, kendi Microsoft Teams'inizde canlı. Örnek verilerle çalışılır, asla gerçek müşteri verisiyle değil.",
        art: { draw: "termin", lines: ["Canlı · Microsoft Teams", "YZ Ajanları"], label: "Alacağınız", h: "Eğitim", p: "Ekibiniz YZ ajanlarını ve iş akışlarını kendi süreçleri üzerinde çalıştı." },
      },
      {
        h: "Belge",
        p: "Eğitimden sonra düzenleriz: tarih, süre, konular ve eğitmen bilgisiyle.",
        art: { draw: "bescheinigung", lines: ["Katılım", "belgesi"], label: "Alacağınız", h: "Katılım belgesi", p: "Kayıtlarınız için izlenebilir bir önlem." },
      },
    ],
  },
};

const de: PageDef = {
  key: "workflows",
  meta: {
    title: "KI-Agenten-Schulung: Workflows automatisieren im Team",
    description:
      "KI-Agenten und Workflows aufbauen: zwei Tage live in Ihrem Microsoft Teams, 8 Personen inklusive, ein Preis pro Team, mit Teilnahmebescheinigung.",
  },
  crumbs: ["schulungen"],
  // Short crumb: the three-part trail stays on one line at 360 to 412 px in Plex Mono and in its fallback (no CLS).
  crumb: "KI-Agenten",
  hero: {
    eyebrow: "KI-Schulungen · online und live",
    h1: ["KI-Agenten & Workflows:", "zwei Tage", " an Ihren Abläufen"],
    lede: "KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus Ihrem Alltag. Die Agenda der zwei Tage stimmen wir vorab mit Ihrem Team ab.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Alle Schulungen und Preise", to: "schulungen", hash: "preise" },
    strip: [
      ["Preis", "Pro Team ab 5.900 € netto"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["Gruppe", "8 Personen inklusive, bis 10"],
      ["Nach der Schulung", "Eigene Teilnahme­bescheinigung"],
    ],
    stripNote: SITE_STR.de.priceNote,
    media: {
      kind: "svg",
      name: "flow",
      alt: "Schema: eine Anfrage geht ein, der KI-Agent sortiert und entwirft, Ihr Team prüft und gibt frei, das Ergebnis wird abgelegt",
      caption: "Schema · Beispiel für einen Ablauf",
      labels: ["Eingang", "KI-Agent", "Ihr Team", "Ablage"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Eckdaten",
      h: "Was die Schulung umfasst",
      lede: "Zwei Tage live in Ihrem Microsoft Teams, für bis zu 10 Personen, ab 5.900 € netto pro Team.",
      ground: "sheet",
      rows: [
        ["Dauer", "2 Tage"],
        ["Personen", "8 Personen inklusive, bis 10"],
        ["Jede weitere Person", "290 €"],
        ["Preis", "ab 5.900 € netto pro Team"],
        ["Durchführung", "Online und live in Ihrem eigenen Microsoft Teams, auf Wunsch per Zoom. Die Trainerin oder der Trainer kommt als Gast in Ihre Sitzung. Keine Aufzeichnung, kein Selbstlernkurs."],
        ["Agenda", "Die Agenda der zwei Tage stimmen wir vorab mit Ihrem Team ab."],
        ["Sprache", "Deutsch oder Englisch"],
        ["Trainer", "Freiberufliche Trainerinnen und Trainer, die wir auswählen und Ihnen vor der Buchung namentlich nennen. Vertrag und Rechnung laufen über OpSolid."],
        ["Bescheinigung", "Eigene Teilnahmebescheinigung von OpSolid mit Datum, Dauer, Themen und Trainer"],
      ],
      footnote: SITE_STR.de.priceNote,
    },
    RUN.de,
    {
      t: "rows",
      ground: "paper",
      id: "weitere-wege",
      label: "Weitere Wege",
      note: "Erst analysieren, dann schulen.",
      h: "Wenn offen ist, welche Schulung passt",
      items: [
        {
          h: "Erst analysieren, dann schulen",
          p: "Der schriftliche KI-Check (990 € netto, Festpreis) zeigt per Fragebogen und Bericht, wo KI in Ihrem Alltag sinnvoll ist, und endet mit einer Schulungsempfehlung für Ihr Team. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an.",
          href: { label: "Zum KI-Check", to: "check" },
        },
        {
          h: "Abläufe automatisieren",
          p: "Wenn Sie nicht nur schulen, sondern Abläufe mit KI verbessern wollen, beginnen Sie mit der KI-Beratung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: hub.de.faq!.label,
    h: hub.de.faq!.h,
    items: ["Gilt der Preis pro Person?", "Bekommen wir ein Zertifikat?", "Gibt es eine Aufzeichnung?"].map((q) => (q === "Gilt der Preis pro Person?" ? { q, a: `Nein, pro Team: ab 5.900 € netto pro Team, 8 Personen inklusive, jede weitere Person 290 €, bis 10 Personen. Für mehrere Gruppen sprechen Sie uns an. ${SITE_STR.de.priceNote}` } : hub.de.faq!.items.find((it) => it.q === q)!)),
  },
  cta: {
    label: "Schulung anfragen",
    h: "Welches Team soll sicherer mit KI arbeiten?",
    p: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Erst analysieren: zum KI-Check", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "KI-Agenten & Workflow-Automatisierung",
        description:
          "Online-Schulung für Teams: KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus dem Alltag. 2 Tage, bis zu 10 Personen, live auf Deutsch oder Englisch.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const en: PageDef = {
  key: "workflows",
  meta: {
    title: "AI agents training: automate workflows as a team",
    description:
      "Build AI agents and workflows: two days live in your own Microsoft Teams, 8 people included, one price per team, with a participation record.",
  },
  crumbs: ["schulungen"],
  crumb: "AI agents & workflows",
  hero: {
    eyebrow: "AI training · online and live",
    h1: ["AI agents & workflows:", "two days", " on your own processes"],
    lede: "Build AI agents and automated workflows, practised on processes from your daily work. We agree the agenda for the two days with your team beforehand.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "All courses and prices", to: "schulungen", hash: "preise" },
    strip: [
      ["Price", "From €5,900 net per team"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["Group", "8 people included, up to 10"],
      ["After the course", "Our own participation record"],
    ],
    stripNote: SITE_STR.en.priceNote,
    media: {
      kind: "svg",
      name: "flow",
      alt: "Schema: a request comes in, the AI agent sorts it and drafts a reply, your team checks and approves, the result is filed",
      caption: "Schema · example of a workflow",
      labels: ["Inbox", "AI agent", "Your team", "Filing"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Key facts",
      h: "What the course covers",
      lede: "Two days live in your own Microsoft Teams, for up to 10 people, from €5,900 net per team.",
      ground: "sheet",
      rows: [
        ["Duration", "2 days"],
        ["People", "8 people included, up to 10"],
        ["Each additional person", "€290"],
        ["Price", "from €5,900 net per team"],
        ["Delivery", "Online and live in your own Microsoft Teams, via Zoom if you prefer. The trainer joins your session as a guest. No recording, no self-paced course."],
        ["Agenda", "We agree the agenda for the two days with your team beforehand."],
        ["Language", "English or German"],
        ["Trainer", "Freelance trainers we select and name to you before you book. Contract and invoice run through OpSolid."],
        ["Record", "Our own participation record from OpSolid with date, duration, topics and trainer"],
      ],
      footnote: SITE_STR.en.priceNote,
    },
    RUN.en,
    {
      t: "rows",
      ground: "paper",
      id: "weitere-wege",
      label: "Other routes",
      note: "Analyse first, then train.",
      h: "When it is open which course fits",
      items: [
        {
          h: "Analyse first, then train",
          p: "The written AI check (€990 net, fixed price) shows with a questionnaire and a report where AI makes sense in your daily work, and ends with a training recommendation for your team. Credited in full against a follow-up order within 60 days.",
          href: { label: "To the AI check", to: "check" },
        },
        {
          h: "Automate workflows",
          p: "If you want to improve workflows with AI, not only train your team, start with AI automation consulting.",
          href: { label: "To AI consulting", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: hub.en.faq!.label,
    h: hub.en.faq!.h,
    items: ["Is the price per person?", "Do we get a certificate?", "Is there a recording?"].map((q) => (q === "Is the price per person?" ? { q, a: `No, per team: from €5,900 net per team, 8 people included, each additional person €290, up to 10 people. For several groups, please get in touch. ${SITE_STR.en.priceNote}` } : hub.en.faq!.items.find((it) => it.q === q)!)),
  },
  cta: {
    label: "Request training",
    h: "Which team should work with AI more safely?",
    p: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price per team.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Analyse first: to the AI check", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "AI agents & workflow automation",
        description:
          "Online training for teams: build AI agents and automated workflows, practised on processes from daily work. 2 days, up to 10 people, live in English or German.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const tr: PageDef = {
  key: "workflows",
  meta: {
    title: "YZ ajanları eğitimi: iş akışlarını ekipçe otomatikleştirin",
    description:
      "YZ ajanları ve iş akışları kurun: kendi Microsoft Teams'inizde iki gün canlı eğitim, 8 kişi dahil, ekip başına tek fiyat, katılım belgesiyle.",
  },
  crumbs: ["schulungen"],
  crumb: "YZ Ajanları ve İş Akışları",
  hero: {
    eyebrow: "YZ eğitimleri · çevrimiçi ve canlı",
    h1: ["YZ Ajanları ve İş Akışları:", "iki gün", ", kendi süreçlerinizde"],
    lede: "YZ ajanlarını ve otomatik iş akışlarını kurma; günlük işinizdeki süreçler üzerinde uygulamalı. İki günün programını ekibinizle önceden birlikte belirleriz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Tüm eğitimler ve fiyatlar", to: "schulungen", hash: "preise" },
    strip: [
      ["Fiyat", "Ekip başına 5.900 €'dan itibaren (net)"],
      ["Format", "Çevrimiçi, canlı, Microsoft Teams'te"],
      ["Grup", "8 kişi dahil, en fazla 10"],
      ["Eğitimden sonra", "Kendi katılım belgemiz"],
    ],
    stripNote: SITE_STR.tr.priceNote,
    media: {
      kind: "svg",
      name: "flow",
      alt: "Şema: bir talep gelir, YZ ajanı onu sınıflandırır ve bir taslak hazırlar, ekibiniz kontrol edip onaylar, sonuç arşivlenir",
      caption: "Şema · örnek bir iş akışı",
      labels: ["Gelen", "YZ ajanı", "Ekibiniz", "Arşiv"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Temel bilgiler",
      h: "Eğitim neleri kapsar",
      lede: "Kendi Microsoft Teams'inizde iki gün canlı, en fazla 10 kişi, ekip başına 5.900 €'dan itibaren (net).",
      ground: "sheet",
      rows: [
        ["Süre", "2 gün"],
        ["Kişi", "8 kişi dahil, en fazla 10"],
        ["Her ek kişi", "290 €"],
        ["Fiyat", "Ekip başına 5.900 €'dan itibaren (net)"],
        ["Uygulama", "Çevrimiçi ve kendi Microsoft Teams'inizde canlı; isterseniz Zoom ile. Eğitmen oturumunuza konuk olarak katılır. Kayıt yok, kendi kendine öğrenme kursu yok."],
        ["Program", "İki günün programını ekibinizle önceden birlikte belirleriz."],
        ["Dil", "Almanca veya İngilizce"],
        ["Eğitmen", "Bizim seçtiğimiz ve rezervasyondan önce size adıyla bildirdiğimiz serbest eğitmenler. Sözleşme ve fatura OpSolid üzerinden yürür."],
        ["Belge", "Tarih, süre, konular ve eğitmeni içeren, OpSolid'e ait katılım belgesi"],
      ],
      footnote: SITE_STR.tr.priceNote,
    },
    RUN.tr,
    {
      t: "rows",
      ground: "paper",
      id: "weitere-wege",
      label: "Diğer yollar",
      note: "Önce analiz, sonra eğitim.",
      h: "Hangi eğitimin uygun olduğu belli değilse",
      items: [
        {
          h: "Önce analiz, sonra eğitim",
          p: "Yazılı YZ Kontrolü (990 €, net, sabit fiyat) soru formu ve raporla günlük işinizde YZ'nin nerede anlamlı olduğunu gösterir ve ekibiniz için bir eğitim önerisiyle biter. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
          href: { label: "YZ Kontrolü'ne gidin", to: "check" },
        },
        {
          h: "İş akışlarını otomatikleştirin",
          p: "Yalnızca eğitmek değil, iş akışlarını YZ ile iyileştirmek de istiyorsanız YZ danışmanlığıyla başlayın.",
          href: { label: "YZ danışmanlığına gidin", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: hub.tr.faq!.label,
    h: hub.tr.faq!.h,
    items: ["Fiyat kişi başına mı?", "Sertifika alıyor muyuz?", "Kayıt var mı?"].map((q) => (q === "Fiyat kişi başına mı?" ? { q, a: `Hayır, ekip başına: ekip başına 5.900 €'dan itibaren (net), 8 kişi dahil, her ek kişi 290 €, en fazla 10 kişi. Birden fazla grup için bize yazın. ${SITE_STR.tr.priceNote}` } : hub.tr.faq!.items.find((it) => it.q === q)!)),
  },
  cta: {
    label: "Eğitim talep edin",
    h: "Hangi ekip YZ ile daha güvenle çalışmalı?",
    p: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Önce analiz: YZ Kontrolü'ne gidin", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "YZ Ajanları ve İş Akışı Otomasyonu",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ajanlarını ve otomatik iş akışlarını kurma, günlük işten süreçler üzerinde. 2 gün, en fazla 10 kişi, Almanca veya İngilizce canlı.",
        price: 5900,
        from: true,
      },
    ],
  },
};

/* R3: the hero object, the page's own four-node flow on a sheet with one filled row from the flow's live description. */
de.hero.object = ablauf(de, "Beispiel", "geübt an Abläufen aus Ihrem Alltag", ["Anfrage geht ein", "sortiert und entwirft", "prüft und gibt frei", "Ergebnis wird abgelegt"]);
en.hero.object = ablauf(en, "Example", "practised on processes from your daily work", ["request comes in", "sorts it and drafts a reply", "checks and approves", "result is filed"]);
tr.hero.object = ablauf(tr, "Örnek", "günlük işinizdeki süreçler üzerinde uygulamalı", ["bir talep gelir", "sınıflandırır ve bir taslak hazırlar", "kontrol edip onaylar", "sonuç arşivlenir"]);

export const page: PageSet = { de, en, tr };
