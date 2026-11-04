/**
 * Contact-form strings (v7), de/en/tr in full key parity. Wording follows the previous contact form
 * where it was good. No third-party embeds; the form posts to /api/contact.
 */
import type { L3 } from "@/lib/v7-routes";

/** Extra fields shown when the topic "trainer" is chosen (trainer applications). */
export type TrainerFormText = {
  legend: string;
  topicsHelp: string;
  /** Keys match TRAINER_TOPICS in src/lib/contact-guard.ts. */
  topics: [string, string][];
  languages: string;
  languagesHelp: string;
  region: string;
  regionHelp: string;
  link: string;
  linkHelp: string;
  rate: string;
  rateHelp: string;
  message: string;
  messageHelp: string;
  consent: string;
  consentLink: string;
  errTopics: string;
  errLanguages: string;
  errRegion: string;
  errLink: string;
  errConsent: string;
  ok: string;
};

export type FormText = {
  trainer: TrainerFormText;
  name: string;
  nameHelp: string;
  email: string;
  emailHelp: string;
  company: string;
  topics: string;
  topicsHelp: string;
  message: string;
  messageHelp: string;
  send: string;
  sending: string;
  ok: string;
  okH: string;
  /** Fallback shown on any failure, including the 503 when mail delivery is not configured: [before, after] around the address. */
  fallback: [string, string];
  errName: string;
  errEmail: string;
  errMessage: string;
  errSummary: string;
  consent: string;
  privacy: string;
  required: string;
  honeypot: string;
  mail: string;
};

