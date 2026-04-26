/**
 * Voice Agent dashboard layout.
 *
 * Auth: tenant slug + ?token= query param. The token is compared against
 * VoiceTenant.tenantToken using a constant-time comparison (timingSafeEqual)
 * so the same code path runs regardless of whether the prefix matches.
 *
 * Children rendered to the right of the fixed sidebar; sidebar derives its
 * own active key from `usePathname()`, so it works for any nested route.
 */

import { timingSafeEqual } from "node:crypto";
import { Suspense } from "react";
import VoiceDashboardSidebar from "@/components/voice/dashboard/VoiceDashboardSidebar";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Voice Agent · Dashboard",
  robots: { index: false, follow: false },
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ token?: string }>;
}

function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function UnauthorizedScreen({
  title = "Ungültiger Zugriffstoken",
  hint = "Prüfen Sie Ihren Dashboard-Link oder kontaktieren Sie den Support.",
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-0 px-6 py-20">
      <div className="panel w-full max-w-sm px-6 py-8 text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-firm bg-bg-3 text-copper-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <h1 className="font-display text-[16px] font-medium text-ink">
          {title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-400">{hint}</p>
      </div>
    </main>
  );
}

export default async function VoiceDashboardLayout({
  children,
  params,
  searchParams,
}: LayoutProps) {
  const { tenantSlug } = await params;
  const { token = "" } = await searchParams;

  const tenant = await prisma.voiceTenant.findUnique({
    where: { slug: tenantSlug },
    select: {
      id: true,
      tenantToken: true,
      businessName: true,
      status: true,
      mode: true,
    },
  });

  if (!tenant) {
    return (
      <UnauthorizedScreen
        title="Tenant nicht gefunden"
        hint="Der angeforderte Voice-Agent-Bereich existiert nicht."
      />
    );
  }

  if (!token || !safeEqual(token, tenant.tenantToken)) {
    return <UnauthorizedScreen />;
  }

  return (
    <div className="flex min-h-screen bg-bg-0">
      <Suspense fallback={null}>
        <VoiceDashboardSidebar
          tenantSlug={tenantSlug}
          token={token}
          businessName={tenant.businessName}
        />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
