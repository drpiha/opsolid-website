// =============================================================================
// EMAIL COPY REGISTRY — all locale-aware strings for auth email templates.
//
// Seven locales: "en" | "de" | "tr" | "es" | "it" | "fr" | "ar"
// Three template groups: magicLink | welcome | passwordReset
//
// Rules:
//   - No string literals in template files — everything resolves here.
//   - Keep tone professional and direct (OpSolid: industrial-luxury, no fluff).
//   - Formal register everywhere ("Sie" / "usted" / "Lei" / "vous"; Arabic uses
//     the standard formal "أنتم"-style address).
//   - Native scripts only (no transliteration). Arabic uses Modern Standard Arabic.
//
// Type safety:
//   `COPY: Record<Locale, LocaleCopy>` — adding a new locale to `Locale`
//   without populating its keys is a compile error. Adding a new field to
//   any of the LocaleCopy interfaces forces every locale to fill it in.
// =============================================================================

export type Locale = "en" | "de" | "tr" | "es" | "it" | "fr" | "ar";

const SUPPORTED: readonly Locale[] = [
  "en",
  "de",
  "tr",
  "es",
  "it",
  "fr",
  "ar",
] as const;

export interface MagicLinkCopy {
  subject: string;
  preheader: string;
  headline: string;
  greeting: string;
  lead: string;
  /** Single-CTA primary label when no app deep-link is offered (e.g. "Sign in"). */
  cta: string;
  /** Primary "open in app" deep-link CTA label (mobile-first emails). */
  appCta: string;
  /**
   * Secondary "open in browser instead" label, paired with `appCta` when
   * the email contains both an app deep-link and a web fallback URL.
   */
  webCta: string;
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
      appCta: "In der App öffnen",
      webCta: "Im Browser öffnen",
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
      appCta: "Open in app",
      webCta: "Open in browser",
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
      appCta: "Uygulamada aç",
      webCta: "Tarayıcıda aç",
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

  // Spanish — formal "usted" register, neutral peninsular Spanish.
  es: {
    magicLink: {
      subject: "Su enlace de inicio de sesión en OpSolid",
      preheader: "Haga clic en el enlace para iniciar sesión. Válido durante 15 minutos.",
      headline: "Iniciar sesión en OpSolid",
      greeting: "Hola,",
      lead: "Ha solicitado un enlace de inicio de sesión para OpSolid. Pulse el botón para autenticarse.",
      cta: "Iniciar sesión",
      appCta: "Abrir en la aplicación",
      webCta: "Abrir en el navegador",
      expiry: "Este enlace caduca en 15 minutos y solo puede utilizarse una vez.",
      ignore: "Si no ha solicitado este acceso, puede ignorar este correo. Su cuenta sigue siendo segura.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "Bienvenido a OpSolid",
      preheader: "Su cuenta está activa. Abra el panel para empezar.",
      headline: "Bienvenido a OpSolid",
      greeting: (name: string) => name ? `Hola ${name},` : "Hola,",
      lead: "Su cuenta está lista. A partir de ahora puede gestionar sus tarjetas digitales, automatizaciones e integraciones.",
      cta: "Abrir el panel",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Restablecer su contraseña",
      preheader: "Haga clic en el enlace para definir una nueva contraseña.",
      headline: "Restablecer su contraseña",
      greeting: "Hola,",
      lead: "Ha solicitado restablecer la contraseña de su cuenta de OpSolid. Pulse el botón para definir una nueva contraseña.",
      cta: "Restablecer contraseña",
      expiry: (m: number) => `Este enlace caduca en ${m} minutos.`,
      ignore: "Si no ha solicitado restablecer la contraseña, puede ignorar este correo. Su cuenta no se modifica.",
      signoff: "OpSolid",
    },
  },

  // Italian — formal "Lei" register.
  it: {
    magicLink: {
      subject: "Il suo link di accesso per OpSolid",
      preheader: "Clicchi sul link per accedere. Valido per 15 minuti.",
      headline: "Accedi a OpSolid",
      greeting: "Buongiorno,",
      lead: "Ha richiesto un link di accesso per OpSolid. Clicchi sul pulsante per autenticarsi.",
      cta: "Accedi",
      appCta: "Apri nell'app",
      webCta: "Apri nel browser",
      expiry: "Questo link scade tra 15 minuti e può essere utilizzato una sola volta.",
      ignore: "Se non ha effettuato questa richiesta, può ignorare questa email. Il suo account è al sicuro.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "Benvenuto in OpSolid",
      preheader: "Il suo account è attivo. Apra la dashboard per iniziare.",
      headline: "Benvenuto in OpSolid",
      greeting: (name: string) => name ? `Buongiorno ${name},` : "Buongiorno,",
      lead: "Il suo account è configurato. Da ora può gestire i suoi biglietti da visita digitali, le automazioni e le integrazioni.",
      cta: "Apri la dashboard",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Reimposta la password",
      preheader: "Clicchi sul link per impostare una nuova password.",
      headline: "Reimposta la password",
      greeting: "Buongiorno,",
      lead: "Ha richiesto la reimpostazione della password del suo account OpSolid. Clicchi sul pulsante per impostare una nuova password.",
      cta: "Reimposta password",
      expiry: (m: number) => `Questo link scade tra ${m} minuti.`,
      ignore: "Se non ha richiesto la reimpostazione della password, può ignorare questa email. Il suo account rimane invariato.",
      signoff: "OpSolid",
    },
  },

