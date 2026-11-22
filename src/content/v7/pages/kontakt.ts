/**
 * Contact page (v7). Form (POST /api/contact), next steps, direct contact from SITE_CONFIG, NDA note.
 * Response times: inquiries "innerhalb von 2 Werktagen" (owner decision 79, 2026-11-15); trainer applications
 * go on a waiting list until January 2027 (plan 2026-11-17; FAQ, trainer page, form). The form pre-selects a topic from ?anliegen=<value>
 * (`vormerken`: interest in one of the planned courses).
 */
import { SITE_CONFIG } from "@/lib/constants";
import type { PageDef, PageSet } from "../types";
import { blockOf, frag, liste } from "../hero-objects";

const MAIL = SITE_CONFIG.email;
const ADDRESS = `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}`;

const de: PageDef = {
  key: "kontakt",
  meta: {
    title: "Kontakt: Schulung oder KI-Check anfragen",
    description:
      "Schreiben Sie uns per Formular oder E-Mail: eine Schulung für Ihr Team oder ein Ablauf, der Zeit kostet. Wir antworten innerhalb von 2 Werktagen.",
  },
  crumbs: [],
  crumb: "Kontakt",
  hero: {
    eyebrow: "Kontakt",
    h1: ["Schulung oder Ablauf: Erzählen Sie uns,", "worum es geht", ""],
    lede: "Drei Sätze genügen: Welches Team soll geschult werden, oder welcher Ablauf kostet Zeit? Wir antworten persönlich per E‑Mail, innerhalb von 2 Werktagen.",
    primary: { label: "Nachricht schreiben", to: "kontakt", hash: "formular" },
    secondary: { label: "Schulungen ansehen", to: "schulungen" },
    facts: ["NDA vor der Analyse", "Kennenlernen kostenlos und unverbindlich"],
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
        { value: "schulung", label: "KI-Schulung für mein Team" },
        { value: "vormerken", label: "Interesse an einer geplanten Schulung vormerken" },
        { value: "ki-check", label: "KI-Check" },
        { value: "beratung", label: "KI-Beratung und KI-Automatisierung" },
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
          p: "Wir lesen Ihre Nachricht und stellen bei Bedarf eine Rückfrage. Vieles klären wir schon schriftlich.",
        },
        {
          h: "Kennenlernen, kostenlos",
          p: "Per E-Mail oder 15 bis 30 Minuten per Video, mittwochs oder freitags zwischen 18:30 und 20:00 Uhr. Wir sprechen in groben Zügen über Ihren Ablauf; Details folgen nach der NDA. Kostenlos und unverbindlich.",
        },
        {
          h: "Angebot: Schulung oder KI-Check",
          p: "Für eine Schulung erhalten Sie ein Angebot pro Team mit Termin, Trainerin oder Trainer und Preis. Wenn erst ein KI-Check sinnvoll ist, ein Angebot über 990 € netto, Festpreis: Fragebogen und schriftlicher Bericht mit Handlungsempfehlung, in der Regel 10 Werktage nach Eingang des Fragebogens. Die NDA unterzeichnen wir vor der Analyse. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Direkt",
      note: "Wenn Sie lieber direkt schreiben.",
      h: "Direkter Kontakt",
      items: [
        { h: "E-Mail", p: MAIL, href: { label: "E-Mail schreiben", href: `mailto:${MAIL}` } },
        { h: "Anschrift", p: `${ADDRESS}, ${SITE_CONFIG.address.country}` },
        { h: "Arbeitsweise", p: "Remote in Deutschland und Europa, schriftlich und per Video. Sprachen: Deutsch, Englisch, Türkisch." },
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
        a: "Innerhalb von 2 Werktagen, persönlich per E-Mail. Bewerbungen als Trainerin oder Trainer kommen bis Januar 2027 auf eine Warteliste; wir melden uns, wenn eine Kundenanfrage zum Profil passt.",
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
        a: "Das Kennenlernen ist kostenlos und unverbindlich. Schulungen buchen Sie pro Team, ab 1.790 € netto für einen halben Tag. Der KI-Check kostet 990 € netto, Festpreis: Fragebogen und schriftlicher Bericht mit Handlungsempfehlung, auf Wunsch 30 Minuten Besprechung per Video. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an. Den Bericht erhalten Sie auch dann, wenn wir keine Automatisierung empfehlen. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wann sind Termine möglich?",
        a: "Mittwochs und freitags zwischen 18:30 und 20:00 Uhr, per Video. Vieles klären wir vorher per E-Mail.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Lieber erst die Abläufe prüfen lassen?",
    p: "Der KI-Check zeigt, wo sich Automatisierung bei Ihnen lohnt: schriftlich, mit Fragebogen und Bericht.",
    primary: { label: "Zum KI-Check", to: "check" },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
};

const en: PageDef = {
  key: "kontakt",
  meta: {
    title: "Contact: request training or an AI check",
    description:
      "Write to OpSolid by form or email about a course for your team or a workflow that costs you time. The intro is free. We reply within 2 working days.",
  },
  crumbs: [],
  crumb: "Contact",
  hero: {
    eyebrow: "Contact",
    h1: ["A course or a workflow: tell us", "what you need", ""],
    lede: "Three sentences are enough: which team needs training, or which workflow costs you time? We reply personally by email, within 2 working days.",
    primary: { label: "Write a message", to: "kontakt", hash: "formular" },
    secondary: { label: "See the courses", to: "schulungen" },
    facts: ["NDA before the analysis", "Introductory call free and without obligation"],
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
        { value: "schulung", label: "AI training for my team" },
        { value: "vormerken", label: "Register interest in a planned course" },
        { value: "ki-check", label: "AI check" },
        { value: "beratung", label: "AI consulting and AI automation" },
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
          p: "We read your message and ask a follow-up question if needed. Much of it we settle in writing.",
        },
        {
          h: "Intro, free",
          p: "By email, or a 15 to 30-minute video call on a Wednesday or Friday between 18:30 and 20:00 German time. We talk in broad terms about your workflow; details follow once the NDA is signed. Free and without obligation.",
        },
        {
          h: "A quote: training or AI check",
          p: "For training you receive a quote per team with date, trainer and price. If an AI check makes sense first, a quote for €990 net, a fixed price: a questionnaire and a written report with a clear recommendation, usually 10 working days after we receive the questionnaire. We sign the NDA before the analysis. Credited in full against a follow-up order within 60 days.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Direct",
      note: "If you prefer to write directly.",
      h: "Direct contact",
      items: [
        { h: "Email", p: MAIL, href: { label: "Write an email", href: `mailto:${MAIL}` } },
        { h: "Address", p: `${ADDRESS}, Germany` },
        { h: "Way of working", p: "Remote in Germany and Europe, in writing and by video. Languages: German, English, Turkish." },
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
        a: "Within 2 working days, personally by email. Trainer applications go on a waiting list until January 2027; we get in touch when a client request matches the profile.",
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
        a: "The intro is free and without obligation. Training is booked per team, from €1,790 net for a half day. The AI check costs €990 net, fixed price: a questionnaire and a written report with a clear recommendation, with a 30-minute video call if you wish. Credited in full against a follow-up order within 60 days. You receive the report even if we do not recommend any automation. All prices are net of VAT and for businesses only.",
      },
      {
        q: "When can we talk?",
        a: "On Wednesdays and Fridays between 18:30 and 20:00 German time, by video. Much of it we settle beforehand by email.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Would you rather have your workflows checked first?",
    p: "The AI check shows where automation pays off for you: in writing, with a questionnaire and a report.",
    primary: { label: "To the AI check", to: "check" },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
};

const tr: PageDef = {
  key: "kontakt",
  meta: {
    title: "İletişim: eğitim ya da YZ Kontrolü isteyin",
    description:
      "OpSolid'e form ya da e-postayla yazın: ekibiniz için bir eğitim ya da zaman kaybettiren bir iş akışı. Tanışma ücretsizdir. 2 iş günü içinde yanıt veririz.",
  },
  crumbs: [],
  crumb: "İletişim",
  hero: {
    eyebrow: "İletişim",
    h1: ["Eğitim mi, iş akışı mı:", "neye ihtiyacınız", "olduğunu anlatın"],
    lede: "Üç cümle yeter: hangi ekip eğitim alacak ya da hangi iş akışı zaman kaybettiriyor? Size e‑postayla bizzat yanıt veririz; 2 iş günü içinde.",
    primary: { label: "Mesaj yazın", to: "kontakt", hash: "formular" },
    secondary: { label: "Eğitimlere bakın", to: "schulungen" },
    facts: ["Analizden önce NDA", "Tanışma görüşmesi ücretsiz ve bağlayıcı değil"],
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
        { value: "schulung", label: "Ekibim için YZ eğitimi" },
        { value: "vormerken", label: "Planlanan bir eğitime ilgimi bildirmek istiyorum" },
        { value: "ki-check", label: "YZ Kontrolü" },
        { value: "beratung", label: "Yapay zeka danışmanlığı ve otomasyonu" },
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
          p: "Mesajınızı okur, gerekirse bir soru sorarız. Çoğu konuyu yazılı olarak netleştiririz.",
        },
        {
          h: "Tanışma, ücretsiz",
          p: "E-postayla ya da çarşamba veya cuma günleri Almanya saatiyle 18:30-20:00 arasında 15-30 dakikalık görüntülü görüşmeyle. İş akışınızı genel hatlarıyla konuşuruz; ayrıntılar NDA'dan sonra gelir. Ücretsizdir ve bağlayıcı değildir.",
        },
        {
          h: "Teklif: eğitim ya da YZ Kontrolü",
          p: "Eğitim için tarih, eğitmen ve fiyat içeren, ekip başına bir teklif alırsınız. Önce bir YZ Kontrolü anlamlıysa 990 € (net, sabit fiyat) tutarında bir teklif: soru formu ve net bir öneri içeren yazılı rapor; rapor genellikle soru formu bize ulaştıktan sonra 10 iş günü içinde gelir. NDA'yı analizden önce imzalarız. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
        },
      ],
    },
    {
      t: "rows",
      id: "direkt",
      label: "Doğrudan",
      note: "Doğrudan yazmayı tercih ederseniz.",
      h: "Doğrudan iletişim",
      items: [
        { h: "E-posta", p: MAIL, href: { label: "E-posta yazın", href: `mailto:${MAIL}` } },
        { h: "Adres", p: `${ADDRESS}, Almanya` },
        { h: "Çalışma biçimi", p: "Almanya ve Avrupa'da uzaktan, yazılı olarak ve görüntülü görüşmeyle. Diller: Almanca, İngilizce, Türkçe." },
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
        a: "2 iş günü içinde, e-postayla ve kişisel olarak. Eğitmen başvuruları Ocak 2027'ye kadar bekleme listesine alınır; profile uyan bir müşteri talebi gelince döneriz.",
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
        a: "Tanışma ücretsizdir ve bağlayıcı değildir. Eğitimler ekip başına rezerve edilir, yarım gün için 1.790 €'dan (net) itibaren. YZ Kontrolü 990 € (net, sabit fiyat): soru formu ve net bir öneri içeren yazılı rapor, isterseniz 30 dakikalık görüntülü görüşme. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Otomasyon önermesek de raporu alırsınız. Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      },
      {
        q: "Ne zaman görüşebiliriz?",
        a: "Çarşamba ve cuma günleri, Almanya saatiyle 18:30-20:00 arasında, görüntülü olarak. Çoğu konuyu önceden e-postayla netleştiririz.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Önce iş akışlarınıza mı bakalım?",
    p: "YZ Kontrolü, otomasyonun sizde nerede karşılığını vereceğini yazılı olarak, soru formu ve raporla gösterir.",
    primary: { label: "YZ Kontrolüne", to: "check" },
    secondary: { label: "Yapay zeka danışmanlığına", to: "beratung" },
  },
};

/* R2: the hero object, the live "Was nach Ihrer Nachricht passiert" steps as a schema sheet (verbatim notes). */
const KONTAKT_NOTES: Record<"de" | "en" | "tr", [string, string, string]> = {
  de: ["Vieles klären wir schon schriftlich.", "15 bis 30 Minuten per Video", "Die NDA unterzeichnen wir vor der Analyse."],
  en: ["Much of it we settle in writing.", "15 to 30-minute video call", "We sign the NDA before the analysis."],
  tr: ["Çoğu konuyu yazılı olarak netleştiririz.", "15-30 dakikalık görüntülü görüşme", "NDA'yı analizden önce imzalarız."],
};
for (const [loc, d, etikett, stamp] of [
  ["de", de, "Schema · nach Ihrer Anfrage", "Schema"],
  ["en", en, "Schema · after your enquiry", "Schema"],
  ["tr", tr, "Şema · talebinizden sonra", "Şema"],
] as const) {
  const b = blockOf(d, "steps", "ablauf");
  const notes = KONTAKT_NOTES[loc];
  d.hero.object = liste(etikett, { title: b.h, sub: b.note ?? b.label, stamp }, b.items.map((it, i) => ({ text: it.h, note: frag(it.p, notes[i]) })), { numbered: true });
}

export const page: PageSet = { de, en, tr };
