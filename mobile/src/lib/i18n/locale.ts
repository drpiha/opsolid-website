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
      verifying: 'Doğrulanıyor…',
      errorGeneric: 'Bir şeyler ters gitti. Tekrar deneyin.',
      errorInvalidEmail: 'Geçerli bir e-posta girin.',
      errorWeakPassword: 'Şifre en az 8 karakter olmalı.',
      errorBadCreds: 'E-posta veya şifre yanlış.',
    },
  },
} as const;

export function useTranslations(locale: Locale = detectLocale()) {
  return t[locale];
}
