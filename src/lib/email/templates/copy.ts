// =============================================================================
// EMAIL COPY REGISTRY — all locale-aware strings for auth email templates.
//
// Three locales: "de" | "en" | "tr"
// Three template groups: magicLink | welcome | passwordReset
//
// Rules:
//   - No string literals in template files — everything resolves here.
//   - Keep tone professional and direct (OpSolid: industrial-luxury, no fluff).
//   - German formal "Sie" throughout (B2B audience, Germany-based).
// =============================================================================

export type Locale = "de" | "en" | "tr";

export interface MagicLinkCopy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: string;
  lead: string;
  cta: string;
  expiry: string;
  ignore: string;
  signoff: string;
}

export interface WelcomeCopy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: (name: string) => string;
  lead: string;
  cta: string;
  signoff: string;
}

export interface PasswordResetCopy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: string;
  lead: string;
  cta: string;
  expiry: (minutes: number) => string;
  ignore: string;
  signoff: string;
}

export interface LocaleCopy {
  magicLink: MagicLinkCopy;
  welcome: WelcomeCopy;
  passwordReset: PasswordResetCopy;
}

export const COPY: Record<Locale, LocaleCopy> = {
  de: {
    magicLink: {
      subject: "Ihr Anmeldelink für OpSolid",
      preheader: "Klicken Sie auf den Link, um sich anzumelden. Gültig für 15 Minuten.",
      headline: "Anmelden bei OpSolid",
      greeting: "Guten Tag,",
      lead: "Sie haben eine Anmeldung bei OpSolid angefordert. Klicken Sie auf den Button, um sich anzumelden.",
      cta: "Anmelden",
      expiry: "Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden.",
      ignore: "Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Ihr Konto ist sicher.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "Willkommen bei OpSolid",
      preheader: "Ihr Konto ist aktiv. Öffnen Sie Ihr Dashboard, um loszulegen.",
      headline: "Willkommen bei OpSolid",
      greeting: (name: string) => name ? `Guten Tag ${name},` : "Guten Tag,",
      lead: "Ihr Konto ist eingerichtet. Ab sofort können Sie Ihre digitalen Visitenkarten, Automatisierungen und Integrationen verwalten.",
      cta: "Dashboard öffnen",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Passwort zurücksetzen",
      preheader: "Klicken Sie auf den Link, um ein neues Passwort festzulegen.",
      headline: "Passwort zurücksetzen",
      greeting: "Guten Tag,",
      lead: "Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button, um ein neues Passwort festzulegen.",
      cta: "Passwort zurücksetzen",
      expiry: (m: number) => `Dieser Link ist ${m} Minuten gültig.`,
      ignore: "Falls Sie kein neues Passwort angefordert haben, können Sie diese E-Mail ignorieren. Ihr Konto bleibt unverändert.",
      signoff: "OpSolid",
    },
  },

  en: {
    magicLink: {
      subject: "Your sign-in link for OpSolid",
      preheader: "Click the link to sign in. Valid for 15 minutes.",
      headline: "Sign in to OpSolid",
      greeting: "Hello,",
      lead: "You requested a sign-in link for OpSolid. Click the button below to authenticate.",
      cta: "Sign in",
      expiry: "This link expires in 15 minutes and can only be used once.",
      ignore: "If you did not request this, you can safely ignore this email. Your account is secure.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "Welcome to OpSolid",
      preheader: "Your account is active. Open your dashboard to get started.",
      headline: "Welcome to OpSolid",
      greeting: (name: string) => name ? `Hello ${name},` : "Hello,",
      lead: "Your account is set up. You can now manage your digital business cards, automations, and integrations.",
      cta: "Open dashboard",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Reset your password",
      preheader: "Click the link to set a new password.",
      headline: "Reset your password",
      greeting: "Hello,",
      lead: "You requested a password reset for your OpSolid account. Click the button below to set a new password.",
      cta: "Reset password",
      expiry: (m: number) => `This link expires in ${m} minutes.`,
      ignore: "If you did not request a password reset, you can safely ignore this email. Your account remains unchanged.",
      signoff: "OpSolid",
    },
  },

  tr: {
    magicLink: {
      subject: "OpSolid giriş bağlantınız",
      preheader: "Giriş yapmak için bağlantıya tıklayın. 15 dakika geçerlidir.",
      headline: "OpSolid'e giriş yapın",
      greeting: "Merhaba,",
      lead: "OpSolid için giriş bağlantısı talep ettiniz. Giriş yapmak için aşağıdaki butona tıklayın.",
      cta: "Giriş yap",
      expiry: "Bu bağlantı 15 dakika geçerlidir ve yalnızca bir kez kullanılabilir.",
      ignore: "Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "OpSolid'e hoş geldiniz",
      preheader: "Hesabınız aktif. Başlamak için panonuzu açın.",
      headline: "OpSolid'e hoş geldiniz",
      greeting: (name: string) => name ? `Merhaba ${name},` : "Merhaba,",
      lead: "Hesabınız oluşturuldu. Artık dijital kartvizitlerinizi, otomasyonlarınızı ve entegrasyonlarınızı yönetebilirsiniz.",
      cta: "Panoyu aç",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Şifrenizi sıfırlayın",
      preheader: "Yeni şifre belirlemek için bağlantıya tıklayın.",
      headline: "Şifrenizi sıfırlayın",
      greeting: "Merhaba,",
      lead: "OpSolid hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifre belirlemek için aşağıdaki butona tıklayın.",
      cta: "Şifreyi sıfırla",
      expiry: (m: number) => `Bu bağlantı ${m} dakika geçerlidir.`,
      ignore: "Şifre sıfırlama talebini siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz. Hesabınız değişmeden kalır.",
      signoff: "OpSolid",
    },
  },
};

export function pickLocale(locale?: string | null): Locale {
  if (locale === "de" || locale === "en" || locale === "tr") return locale;
  return "en";
}