  // French — formal "vous" register.
  fr: {
    magicLink: {
      subject: "Votre lien de connexion OpSolid",
      preheader: "Cliquez sur le lien pour vous connecter. Valable 15 minutes.",
      headline: "Connexion à OpSolid",
      greeting: "Bonjour,",
      lead: "Vous avez demandé un lien de connexion à OpSolid. Cliquez sur le bouton pour vous authentifier.",
      cta: "Se connecter",
      appCta: "Ouvrir dans l'application",
      webCta: "Ouvrir dans le navigateur",
      expiry: "Ce lien expire dans 15 minutes et ne peut être utilisé qu'une seule fois.",
      ignore: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail. Votre compte reste sécurisé.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "Bienvenue chez OpSolid",
      preheader: "Votre compte est actif. Ouvrez votre tableau de bord pour commencer.",
      headline: "Bienvenue chez OpSolid",
      greeting: (name: string) => name ? `Bonjour ${name},` : "Bonjour,",
      lead: "Votre compte est configuré. Vous pouvez désormais gérer vos cartes de visite numériques, vos automatisations et vos intégrations.",
      cta: "Ouvrir le tableau de bord",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "Réinitialiser votre mot de passe",
      preheader: "Cliquez sur le lien pour définir un nouveau mot de passe.",
      headline: "Réinitialiser votre mot de passe",
      greeting: "Bonjour,",
      lead: "Vous avez demandé la réinitialisation du mot de passe de votre compte OpSolid. Cliquez sur le bouton pour définir un nouveau mot de passe.",
      cta: "Réinitialiser le mot de passe",
      expiry: (m: number) => `Ce lien expire dans ${m} minutes.`,
      ignore: "Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet e-mail. Votre compte reste inchangé.",
      signoff: "OpSolid",
    },
  },

  // Arabic — Modern Standard Arabic, formal register. RTL is handled in shell.ts.
  ar: {
    magicLink: {
      subject: "رابط تسجيل الدخول إلى OpSolid",
      preheader: "اضغط على الرابط لتسجيل الدخول. صالح لمدة 15 دقيقة.",
      headline: "تسجيل الدخول إلى OpSolid",
      greeting: "مرحباً،",
      lead: "لقد طلبتم رابط تسجيل دخول إلى OpSolid. اضغطوا على الزر أدناه لإتمام عملية المصادقة.",
      cta: "تسجيل الدخول",
      appCta: "فتح في التطبيق",
      webCta: "فتح في المتصفح",
      expiry: "تنتهي صلاحية هذا الرابط خلال 15 دقيقة ويمكن استخدامه مرة واحدة فقط.",
      ignore: "إذا لم تكونوا قد طلبتم ذلك، يمكنكم تجاهل هذا البريد الإلكتروني بأمان. حسابكم آمن.",
      signoff: "OpSolid",
    },
    welcome: {
      subject: "مرحباً بكم في OpSolid",
      preheader: "حسابكم مفعّل. افتحوا لوحة التحكم للبدء.",
      headline: "مرحباً بكم في OpSolid",
      greeting: (name: string) => name ? `مرحباً ${name}،` : "مرحباً،",
      lead: "تم إعداد حسابكم. يمكنكم الآن إدارة بطاقات أعمالكم الرقمية والأتمتة وعمليات التكامل.",
      cta: "فتح لوحة التحكم",
      signoff: "OpSolid",
    },
    passwordReset: {
      subject: "إعادة تعيين كلمة المرور",
      preheader: "اضغطوا على الرابط لتعيين كلمة مرور جديدة.",
      headline: "إعادة تعيين كلمة المرور",
      greeting: "مرحباً،",
      lead: "لقد طلبتم إعادة تعيين كلمة المرور لحسابكم في OpSolid. اضغطوا على الزر أدناه لتعيين كلمة مرور جديدة.",
      cta: "إعادة تعيين كلمة المرور",
      expiry: (m: number) => `تنتهي صلاحية هذا الرابط خلال ${m} دقيقة.`,
      ignore: "إذا لم تطلبوا إعادة تعيين كلمة المرور، يمكنكم تجاهل هذا البريد الإلكتروني. سيبقى حسابكم دون تغيير.",
      signoff: "OpSolid",
    },
  },
};

/**
 * Resolve a free-form locale string (BCP-47 or just a primary subtag) to one
 * of the seven supported auth-email locales. Anything outside the matrix
 * falls back to English.
 */
export function pickLocale(locale?: string | null): Locale {
  if (!locale) return "en";
  const lc = String(locale).toLowerCase().split("-")[0];
  return (SUPPORTED as readonly string[]).includes(lc) ? (lc as Locale) : "en";
}
