/**
 * Contact-form strings (v7), de/en/tr in full key parity. Wording follows the previous contact form
 * where it was good. No third-party embeds; the form posts to /api/contact.
 */
import type { L3 } from "@/lib/v7-routes";

/** Extra fields shown when the topic "trainer" is chosen (trainer applications). */
export type TrainerFormText = {
  /** Eyebrow that names the trainer group when it appears. */
  group: string;
  /** Replaces the "pick several" hint under the inquiry topics while the trainer topic is chosen (it is exclusive). */
  alone: string;
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
  errMessage: string;
  consent: string;
  consentLink: string;
  /** Screen-reader hint after the privacy link, which opens in a new tab so typed data stays. */
  newTab: string;
  send: string;
  okH: string;
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
  /**
   * Shown when a send fails (src/lib/contact-feedback.ts picks one). `{mail}` becomes the mailto link to `mail`,
   * `{wait}` the wait from `waitMinutes`. Typed values stay in the form after any failure.
   */
  failH: string;
  /** 429: the per-network lock, the in-flight cap or the global send cap of /api/contact; worded neutrally for all three. */
  failBusy: string;
  /** 400, 413, 415: the server rejected the content. */
  failInvalid: string;
  /** 503, any other error, or no answer at all. */
  failDown: string;
  /** [one minute, n minutes] for `{wait}`; the second contains `{n}`. */
  waitMinutes: [string, string];
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
    group: "Bewerbung als Trainerin oder Trainer",
    alone: "Bewerbungen senden Sie bitte getrennt von anderen Anliegen.",
    legend: "Welche Themen schulen Sie?",
    topicsHelp: "Mindestens ein Thema, Mehrfachauswahl möglich.",
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
    messageHelp: "Erfahrung, Praxis im Thema, wie Sie schulen und ob Sie freiberuflich oder gewerblich tätig sind: zwei, drei Sätze genügen.",
    errMessage: "Bitte beschreiben Sie kurz Ihr Profil.",
    consent: "Ich habe den Hinweis zur Verarbeitung meiner Bewerbungsdaten gelesen:",
    consentLink: "Datenschutzerklärung",
    newTab: "(öffnet in neuem Tab)",
    send: "Bewerbung senden",
    okH: "Bewerbung angekommen",
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
    failH: "Nicht gesendet",
    failBusy:
      "Gerade kamen viele Nachrichten kurz hintereinander an. Zum Schutz vor Spam nimmt das Formular für kurze Zeit keine weiteren an. Ihre Eingaben bleiben erhalten. Bitte senden Sie in {wait} erneut oder schreiben Sie direkt an {mail}.",
    failInvalid:
      "Die Nachricht wurde nicht angenommen. Ihre Eingaben bleiben erhalten. Bitte prüfen Sie Ihre Angaben und senden Sie erneut. Besteht das Problem weiterhin, schreiben Sie direkt an {mail}.",
    failDown:
      "Die Nachricht konnte gerade nicht gesendet werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es in ein paar Minuten erneut oder schreiben Sie direkt an {mail}.",
    waitMinutes: ["einer Minute", "{n} Minuten"],
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
    group: "Trainer application",
    alone: "Please send applications separately from other requests.",
    legend: "Which topics do you teach?",
    topicsHelp: "Pick at least one; more than one is fine.",
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
    messageHelp: "Experience, hands-on practice in the topic, how you teach and whether you work as a freelancer or a registered business: two or three sentences are enough.",
    errMessage: "Please describe your profile briefly.",
    consent: "I have read the notice on how my application data is processed:",
    consentLink: "privacy policy",
    newTab: "(opens in a new tab)",
    send: "Send application",
    okH: "Application received",
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
    failH: "Not sent",
    failBusy:
      "Many messages arrived in a short time, so the form is pausing briefly to keep out spam. Nothing you typed has been lost. Please send again in {wait} or write directly to {mail}.",
    failInvalid:
      "The message was not accepted. Nothing you typed has been lost. Please check your details and send again. If the problem persists, write directly to {mail}.",
    failDown:
      "The message could not be sent just now. Nothing you typed has been lost. Please try again in a few minutes or write directly to {mail}.",
    waitMinutes: ["about a minute", "{n} minutes"],
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
    group: "Eğitmen başvurusu",
    alone: "Başvurunuzu lütfen diğer taleplerden ayrı gönderin.",
    legend: "Hangi konularda eğitim veriyorsunuz?",
    topicsHelp: "En az bir konu seçin; birden fazla seçebilirsiniz.",
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
    messageHelp: "Deneyim, konudaki uygulama, eğitim tarzınız ve serbest çalışan mı yoksa işletme sahibi mi olduğunuz: iki üç cümle yeterli.",
    errMessage: "Lütfen profilinizi kısaca yazın.",
    consent: "Başvuru verilerimin işlenmesine ilişkin bilgilendirmeyi okudum:",
    consentLink: "gizlilik politikası",
    newTab: "(yeni sekmede açılır)",
    send: "Başvuruyu gönder",
    okH: "Başvurunuz ulaştı",
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
    failH: "Gönderilmedi",
    failBusy:
      "Kısa sürede çok sayıda mesaj geldi; form, spama karşı koruma için kısa bir süre yeni mesaj almıyor. Girdiğiniz bilgiler korundu. Lütfen {wait} sonra yeniden gönderin ya da doğrudan {mail} adresine yazın.",
    failInvalid:
      "Mesajınız kabul edilmedi. Girdiğiniz bilgiler korundu. Lütfen bilgilerinizi kontrol edip yeniden gönderin. Sorun sürerse doğrudan {mail} adresine yazın.",
    failDown:
      "Mesajınız şu an gönderilemedi. Girdiğiniz bilgiler korundu. Lütfen birkaç dakika sonra yeniden deneyin ya da doğrudan {mail} adresine yazın.",
    waitMinutes: ["1 dakika", "{n} dakika"],
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
