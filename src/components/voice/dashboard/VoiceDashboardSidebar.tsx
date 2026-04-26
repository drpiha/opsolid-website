"use client";

/**
 * VoiceDashboardSidebar — fixed-width vertical nav for the Voice Agent
 * dashboard. Uses pathname segment matching so the active item highlights
 * automatically without the layout having to thread `activeKey` through.
 *
 * Premium aesthetic: dark surface, copper-tinted dot for the brand, mono
 * caps group labels, hairline separators, copper left border on the active
 * item. No rounded-2xl, no neon — industrial-luxury.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import {
  VOICE_NAV_GROUPS,
  VOICE_NAV_ITEMS,
  type VoiceNavItem,
} from "./nav-items";

interface VoiceDashboardSidebarProps {
  tenantSlug: string;
  token: string;
  businessName: string;
  /** Optional override; if not provided we derive it from the current path. */
  activeKey?: string;
}

function resolveIcon(name: string): LucideIcon {
  const Map = Icons as unknown as Record<string, LucideIcon>;
  return Map[name] ?? Icons.Circle;
}

export default function VoiceDashboardSidebar({
  tenantSlug,
  token,
  businessName,
  activeKey,
}: VoiceDashboardSidebarProps) {
  const pathname = usePathname() ?? "";
  // Derive the active section key from /voice/[slug]/<key>(...).
  const derivedKey = (() => {
    const parts = pathname.split("/").filter(Boolean);
    // ["voice", tenantSlug, key, ...]
    return parts[2] ?? "overview";
  })();
  const active = activeKey ?? derivedKey;

  const tokenMask =
    token.length > 8 ? `${token.slice(0, 8)}••••` : "••••••••";

  const tokenQuery = `?token=${encodeURIComponent(token)}`;

  return (
    <aside
      className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-line bg-bg-1 md:flex"
      aria-label="Voice Agent Navigation"
    >
      {/* ---------- Brand / product header ---------- */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <span
          className="relative inline-flex h-2.5 w-2.5 items-center justify-center"
          aria-hidden
        >
          <span className="absolute inset-0 animate-pulse-bloom rounded-pill bg-copper-500" />
          <span className="absolute inset-0 rounded-pill bg-copper-500" />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="font-display text-[13px] font-medium tracking-tight text-ink">
            Voice Agent
          </span>
          <span className="meta truncate text-[10px] text-ink-400">
            mayAI · Rezeption
          </span>
        </div>
      </div>

      {/* ---------- Nav groups ---------- */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {VOICE_NAV_GROUPS.map((group) => {
          const items = VOICE_NAV_ITEMS.filter((i) => i.group === group.id);
          if (items.length === 0) return null;
          return (
            <NavGroup
              key={group.id}
              label={group.label}
              items={items}
              activeKey={active}
              tenantSlug={tenantSlug}
              tokenQuery={tokenQuery}
            />
          );
        })}
      </nav>

      {/* ---------- Footer: tenant name + masked token ---------- */}
      <div className="border-t border-line px-4 py-4">
        <div
          className="truncate font-display text-[13px] font-medium text-ink"
          title={businessName}
        >
          {businessName}
        </div>
        <div className="meta mt-1 flex items-center gap-1.5 text-[10px] text-ink-400">
          <Icons.Key className="h-3 w-3" aria-hidden />
          <span className="font-mono normal-case tracking-normal">
            {tokenMask}
          </span>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  items,
  activeKey,
  tenantSlug,
  tokenQuery,
}: {
  label: string;
  items: VoiceNavItem[];
  activeKey: string;
  tenantSlug: string;
  tokenQuery: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="px-3 pb-2">
        <span className="meta text-[10px] text-ink-400">{label}</span>
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = resolveIcon(item.icon);
          const isActive = activeKey === item.key;
          return (
            <li key={item.key}>
              <Link
                href={`/voice/${tenantSlug}/${item.key}${tokenQuery}`}
                aria-current={isActive ? "page" : undefined}
                title={item.description}
                className={[
                  "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors duration-150",
                  isActive
                    ? "bg-bg-3 text-ink"
                    : "text-ink-300 hover:bg-bg-2 hover:text-ink",
                ].join(" ")}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-y-1 left-0 w-[2px] rounded-r-pill bg-copper-500 shadow-bloom-sm"
                  />
                )}
                <Icon
                  className={[
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-copper-400"
                      : "text-ink-400 group-hover:text-ink-200",
                  ].join(" ")}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
