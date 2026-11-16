/**
 * KI-Agenten & Workflow-Automatisierung, the course page (key "workflows", /ki-schulungen/ki-agenten; owner decision
 * 73, 2026-11-15). Not the consulting page "KI-Assistenten" (key "agenten", /ki-beratung/ki-assistenten).
 *
 * Built by package P2 (PLAN 6.3) from the hub parts: light hero with the flow schema, spec, the run steps shared with
 * the hub (RUN_STEPS), the two other routes moved from the hub, three hub FAQ items, the CTA band. Only the
 * live facts of this course: 2 Tage, 8 Personen inklusive, bis 10, jede weitere Person 290 €, ab 5.900 € netto pro
 * Team, live online, Deutsch oder Englisch, agenda agreed with the team beforehand. No hours, no topic list and no
 * per-person figure (rule 1). German is the source; EN and TR are transcreations.
 */
import { SITE_STR } from "../site";
import { RUN_STEPS, page as hub } from "./schulungen";
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "workflows",
  meta: {
    title: "KI-Agenten-Schulung: Workflows automatisieren im Team",
    description:
      "KI-Agenten und Workflows aufbauen: zwei Tage live in Ihrem Microsoft Teams, 8 Personen inklusive, ab 5.900 € netto pro Team, mit Teilnahmebescheinigung.",
  },
  crumbs: ["schulungen"],
  // Short crumb: the three-part trail stays on one line at 360 to 412 px in Plex Mono and in its fallback (no CLS).
  crumb: "KI-Agenten",
  hero: {
    eyebrow: "KI-Schulungen · online und live",
    h1: ["KI-Agenten & Workflow-Automatisierung:", "zwei Tage", " an Ihren Abläufen"],
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
    RUN_STEPS.de,
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
    items: ["Gilt der Preis pro Person?", "Bekommen wir ein Zertifikat?", "Gibt es eine Aufzeichnung?"].map((q) => hub.de.faq!.items.find((it) => it.q === q)!),
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
      "Build AI agents and workflows: two days live in your own Microsoft Teams, 8 people included, from €5,900 net per team, with a participation record.",
  },
  crumbs: ["schulungen"],
  crumb: "AI agents & workflows",
  hero: {
    eyebrow: "AI training · online and live",
    h1: ["AI agents & workflow automation:", "two days", " on your own workflows"],
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
    RUN_STEPS.en,
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
    items: ["Is the price per person?", "Do we get a certificate?", "Is there a recording?"].map((q) => hub.en.faq!.items.find((it) => it.q === q)!),
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
      "YZ ajanları ve iş akışları kurun: kendi Microsoft Teams'inizde iki gün canlı, 8 kişi dahil, ekip başına 5.900 €'dan itibaren (net), katılım belgesiyle.",
  },
  crumbs: ["schulungen"],
  crumb: "YZ Ajanları ve İş Akışları",
  hero: {
    eyebrow: "YZ eğitimleri · çevrimiçi ve canlı",
    h1: ["YZ Ajanları ve İş Akışı Otomasyonu:", "iki gün", ", kendi süreçlerinizde"],
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
    RUN_STEPS.tr,
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
    items: ["Fiyat kişi başına mı?", "Sertifika alıyor muyuz?", "Kayıt var mı?"].map((q) => hub.tr.faq!.items.find((it) => it.q === q)!),
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

export const page: PageSet = { de, en, tr };
