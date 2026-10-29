/**
 * Contact-form strings (v7), de/en/tr in full key parity. Wording follows the previous contact form
 * where it was good. No third-party embeds; the form posts to /api/contact.
 */
import type { L3 } from "@/lib/v7-routes";

export type FormText = {
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
    ok: "Danke, Ihre Nachricht ist bei uns angekommen. Wir antworten in der Regel innerhalb weniger Arbeitstage.",
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
    ok: "Thank you, your message has reached us. We usually reply within a few working days.",
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
    ok: "Teşekkürler, mesajınız bize ulaştı. Genellikle birkaç iş günü içinde yanıt veriyoruz.",
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
