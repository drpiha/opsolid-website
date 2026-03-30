interface LogoProps {
  className?: string;
  size?: number;
}

export function N8nLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Workflow node icon - two connected nodes */}
      <rect x="2" y="3" width="7" height="7" rx="1.5" />
      <rect x="15" y="14" width="7" height="7" rx="1.5" />
      <path d="M9 6.5h2.5a2 2 0 0 1 2 2V14" strokeWidth="0" />
      <rect x="12" y="5.5" width="2.5" height="2" rx="0.5" />
      <rect x="12" y="13" width="2.5" height="2" rx="0.5" />
      <rect x="12" y="9" width="2.5" height="2" rx="0.5" />
    </svg>
  );
}

export function MakeLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Purple swirl / circular arrow */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      <path d="M12 6c-3.31 0-6 2.69-6 6h2.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5v2.5c3.31 0 6-2.69 6-6s-2.69-6-6-6z" />
      <path d="M10 15l-3 2.5L10 20v-5z" />
    </svg>
  );
}

export function ZapierLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Lightning bolt */}
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

export function WhatsAppLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Phone in speech bubble */}
      <path d="M12 2C6.48 2 2 6.04 2 11c0 1.77.55 3.42 1.5 4.83L2 22l6.29-1.64C9.48 20.77 10.71 21 12 21c5.52 0 10-4.04 10-9S17.52 2 12 2zm0 16c-1.13 0-2.2-.22-3.18-.62l-.58-.24-3.05.8.76-2.95-.3-.53C4.58 13.56 4 12.33 4 11c0-3.86 3.59-7 8-7s8 3.14 8 7-3.59 7-8 7z" />
      <path d="M15.36 13.29c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.64-.63.77-.12.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.98-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.46-.16-.38-.32-.33-.44-.34h-.38c-.13 0-.34.05-.52.25s-.68.66-.68 1.62.7 1.88.8 2.01c.1.13 1.37 2.09 3.32 2.93.46.2.83.32 1.11.41.47.15.9.13 1.23.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
    </svg>
  );
}

export function TelegramLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Paper plane */}
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

export function ShopifyLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Shopping bag */}
      <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v10z" />
    </svg>
  );
}

export function CustomApiLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      {/* Code brackets / API icon */}
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}
