// =============================================================================
// Inbox v2 — shared types
// =============================================================================

export type ChannelType =
  | "whatsapp"
  | "telegram"
  | "email"
  | "voice"
  | "web"
  | "card_action";

export type ChannelStatus = "active" | "paused" | "error";

export type ThreadStatus = "open" | "snoozed" | "closed" | "archived";

export type MessageDirection = "in" | "out";

export type MessageSentBy =
  | "customer"
  | "user"
  | "ai_draft"
  | "ai_auto"
  | "system";

export type MessageStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type SuggestionType = "reply" | "action" | "summary" | "translation";

export type SuggestionStatus = "pending" | "accepted" | "rejected" | "stale";

export type PlaybookTrigger =
  | "message.in"
  | "thread.created"
  | "calendar.cancelled"
  | "schedule"
  | "manual";

// ---------------------------------------------------------------------------
// Inbound payload — normalized shape every channel adapter produces.
// The adapter is responsible for mapping channel-native webhook payloads
// into this shape so the repository layer never touches BSP-specific JSON.
// ---------------------------------------------------------------------------
export interface InboundMessage {
  channelType: ChannelType;
  externalChannelId: string;
  externalThreadId: string;
  externalMessageId: string;
  contactHandle: string;
  contactName?: string | null;
  contactLocale?: string | null;
  body?: string | null;
  mediaUrls?: string[];
  voiceUrl?: string | null;
  voiceTranscript?: string | null;
  language?: string | null;
  receivedAt: Date;
}

export interface OutboundResult {
  externalMessageId: string;
  deliveredAt?: Date | null;
  status: MessageStatus;
}
