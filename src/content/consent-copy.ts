/** Cookie-banner copy, kept separate from the full content bundle so the banner does not pull every locale into the first load. */
export type ConsentCopy = { title: string; body: string; privacyLink: string; accept: string; reject: string };

export const CONSENT_COPY: Record<string, ConsentCopy> = {
  "en": {
    "title": "Cookies & analytics",
    "body": "I use minimal analytics to understand how OpSolid is used. No marketing cookies, no profiling. You can change your choice anytime.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "de": {
    "title": "Cookies & Analyse",
    "body": "Ich setze ein minimales Analyse-Tool ein, um die Nutzung von OpSolid zu verstehen. Keine Marketing-Cookies, keine Profilbildung. Sie können Ihre Wahl jederzeit ändern.",
    "privacyLink": "Datenschutzerklärung lesen",
    "accept": "Akzeptieren",
    "reject": "Ablehnen"
  },
  "tr": {
    "title": "Çerezler ve analitik",
    "body": "OpSolid'in nasıl kullanıldığını anlamak için minimal analitik kullanırım. Pazarlama çerezi, profilleme yok. Tercihinizi istediğiniz zaman değiştirebilirsiniz.",
    "privacyLink": "Gizlilik politikasını okuyun",
    "accept": "Kabul et",
    "reject": "Reddet"
  },
  "es": {
    "title": "Cookies & analytics",
    "body": "I use minimal analytics to understand how OpSolid is used. No marketing cookies, no profiling. You can change your choice anytime.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "it": {
    "title": "Cookies & analytics",
    "body": "I use minimal analytics to understand how OpSolid is used. No marketing cookies, no profiling. You can change your choice anytime.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "fr": {
    "title": "Cookies & analytics",
    "body": "I use minimal analytics to understand how OpSolid is used. No marketing cookies, no profiling. You can change your choice anytime.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  },
  "ar": {
    "title": "Cookies & analytics",
    "body": "I use minimal analytics to understand how OpSolid is used. No marketing cookies, no profiling. You can change your choice anytime.",
    "privacyLink": "Read the privacy policy",
    "accept": "Accept",
    "reject": "Reject"
  }
};
