/** Cookie-banner copy, kept separate from the full content bundle so the banner does not pull every locale into the first load. */
export type ConsentCopy = { title: string; body: string; privacyLink: string; accept: string; reject: string };

export const CONSENT_COPY: Record<string, ConsentCopy> = {
  "en": {
    "title": "Cookies & analytics",
    "body": "We use minimal analytics to understand how opsolid.de is used. No marketing cookies, no profiling. You can change your choice at any time.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "de": {
    "title": "Cookies & Analyse",
    "body": "Wir setzen ein minimales Analyse-Tool ein, um die Nutzung von opsolid.de zu verstehen. Keine Marketing-Cookies, keine Profilbildung. Sie können Ihre Wahl jederzeit ändern.",
    "privacyLink": "Datenschutzerklärung lesen",
    "accept": "Akzeptieren",
    "reject": "Ablehnen"
  },
  "tr": {
    "title": "Çerezler ve analitik",
    "body": "Sitenin nasıl kullanıldığını anlamak için minimal bir analiz aracı kullanıyoruz. Pazarlama çerezi yok, profil oluşturma yok. Tercihinizi istediğiniz zaman değiştirebilirsiniz.",
    "privacyLink": "Gizlilik politikasını okuyun",
    "accept": "Kabul et",
    "reject": "Reddet"
  },
  "es": {
    "title": "Cookies & analytics",
    "body": "We use minimal analytics to understand how opsolid.de is used. No marketing cookies, no profiling. You can change your choice at any time.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "it": {
    "title": "Cookies & analytics",
    "body": "We use minimal analytics to understand how opsolid.de is used. No marketing cookies, no profiling. You can change your choice at any time.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "fr": {
    "title": "Cookies & analytics",
    "body": "We use minimal analytics to understand how opsolid.de is used. No marketing cookies, no profiling. You can change your choice at any time.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "ar": {
    "title": "Cookies & analytics",
    "body": "We use minimal analytics to understand how opsolid.de is used. No marketing cookies, no profiling. You can change your choice at any time.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  }
};
