import { getLocales } from 'expo-localization';

export type Locale = 'en' | 'de' | 'tr';

export function detectLocale(): Locale {
  const locales = getLocales();
  const code = (locales[0]?.languageCode ?? 'en').toLowerCase();
  if (code === 'de') return 'de';
  if (code === 'tr') return 'tr';
  return 'en';
}

export const t = {
  en: {
    auth: {
      welcome: 'Welcome to OpSolid',
      tagline: 'Your premium digital business card',
      magicLinkCta: 'Continue with email',
      passwordToggle: 'Use password instead',
      magicLinkBack: 'Use email link instead',
      emailPlaceholder: 'Email address',
      passwordPlaceholder: 'Password',
      loginCta: 'Sign in',
      signupCta: 'Create account',
      signupHint: "Don't have an account?",
      loginHint: 'Already have an account?',
      sendMagicLink: 'Send link',
      magicLinkSent: 'Check your email',
      magicLinkSentBody:
        'We sent a sign-in link to {email}. Open it on this device to continue.',
      verifying: 'Verifying…',
      errorGeneric: 'Something went wrong. Try again.',
      errorInvalidEmail: 'Please enter a valid email.',
      errorWeakPassword: 'Password must be at least 8 characters.',
      errorBadCreds: 'Email or password incorrect.',
    },
    cards: {
      title: 'My Cards',
      empty: 'No cards yet.',
      emptyHint: 'Create your first card on opsolid.de',
      views: 'views',
      status: {
        DRAFT: 'Draft',
        PUBLISHED: 'Published',
        CANCELLED: 'Archived',
      },
      pullToRefresh: 'Pull to refresh',
      errorLoad: 'Could not load cards',
      retry: 'Try again',
      detailTitle: 'Card details',
      openWeb: 'Open on the web',
      share: 'Share',
      delete: 'Archive card',
      deleteConfirm: 'Archive this card?',
      deleteConfirmBody: 'It will no longer be visible at /c/{slug}.',
      cancel: 'Cancel',
    },
    settings: {
      title: 'Settings',
      account: 'Account',
      signedInAs: 'Signed in as',
      biometricUnlock: 'Biometric unlock',
      biometricBody: 'Use Face ID / fingerprint to open the app',
      signOut: 'Sign out',
      about: 'About',
      version: 'Version',
    },
    errors: {
      network: 'Network error. Check your connection.',
    },
  },
  de: {
    auth: {
      welcome: 'Willkommen bei OpSolid',
      tagline: 'Ihre Premium-Visitenkarte',
      magicLinkCta: 'Per E-Mail fortfahren',
      passwordToggle: 'Stattdessen Passwort verwenden',
      magicLinkBack: 'Stattdessen E-Mail-Link verwenden',
      emailPlaceholder: 'E-Mail-Adresse',
      passwordPlaceholder: 'Passwort',
      loginCta: 'Anmelden',
      signupCta: 'Konto erstellen',
      signupHint: 'Noch kein Konto?',
      loginHint: 'Bereits ein Konto?',
      sendMagicLink: 'Link senden',
      magicLinkSent: 'Prüfen Sie Ihre E-Mails',
      magicLinkSentBody:
        'Wir haben einen Anmeldelink an {email} gesendet. Öffnen Sie ihn auf diesem Gerät.',
      verifying: 'Wird geprüft…',
      errorGeneric: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
      errorInvalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      errorWeakPassword: 'Passwort muss mindestens 8 Zeichen haben.',
      errorBadCreds: 'E-Mail oder Passwort falsch.',
    },
    cards: {
      title: 'Meine Karten',
      empty: 'Noch keine Karten.',
      emptyHint: 'Erstellen Sie Ihre erste Karte auf opsolid.de',
      views: 'Aufrufe',
      status: {
        DRAFT: 'Entwurf',
        PUBLISHED: 'Veröffentlicht',
        CANCELLED: 'Archiviert',
      },
      pullToRefresh: 'Zum Aktualisieren ziehen',
      errorLoad: 'Karten konnten nicht geladen werden',
      retry: 'Erneut versuchen',
      detailTitle: 'Kartendetails',
      openWeb: 'Im Web öffnen',
      share: 'Teilen',
      delete: 'Karte archivieren',
      deleteConfirm: 'Diese Karte archivieren?',
      deleteConfirmBody: 'Sie wird nicht mehr unter /c/{slug} sichtbar sein.',
      cancel: 'Abbrechen',
    },
    settings: {
      title: 'Einstellungen',
      account: 'Konto',
      signedInAs: 'Angemeldet als',
      biometricUnlock: 'Biometrische Entsperrung',
      biometricBody:
        'Verwenden Sie Face ID / Fingerabdruck zum Öffnen der App',
      signOut: 'Abmelden',
      about: 'Über',
      version: 'Version',
    },
    errors: {
      network: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
    },
  },
  tr: {
    auth: {
      welcome: "OpSolid'e Hoş Geldiniz",
      tagline: 'Premium dijital kartvizitiniz',
      magicLinkCta: 'E-posta ile devam et',
      passwordToggle: 'Şifre ile devam et',
      magicLinkBack: 'E-posta linki ile devam et',
      emailPlaceholder: 'E-posta adresi',
      passwordPlaceholder: 'Şifre',
      loginCta: 'Giriş yap',
      signupCta: 'Hesap oluştur',
      signupHint: 'Hesabınız yok mu?',
      loginHint: 'Zaten hesabınız var mı?',
      sendMagicLink: 'Link gönder',
      magicLinkSent: 'E-postanızı kontrol edin',
      magicLinkSentBody:
        'Giriş linkini {email} adresine gönderdik. Bu cihazda açın.',
      verifying: 'Doğrlanıyor…',
      errorGeneric: 'Bir şeyler ters gitti. Tekrar deneyin.',
      errorInvalidEmail: 'Geçerli bir e-posta girin.',
      errorWeakPassword: 'Şifre en az 8 karakter olmalı.',
      errorBadCreds: 'E-posta veya şifre yanlış.',
    },
    cards: {
      title: 'Kartlarım',
      empty: 'Henüz kart yok.',
      emptyHint: 'İlk kartınızı opsolid.de üzerinden oluşturun',
      views: 'görüntlenme',
      status: {
        DRAFT: 'Taslak',
        PUBLISHED: 'Yayında',
        CANCELLED: 'Arşivlendi',
      },
      pullToRefresh: 'Yenilemek için çekin',
      errorLoad: 'Kartlar yüklenemedi',
      retry: 'Tekrar dene',
      detailTitle: 'Kart detayları',
      openWeb: "Web'de aç",
      share: 'Paylaş',
      delete: 'Kartı arşivle',
      deleteConfirm: 'Bu kart arşivlensin mi?',
      deleteConfirmBody:
        '/c/{slug} adresinde artık görünmeyecek.',
      cancel: 'İptal',
    },
    settings: {
      title: 'Ayarlar',
      account: 'Hesap',
      signedInAs: 'Giriş yapıldı:',
      biometricUnlock: 'Biyometrik kilit',
      biometricBody:
        'Uygulamaı açmak için Face ID / parmak izi kullanın',
      signOut: 'Çıkış yap',
      about: 'Hakkında',
      version: 'Sürüm',
    },
    errors: {
      network: 'Ağ hatası. Bağlantınızı kontrol edin.',
    },
  },
} as const;

export function useTranslations(locale: Locale = detectLocale()) {
  return t[locale];
}
