// =============================================================================
// Playbook registry — single source of truth for "what templates exist".
//
// Adding a new hero playbook = drop a file under ./templates and import it
// here. The runner and the API endpoints both read from REGISTRY only.
// =============================================================================

import { appointmentConfirm } from "./templates/appointment-confirm";
import { emailToQuoteDraft } from "./templates/email-to-quote-draft";
import { multilingualTriage } from "./templates/multilingual-triage";
import { noShowRecovery } from "./templates/no-show-recovery";
import { voiceNoteToTicket } from "./templates/voice-note-to-ticket";
import type { PlaybookTemplate } from "./types";

export const PLAYBOOK_REGISTRY: Record<string, PlaybookTemplate> = {
  [voiceNoteToTicket.slug]: voiceNoteToTicket,
  [multilingualTriage.slug]: multilingualTriage,
  [noShowRecovery.slug]: noShowRecovery,
  [emailToQuoteDraft.slug]: emailToQuoteDraft,
  [appointmentConfirm.slug]: appointmentConfirm,
};

export const PLAYBOOK_CATALOG: Array<{
  slug: string;
  name: string;
  description: string;
  triggerType: string;
}> = Object.values(PLAYBOOK_REGISTRY).map((p) => ({
  slug: p.slug,
  name: p.name,
  description: p.description,
  triggerType: p.triggerType,
}));

export function getTemplate(slug: string): PlaybookTemplate | null {
  return PLAYBOOK_REGISTRY[slug] ?? null;
}
