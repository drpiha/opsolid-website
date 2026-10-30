/**
 * Contact page (v7). Form (POST /api/contact), next steps, direct contact from SITE_CONFIG, NDA note.
 * The only response-time statement is the one already in the existing contact copy ("in der Regel
 * innerhalb weniger Arbeitstage"). The form pre-selects a topic from ?anliegen=<value>.
 */
import { SITE_CONFIG } from "@/lib/constants";
import type { PageDef, PageSet } from "../types";

const MAIL = SITE_CONFIG.email;
const PHONE = SITE_CONFIG.phone;
const TEL = `tel:${PHONE.replace(/\s/g, "")}` as const;
const ADDRESS = `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}`;

const de: PageDef = {
  key: "kontakt",
  meta: {
    title: "Kontakt: Ablauf schildern, KI-Check anfragen",
    description:
      "Schreiben Sie uns per Formular, E-Mail oder Telefon, welcher Ablauf Sie bremst und welche Systeme dazugehören. Antwort in der Regel in wenigen Arbeitstagen.",
  },
  crumbs: [],
  crumb: "Kontakt",
  hero: {
    eyebrow: "Kontakt",
    h1: ["Erzählen Sie uns, welcher Ablauf", "Sie bremst", ""],
    lede: "Drei Sätze genügen: Welcher Ablauf, welche Systeme, was stört heute? Wir antworten persönlich per E-Mail, in der Regel innerhalb weniger Arbeitstage.",
    primary: { label: "Nachricht schreiben", to: "kontakt", hash: "formular" },
    secondary: { label: "KI-Check ansehen", to: "check" },
    facts: ["NDA vor der Analyse", "Kennenlernen kostenlos und unverbindlich"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze eines Ablaufs in vier Stationen: Nachricht, Antwort, Gespräch, Angebot",
      caption: "Von Ihrer Nachricht zum Angebot: Nach jedem Schritt entscheiden Sie.",
      fig: "0.1",
      labels: ["Nachricht", "Antwort", "Gespräch", "Angebot"],
    },
  },
  blocks: [
    {
      t: "form",
      id: "formular",
      label: "Nachricht",
      note: "Ein paar Sätze reichen.",
      h: "Nachricht schreiben",
      lede: "Thema wählen, Ablauf kurz beschreiben: Das genügt für eine erste Antwort.",
      topics: [
        { value: "ki-check", label: "KI-Check" },
        { value: "beratung", label: "KI-Beratung und KI-Automatisierung" },
        { value: "schulung", label: "KI-Schulung für mein Team" },
        { value: "trainer", label: "Trainerin oder Trainer werden" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Sonstiges" },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Danach",
      note: "Drei Schritte, ohne Verpflichtung.",
      h: "Was nach Ihrer Nachricht passiert",
      lede: "Nach jedem Schritt entscheiden Sie, ob es weitergeht.",
      items: [
        {
          h: "Persönliche Antwort per E-Mail",
          p: "Wir lesen Ihre Nachricht, stellen bei Bedarf eine Rückfrage und schlagen einen Termin vor.",
        },
        {
          h: "Kennenlernen, 30 Minuten",
          p: "Wir sprechen in groben Zügen über Ihren Ablauf und Ihre Systeme. Details folgen nach der NDA. Das Gespräch ist kostenlos und unverbindlich.",
        },
        {
          h: "Angebot für den KI-Check",
          p: "Wenn ein KI-Check sinnvoll ist, erhalten Sie ein Angebot: ab 990 € netto, 90 Minuten remote plus schriftlicher Kurzbericht. Der Umfang steht vorab schriftlich fest, die NDA unterzeichnen wir vor der Analyse.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Direkt",
      note: "Wenn Sie lieber schreiben oder anrufen.",
      h: "Direkter Kontakt",
      items: [
        { h: "E-Mail", p: MAIL, href: { label: "E-Mail schreiben", href: `mailto:${MAIL}` } },
        { h: "Telefon", p: PHONE, href: { label: "Anrufen", href: TEL } },
        { h: "Anschrift", p: `${ADDRESS}, ${SITE_CONFIG.address.country}` },
        { h: "Arbeitsweise", p: "Remote in Deutschland und Europa, vor Ort nach Absprache. Sprachen: Deutsch, Englisch, Türkisch." },
      ],
    },
    {
      t: "text",
      id: "vertraulichkeit",
      label: "Vertraulichkeit",
      note: "Ihre Angaben bleiben bei uns.",
      h: "Vertraulich, bevor es konkret wird",
      paras: [
        "Für die erste Nachricht genügt eine grobe Beschreibung. Details besprechen wir erst nach unterzeichneter NDA. Bitte senden Sie uns keine Zugangsdaten und keine personenbezogenen Daten Dritter per Formular oder E-Mail.",
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zum Kontakt",
    items: [
      {
        q: "Wie schnell antworten Sie?",
        a: "In der Regel innerhalb weniger Arbeitstage, persönlich per E-Mail.",
      },
      {
        q: "Muss ich schon genau wissen, was ich brauche?",
        a: "Nein. Beschreiben Sie, welcher Ablauf Zeit kostet. Ob Automatisierung, KI oder gar nichts davon passt, klären wir gemeinsam.",
      },
      {
        q: "Beraten Sie auch Privatpersonen?",
        a: "Nein. Unsere Leistungen richten sich nur an Unternehmen.",
      },
      {
        q: "Was kostet der Einstieg?",
        a: "Das Kennenlernen (30 Minuten) ist kostenlos und unverbindlich. Der KI-Check kostet ab 990 € netto zzgl. USt., nur für Unternehmen: 90 Minuten remote plus schriftlicher Kurzbericht. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Den Bericht erhalten Sie auch dann, wenn wir keine Automatisierung empfehlen.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Lieber erst die Abläufe prüfen lassen?",
    p: "Der KI-Check zeigt, wo sich Automatisierung bei Ihnen lohnt. Er kostet ab 990 € netto.",
    primary: { label: "Zum KI-Check", to: "check" },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
};

const en: PageDef = {
  key: "kontakt",
  meta: {
    title: "Contact: describe your workflow, request an AI check",
    description:
      "Write to OpSolid by form, email or phone: which workflow slows you down and which systems are involved. We usually reply within a few working days.",
  },
  crumbs: [],
  crumb: "Contact",
  hero: {
    eyebrow: "Contact",
    h1: ["Tell us which workflow", "slows you down", ""],
    lede: "Three sentences are enough: which workflow, which systems, what is wrong today? We reply personally by email, usually within a few working days.",
    primary: { label: "Write a message", to: "kontakt", hash: "formular" },
    secondary: { label: "See the AI check", to: "check" },
    facts: ["NDA before the analysis", "Introductory call free and without obligation"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch of a workflow in four stations: message, reply, call, quote",
      caption: "From your message to a quote: you decide after every step.",
      fig: "0.1",
      labels: ["Message", "Reply", "Call", "Quote"],
    },
  },
  blocks: [
    {
      t: "form",
      id: "formular",
      label: "Message",
      note: "A few sentences are enough.",
      h: "Write a message",
      lede: "Choose a topic, describe your workflow briefly: that is enough for a first reply.",
      topics: [
        { value: "ki-check", label: "AI check" },
        { value: "beratung", label: "AI consulting and AI automation" },
        { value: "schulung", label: "AI training for my team" },
        { value: "trainer", label: "Becoming a trainer" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Something else" },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Next",
      note: "Three steps, without obligation.",
      h: "What happens after your message",
      lede: "After each step, you decide whether to continue.",
      items: [
        {
          h: "A personal reply by email",
          p: "We read your message, ask a follow-up question if needed and suggest a time to talk.",
        },
        {
          h: "Introductory call, 30 minutes",
          p: "We talk in broad terms about your workflow and your systems. Details follow once the NDA is signed. The call is free and without obligation.",
        },
        {
          h: "A quote for the AI check",
          p: "If an AI check makes sense, you receive a quote: from €990 net, 90 minutes remote plus a short written report. The scope is agreed in writing beforehand, and we sign the NDA before the analysis.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Direct",
      note: "If you prefer to write or call.",
      h: "Direct contact",
      items: [
        { h: "Email", p: MAIL, href: { label: "Write an email", href: `mailto:${MAIL}` } },
        { h: "Phone", p: PHONE, href: { label: "Call us", href: TEL } },
        { h: "Address", p: `${ADDRESS}, Germany` },
        { h: "Way of working", p: "Remote in Germany and Europe, on site by arrangement. Languages: German, English, Turkish." },
      ],
    },
    {
      t: "text",
      id: "vertraulichkeit",
      label: "Confidentiality",
      note: "What you tell us stays with us.",
      h: "Confidential before it gets specific",
      paras: [
        "A rough description is enough for the first message. We discuss details only once the NDA is signed. Please do not send us access credentials or third parties' personal data by form or email.",
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions about getting in touch",
    items: [
      {
        q: "How quickly do you reply?",
        a: "Usually within a few working days, personally by email.",
      },
      {
        q: "Do I need to know exactly what I need?",
        a: "No. Describe which workflow costs you time. Whether automation, AI or neither fits, we clarify together.",
      },
      {
        q: "Do you also advise private individuals?",
        a: "No. Our services are for companies only.",
      },
      {
        q: "What does it cost to get started?",
        a: "The introductory call (30 minutes) is free and without obligation. The AI check starts at €990 net of VAT, for businesses only: 90 minutes remote plus a short written report. Credited in full against a follow-up order within 60 days. You receive the report even if we do not recommend any automation.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Would you rather have your workflows checked first?",
    p: "The AI check shows where automation pays off for you. It starts at €990 net.",
    primary: { label: "To the AI check", to: "check" },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
};

const tr: PageDef = {
  key: "kontakt",
  meta: {
    title: "İletişim: iş akışınızı anlatın, YZ Kontrolü talep edin",
    description:
      "OpSolid'e form, e-posta veya telefonla yazın: hangi iş akışı sizi yavaşlatıyor, hangi sistemler işin içinde. Genellikle birkaç iş günü içinde yanıt veririz.",
  },
  crumbs: [],
  crumb: "İletişim",
  hero: {
    eyebrow: "İletişim",
    h1: ["Hangi iş akışının", "sizi yavaşlattığını", "anlatın"],
    lede: "Üç cümle yeter: hangi iş akışı, hangi sistemler, bugün ne aksıyor? Size e-postayla bizzat yanıt veririz; genellikle birkaç iş günü içinde.",
    primary: { label: "Mesaj yazın", to: "kontakt", hash: "formular" },
    secondary: { label: "YZ Kontrolünü görün", to: "check" },
    facts: ["Analizden önce NDA", "Tanışma görüşmesi ücretsiz ve bağlayıcı değil"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Dört istasyonlu bir iş akışı çizimi: mesaj, yanıt, görüşme, teklif",
      caption: "Mesajınızdan teklife: Her adımdan sonra siz karar verirsiniz.",
      fig: "0.1",
      labels: ["Mesaj", "Yanıt", "Görüşme", "Teklif"],
    },
  },
  blocks: [
    {
      t: "form",
      id: "formular",
      label: "Mesaj",
      note: "Birkaç cümle yeterli.",
      h: "Mesaj yazın",
      lede: "Konuyu seçin, iş akışınızı kısaca anlatın: ilk yanıt için bu yeterli.",
      topics: [
        { value: "ki-check", label: "YZ Kontrolü" },
        { value: "beratung", label: "Yapay zeka danışmanlığı ve otomasyonu" },
        { value: "schulung", label: "Ekibim için YZ eğitimi" },
        { value: "trainer", label: "Eğitmen olmak" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Diğer" },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Sonrası",
      note: "Taahhüt gerektirmeyen üç adım.",
      h: "Mesajınızdan sonra ne olur?",
      lede: "Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      items: [
        {
          h: "E-postayla kişisel yanıt",
          p: "Mesajınızı okur, gerekirse bir soru sorar ve görüşme için bir zaman öneririz.",
        },
        {
          h: "Tanışma görüşmesi, 30 dakika",
          p: "İş akışınız ve sistemleriniz hakkında genel hatlarıyla konuşuruz. Ayrıntılar NDA'dan sonra gelir. Görüşme ücretsizdir ve bağlayıcı değildir.",
        },
        {
          h: "YZ Kontrolü için teklif",
          p: "Bir YZ Kontrolü anlamlıysa size teklif sunarız: 990 €'dan başlar (net), 90 dakika uzaktan ve kısa bir yazılı rapor. Kapsam önceden yazılı olarak belirlenir, NDA'yı analizden önce imzalarız.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Doğrudan",
      note: "Yazmayı ya da aramayı tercih ederseniz.",
      h: "Doğrudan iletişim",
      items: [
        { h: "E-posta", p: MAIL, href: { label: "E-posta yazın", href: `mailto:${MAIL}` } },
        { h: "Telefon", p: PHONE, href: { label: "Arayın", href: TEL } },
        { h: "Adres", p: `${ADDRESS}, Almanya` },
        { h: "Çalışma biçimi", p: "Almanya ve Avrupa'da uzaktan, anlaşmayla yerinde. Diller: Almanca, İngilizce, Türkçe." },
      ],
    },
    {
      t: "text",
      id: "vertraulichkeit",
      label: "Gizlilik",
      note: "Anlattıklarınız bizde kalır.",
      h: "Ayrıntılara geçmeden önce gizlilik",
      paras: [
        "İlk mesaj için kabaca bir açıklama yeterli. Ayrıntıları ancak NDA imzalandıktan sonra konuşuruz. Lütfen form ya da e-postayla erişim bilgileri veya üçüncü kişilerin kişisel verilerini göndermeyin.",
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "İletişim hakkında sık sorulan sorular",
    items: [
      {
        q: "Ne kadar hızlı yanıt veriyorsunuz?",
        a: "Genellikle birkaç iş günü içinde, e-postayla ve kişisel olarak.",
      },
      {
        q: "Ne istediğimi tam olarak bilmem gerekiyor mu?",
        a: "Hayır. Hangi iş akışının zaman kaybettirdiğini anlatın. Otomasyonun, yapay zekanın ya da hiçbirinin uygun olup olmadığını birlikte netleştiririz.",
      },
      {
        q: "Bireylere de danışmanlık veriyor musunuz?",
        a: "Hayır. Hizmetlerimiz yalnızca şirketlere yöneliktir.",
      },
      {
        q: "Başlamak ne kadar tutar?",
        a: "Tanışma görüşmesi (30 dakika) ücretsizdir ve bağlayıcı değildir. YZ Kontrolü 990 €'dan başlar (net, KDV hariç, yalnızca şirketler için): 90 dakika uzaktan ve kısa bir yazılı rapor. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Otomasyon önermesek de raporu alırsınız.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Önce iş akışlarınıza mı bakalım?",
    p: "YZ Kontrolü, otomasyonun sizde nerede karşılığını vereceğini gösterir. 990 €'dan başlar (net).",
    primary: { label: "YZ Kontrolüne", to: "check" },
    secondary: { label: "Yapay zeka danışmanlığına", to: "beratung" },
  },
};

export const page: PageSet = { de, en, tr };
