/**
 * Voice Agent dashboard — sidebar navigation definition.
 *
 * Each entry maps to a route segment under `/voice/[tenantSlug]/<key>`.
 * Icons are referenced by lucide-react component name; the sidebar resolves
 * them lazily so adding a new entry never touches the renderer.
 */

export type VoiceNavGroup = "main" | "configure" | "system";

export interface VoiceNavItem {
  /** URL segment under `/voice/[tenantSlug]/<key>`. Also the activeKey. */
  key: string;
  /** German label shown in the sidebar. */
  label: string;
  /** lucide-react icon component name (e.g. `LayoutDashboard`). */
  icon: string;
  /** Section grouping for the sidebar header rendering. */
  group: VoiceNavGroup;
  /** Optional German tagline shown under the label on hover (sr-only otherwise). */
  description?: string;
}

export const VOICE_NAV_ITEMS: VoiceNavItem[] = [
  // ---------- Main ----------
  {
    key: "overview",
    label: "Übersicht",
    icon: "LayoutDashboard",
    group: "main",
    description: "Tageszahlen, Status, schnelle Aktionen",
  },
  {
    key: "calls",
    label: "Anrufprotokoll",
    icon: "PhoneCall",
    group: "main",
    description: "Alle Anrufe mit Transkript & Zusammenfassung",
  },
  {
    key: "analytics",
    label: "Analyse",
    icon: "BarChart3",
    group: "main",
    description: "Heatmap, Trends, Empfehlungen",
  },
  {
    key: "test-call",
    label: "Test-Anruf",
    icon: "Phone",
    group: "main",
    description: "Live-Test vor Inbetriebnahme",
  },

  // ---------- Configure ----------
  {
    key: "agents",
    label: "Agenten",
    icon: "Bot",
    group: "configure",
    description: "Persönlichkeit, Sprache, Skripte",
  },
  {
    key: "phone-numbers",
    label: "Rufnummern",
    icon: "PhoneIncoming",
    group: "configure",
    description: "Eigene oder bereitgestellte Nummern",
  },
  {
    key: "business-hours",
    label: "Öffnungszeiten",
    icon: "Clock",
    group: "configure",
    description: "Wann übernimmt die KI",
  },
  {
    key: "handoff-rules",
    label: "Weiterleitung",
    icon: "GitBranch",
    group: "configure",
    description: "Eskalation an Menschen",
  },
  {
    key: "knowledge-base",
    label: "Wissensbasis",
    icon: "BookOpen",
    group: "configure",
    description: "FAQ, Speisekarte, Preise",
  },
  {
    key: "appointments",
    label: "Termine",
    icon: "CalendarDays",
    group: "configure",
    description: "Buchungsregeln & Kalender",
  },
  {
    key: "integrations",
    label: "Integrationen",
    icon: "Plug",
    group: "configure",
    description: "Cal.com, Webhooks, E-Mail",
  },
  {
    key: "notifications",
    label: "Benachrichtigungen",
    icon: "Bell",
    group: "configure",
    description: "E-Mail, Telegram, WhatsApp",
  },

  // ---------- System ----------
  {
    key: "billing",
    label: "Abrechnung",
    icon: "CreditCard",
    group: "system",
    description: "Minuten, Plan, Verbrauch",
  },
  {
    key: "compliance",
    label: "DSGVO / Recht",
    icon: "Shield",
    group: "system",
    description: "Aufzeichnung, Aufbewahrung, AVV",
  },
  {
    key: "settings",
    label: "Einstellungen",
    icon: "Settings",
    group: "system",
    description: "Firmendaten, Webhook-URL",
  },
];

/** Group header labels (mono caps). Order is intentional. */
export const VOICE_NAV_GROUPS: { id: VoiceNavGroup; label: string }[] = [
  { id: "main", label: "Übersicht" },
  { id: "configure", label: "Konfiguration" },
  { id: "system", label: "System" },
];