export const FORM: Record<L3, FormText> = {
  de: {
  trainer: {
    legend: "Ihre Themen",
    topicsHelp: "Mehrfachauswahl möglich.",
    topics: [
      ["copilot", "Microsoft 365 Copilot"],
      ["alltag", "KI im Arbeitsalltag"],
      ["automatisierung", "Workflow-Automatisierung"],
      ["grundlagen", "KI-Kompetenz, Datenschutz und Regeln"],
    ],
    languages: "Sprachen",
    languagesHelp: "In welchen Sprachen schulen Sie, zum Beispiel Deutsch und Englisch?",
    region: "Land und Zeitzone",
    regionHelp: "Zum Beispiel Deutschland, MEZ.",
    link: "Link zu Profil oder Arbeitsprobe (optional)",
    linkHelp: "Ein Link genügt, zum Beispiel LinkedIn oder Ihre Website.",
    rate: "Honorarvorstellung (optional)",
    rateHelp: "Freie Angabe, zum Beispiel pro Tag oder pro Stunde.",
    message: "Kurzprofil",
    messageHelp: "Erfahrung, Praxis im Thema und wie Sie schulen: zwei, drei Sätze genügen.",
    consent: "Ich habe den Hinweis zur Verarbeitung meiner Bewerbungsdaten gelesen:",
    consentLink: "Datenschutzerklärung",
    errTopics: "Bitte wählen Sie mindestens ein Thema.",
    errLanguages: "Bitte nennen Sie Ihre Sprachen.",
    errRegion: "Bitte nennen Sie Land und Zeitzone.",
    errLink: "Bitte geben Sie einen Link an, der mit https:// beginnt, oder lassen Sie das Feld leer.",
    errConsent: "Bitte bestätigen Sie den Hinweis zur Datenverarbeitung.",
    ok: "Danke, Ihre Bewerbung ist angekommen. Wir antworten innerhalb von sieben Tagen.",
  },
    name: "Name",
    nameHelp: "Vor- und Nachname",
    email: "E-Mail",
    emailHelp: "Hier antworten wir Ihnen.",
    company: "Firma (optional)",
    topics: "Worum geht es?",
    topicsHelp: "Mehrfachauswahl möglich.",
    message: "Nachricht",
    messageHelp: "Ein paar Sätze reichen: Was läuft heute von Hand, und was wünschen Sie sich?",
    send: "Nachricht senden",
    sending: "Wird gesendet …",
    okH: "Nachricht angekommen",
    ok: "Danke, Ihre Nachricht ist angekommen. Wir antworten in der Regel innerhalb weniger Arbeitstage.",
    fallback: ["Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie direkt an ", "."],
    errName: "Bitte geben Sie Ihren Namen an.",
    errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
    errMessage: "Bitte schreiben Sie kurz, worum es geht.",
    errSummary: "Bitte prüfen Sie Ihre Angaben.",
    consent: "Ihre Angaben verwenden wir nur, um Ihre Anfrage zu beantworten. Mehr dazu in der",
    privacy: "Datenschutzerklärung",
    required: "Pflichtfeld",
    honeypot: "Bitte leer lassen",
    mail: "info@opsolid.de",
  },
  en: {
  trainer: {
    legend: "Your topics",
    topicsHelp: "You can pick more than one.",
    topics: [
      ["copilot", "Microsoft 365 Copilot"],
      ["alltag", "AI in daily work"],
      ["automatisierung", "Workflow automation"],
      ["grundlagen", "AI literacy, data protection and rules"],
    ],
    languages: "Languages",
    languagesHelp: "Which languages do you teach in, for example German and English?",
    region: "Country and time zone",
    regionHelp: "For example Germany, CET.",
    link: "Link to a profile or work sample (optional)",
    linkHelp: "One link is enough, for example LinkedIn or your website.",
    rate: "Fee expectation (optional)",
    rateHelp: "Free text, for example per day or per hour.",
    message: "Short profile",
    messageHelp: "Experience, hands-on practice in the topic and how you teach: two or three sentences are enough.",
    consent: "I have read the notice on how my application data is processed:",
    consentLink: "privacy policy",
    errTopics: "Please choose at least one topic.",
    errLanguages: "Please tell us your languages.",
    errRegion: "Please tell us your country and time zone.",
    errLink: "Please enter a link starting with https:// or leave the field empty.",
    errConsent: "Please confirm the notice on data processing.",
    ok: "Thank you, your application has arrived. We reply within seven days.",
  },
    name: "Name",
    nameHelp: "First and last name",
    email: "Email",
    emailHelp: "This is where we reply.",
    company: "Company (optional)",
    topics: "What is it about?",
    topicsHelp: "You can pick more than one.",
    message: "Message",
    messageHelp: "A few sentences are enough: what runs by hand today, and what would you like instead?",
    send: "Send message",
    sending: "Sending …",
    okH: "Message received",
    ok: "Thank you, your message has arrived. We usually reply within a few working days.",
    fallback: ["Your message could not be sent. Please write directly to ", "."],
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errMessage: "Please tell us briefly what it is about.",
    errSummary: "Please check your details.",
    consent: "We use your details only to answer your inquiry. More in the",
    privacy: "privacy policy",
    required: "Required",
    honeypot: "Please leave empty",
    mail: "info@opsolid.de",
  },
  tr: {
  trainer: {
    legend: "Konularınız",
    topicsHelp: "Birden fazla seçebilirsiniz.",
    topics: [
      ["copilot", "Microsoft 365 Copilot"],
      ["alltag", "Günlük işte YZ"],
      ["automatisierung", "İş akışı otomasyonu"],
      ["grundlagen", "YZ yetkinliği, veri koruma ve kurallar"],
    ],
    languages: "Diller",
    languagesHelp: "Hangi dillerde eğitim veriyorsunuz, örneğin Almanca ve İngilizce?",
    region: "Ülke ve saat dilimi",
    regionHelp: "Örneğin Almanya, CET.",
    link: "Profil veya çalışma örneği bağlantısı (isteğe bağlı)",
    linkHelp: "Tek bağlantı yeterli, örneğin LinkedIn veya web siteniz.",
    rate: "Ücret beklentisi (isteğe bağlı)",
    rateHelp: "Serbest yazın, örneğin günlük veya saatlik.",
    message: "Kısa profil",
    messageHelp: "Deneyim, konudaki uygulama ve eğitim tarzınız: iki üç cümle yeterli.",
    consent: "Başvuru verilerimin işlenmesine ilişkin bilgilendirmeyi okudum:",
    consentLink: "gizlilik politikası",
    errTopics: "Lütfen en az bir konu seçin.",
    errLanguages: "Lütfen dillerinizi yazın.",
    errRegion: "Lütfen ülke ve saat diliminizi yazın.",
    errLink: "Lütfen https:// ile başlayan bir bağlantı girin veya alanı boş bırakın.",
    errConsent: "Lütfen veri işleme bilgilendirmesini onaylayın.",
    ok: "Teşekkürler, başvurunuz ulaştı. Yedi gün içinde yanıt veriyoruz.",
  },
    name: "Ad",
    nameHelp: "Ad ve soyad",
    email: "E-posta",
    emailHelp: "Yanıtımızı bu adrese göndeririz.",
    company: "Şirket (isteğe bağlı)",
    topics: "Konu nedir?",
    topicsHelp: "Birden fazla seçebilirsiniz.",
    message: "Mesaj",
    messageHelp: "Birkaç cümle yeterli: bugün hangi işler elle yapılıyor, ne istersiniz?",
    send: "Mesajı gönder",
    sending: "Gönderiliyor …",
    okH: "Mesajınız ulaştı",
    ok: "Teşekkürler, mesajınız ulaştı. Genellikle birkaç iş günü içinde yanıt veriyoruz.",
    fallback: ["Mesajınız gönderilemedi. Lütfen doğrudan ", " adresine yazın."],
    errName: "Lütfen adınızı girin.",
    errEmail: "Lütfen geçerli bir e-posta adresi girin.",
    errMessage: "Lütfen konunuzu kısaca yazın.",
    errSummary: "Lütfen bilgilerinizi kontrol edin.",
    consent: "Bilgilerinizi yalnızca talebinizi yanıtlamak için kullanırız. Ayrıntılar",
    privacy: "gizlilik politikasında",
    required: "Zorunlu alan",
    honeypot: "Lütfen boş bırakın",
    mail: "info@opsolid.de",
  },
};
