// =============================================================================
// Playbook framework — types
//
// Templates are TypeScript modules that each export a single `run` function
// plus metadata. The runtime stores per-user instances in InboxPlaybook,
// triggers from webhooks / cron / UI flow through `runner.ts`, and
// templates do the actual work.
//
// We did NOT build a step-based DSL (JSON{action, args} chains). It would
// double the surface and triple the debug effort with no real flexibility
// win at our current count of five templates. When the user creates real
// custom playbooks we can revisit.
// =============================================================================

import type { InboxChannel, InboxPlaybook, User } from "@/generated/prisma";
import type { PlaybookTrigger } from "../types";

export interface PlaybookContext {
  user: Pick<User, "id" | "locale" | "name" | "email">;
  playbook: InboxPlaybook;
  trigger: PlaybookTrigger;
  /** Set when triggered by an inbox event. */
  thread?: {
    id: string;
    channelType: string;
    contactHandle: string;
    contactName: string | null;
    contactLocale: string | null;
    channel: InboxChannel;
  };
  /** Set when triggered by an inbox event with a specific new message. */
  message?: {
    id: string;
    body: string | null;
    voiceTranscript: string | null;
    voiceUrl: string | null;
    language: string | null;
  };
  /** Extra params for manual / scheduled / calendar triggers. */
  extra?: Record<string, unknown>;
}

export interface PlaybookTemplate {
  slug: string;
  name: string;
  description: string;
  triggerType: PlaybookTrigger;
  /** Default JSON for InboxPlaybook.triggerConfig — UI editable later. */
  defaultConfig?: Record<string, unknown>;
  /** Default JSON for InboxPlaybook.steps. Opaque — only this template reads it. */
  defaultSteps: Record<string, unknown>;
  run: (ctx: PlaybookContext) => Promise<PlaybookOutcome>;
}

export interface PlaybookOutcome {
  /** Short human-readable line we surface in last-run log. */
  summary: string;
  /** Structured data for the playbook detail view. */
  details?: Record<string, unknown>;
}
