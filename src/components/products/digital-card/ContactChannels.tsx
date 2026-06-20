"use client";

// =============================================================================
// ContactChannels — reusable row of direct-contact buttons (WhatsApp ×2, phone,
// email) with a pre-filled message. Used by the custom-request section on the
// OpSo Smart product page (and reusable on the public-card "request your own"
// footer later). Hrefs come from src/lib/contact-channels.ts so every surface
// shows the same links; labels are passed in from the locale content.
// =============================================================================

import type { ReactNode } from "react";
import { getContactChannels, type ContactChannelKind } from "@/lib/contact-channels";

interface Props {
  /** Pre-typed WhatsApp / email message. */
  prefill?: string;
  heading?: string;
  note?: string;
  labels: Record<ContactChannelKind, string>;
}

const WA: ReactNode = (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.27-.1-.46-.15-.65.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.65-1.57-.9-2.15-.24-.56-.48-.48-.65-.5h-.56c-.2 0-.5.07-.77.37-.26.3-1 .98-1 2.4 0 1.4 1.03 2.76 1.18 2.95.15.2 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.22 1.31.19 1.8.12.55-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.27-.2-.56-.34zM12.05 21.5h-.02a9.4 9.4 0 01-4.8-1.32l-.34-.2-3.57.93.96-3.48-.22-.36a9.39 9.39 0 01-1.44-5 9.43 9.43 0 0116.1-6.67 9.37 9.37 0 012.76 6.68 9.43 9.43 0 01-9.4 9.42zM20.5 3.49A11.36 11.36 0 0012.05.01C5.8.01.7 5.1.7 11.36c0 2 .52 3.95 1.52 5.67L.6 23.4l6.5-1.7a11.3 11.3 0 005.42 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.9-3.33-8.05z" />
  </svg>
);

const PHONE: ReactNode = (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MAIL: ReactNode = (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const GLYPH: Record<ContactChannelKind, ReactNode> = {
  whatsappTr: WA,
  whatsappDe: WA,
  phone: PHONE,
  email: MAIL,
};

export function ContactChannels({ prefill, heading, note, labels }: Props) {
  const channels = getContactChannels(prefill);
  return (
    <div className="panel" style={{ padding: 20 }}>
      {heading && <div className="meta meta-hot mb-3">{heading}</div>}
      <div className="grid gap-2 sm:grid-cols-2">
        {channels.map((c) => {
          const external = c.kind === "whatsappTr" || c.kind === "whatsappDe";
          return (
            <a
              key={c.kind}
              href={c.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-3 rounded-xl border border-line bg-bg-2 px-4 py-3 transition-colors hover:border-copper hover:bg-bg-3"
            >
              <span className="text-copper" aria-hidden>
                {GLYPH[c.kind]}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">
                  {labels[c.kind]}
                </span>
                <span className="block truncate text-xs text-ink-300">{c.value}</span>
              </span>
            </a>
          );
        })}
      </div>
      {note && <p className="mt-3 text-xs text-ink-300">{note}</p>}
    </div>
  );
}
