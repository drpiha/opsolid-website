"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

export default function TenantTokenReveal({ token }: { token: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-stretch gap-2">
      <input
        readOnly
        type={revealed ? "text" : "password"}
        className="field flex-1 font-mono text-[12px]"
        value={token}
        aria-label="Tenant-Token"
      />
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="btn btn-ghost btn-sm"
      >
        {revealed ? (
          <EyeOff className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Eye className="h-3.5 w-3.5" aria-hidden />
        )}
        {revealed ? "Verbergen" : "Anzeigen"}
      </button>
      <button type="button" onClick={copy} className="btn btn-ghost btn-sm">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-signal-ok" aria-hidden />
            Kopiert
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Kopieren
          </>
        )}
      </button>
    </div>
  );
}
