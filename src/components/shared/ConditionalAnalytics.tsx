"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { getConsent } from "@/lib/consent";

export function ConditionalAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (c?.analytics) setAllowed(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ analytics: boolean }>).detail;
      setAllowed(!!detail?.analytics);
    };

    window.addEventListener("consent-changed", onChange);
    return () => window.removeEventListener("consent-changed", onChange);
  }, []);

  if (!allowed) return null;
  return <Analytics />;
}
