// Zod schemas + runtime constants for every Voice Agent string-valued column.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Enum schemas — mirror Prisma string-typed columns.
// ---------------------------------------------------------------------------

export const VoiceTenantModeZ = z.enum(["standalone", "kutasia_module"]);
export const VoiceTenantStatusZ = z.enum([
  "trial",
  "active",
  "suspended",
  "cancelled",
]);

export const VoiceAgentStatusZ = z.enum(["draft", "active", "paused", "archived"]);
export const VoiceAgentLanguageZ = z.enum(["de", "tr", "en", "multilingual"]);

export const PromptTemplateKeyZ = z.enum([
  "generic_receptionist",
  "appointment_business",
  "restaurant_reservation",
  "restaurant_order",
  "clinic",
  "hotel",
]);

export const VoiceCallStatusZ = z.enum([
  "ringing",
  "in_progress",
  "ended",
  "failed",
  "busy",
  "no_answer",
]);
export const VoiceCallOutcomeTypeZ = z.enum([
  "appointment_booked",
  "order_placed",
  "callback_requested",
  "info_provided",
  "transferred",
  "no_action",
  "error",
]);
export const VoiceCallProcessingStatusZ = z.enum([
  "pending",
  "processing",
  "done",
  "failed",
]);
export const VoiceCallDispositionZ = z.enum([
  "answered",
  "voicemail",
  "transferred",
  "abandoned",
]);
export const VoiceCallDirectionZ = z.enum(["inbound", "outbound"]);

export const VoiceBusinessHoursAiModeZ = z.enum([
  "always_on",
  "overflow",
  "outside_hours",
  "manual_off",
]);

export const VoiceHandoffTriggerTypeZ = z.enum([
  "keyword",
  "sentiment",
  "duration",
  "dtmf",
  "topic",
]);
export const VoiceHandoffActionTypeZ = z.enum([
  "transfer_call",
  "send_sms",
  "send_email",
  "create_callback_task",
]);

export const VoiceKnowledgeBaseItemTypeZ = z.enum([
  "faq",
  "menu",
  "pricing",
  "policy",
  "team",
  "location",
  "custom",
]);

export const VoiceAppointmentBookingTypeZ = z.enum([
  "direct_cal",
  "direct_url",
  "email_request",
  "phone_callback",
]);
export const VoiceAppointmentConflictPolicyZ = z.enum([
  "reject",
  "offer_next",
  "waitlist",
]);

export const VoiceIntegrationTypeZ = z.enum([
  "cal_com",
  "google_calendar",
  "custom_webhook",
  "email_only",
]);
export const VoiceIntegrationStatusZ = z.enum(["active", "inactive", "error"]);

export const VoiceNotificationChannelTypeZ = z.enum([
  "email",
  "telegram",
  "whatsapp",
  "webhook",
]);
export const VoiceNotificationTriggerZ = z.enum([
  "call_ended",
  "appointment_booked",
  "order_placed",
  "callback_requested",
  "handoff_triggered",
  "error",
]);

export const VoiceProviderNameZ = z.enum(["retell", "vapi", "mock"]);

export const VoiceTestRunStatusZ = z.enum(["initiated", "completed", "failed"]);

export const BusinessCategoryZ = z.enum([
  "restaurant",
  "clinic",
  "hotel",
  "generic",
  "appointment",
]);

// ---------------------------------------------------------------------------
// Runtime constant arrays mirroring the Zod options. Used for guards in code
// that runs before validation (e.g. lookup tables, fallback enums).
// ---------------------------------------------------------------------------

export const VOICE_TENANT_MODES = VoiceTenantModeZ.options;
export const VOICE_TENANT_STATUSES = VoiceTenantStatusZ.options;
export const VOICE_AGENT_STATUSES = VoiceAgentStatusZ.options;
export const VOICE_AGENT_LANGUAGES = VoiceAgentLanguageZ.options;
export const PROMPT_TEMPLATE_KEYS = PromptTemplateKeyZ.options;
export const VOICE_CALL_STATUSES = VoiceCallStatusZ.options;
export const VOICE_CALL_OUTCOME_TYPES = VoiceCallOutcomeTypeZ.options;
export const VOICE_CALL_PROCESSING_STATUSES = VoiceCallProcessingStatusZ.options;
export const VOICE_CALL_DISPOSITIONS = VoiceCallDispositionZ.options;
export const VOICE_CALL_DIRECTIONS = VoiceCallDirectionZ.options;
export const VOICE_BUSINESS_HOURS_AI_MODES = VoiceBusinessHoursAiModeZ.options;
export const VOICE_HANDOFF_TRIGGER_TYPES = VoiceHandoffTriggerTypeZ.options;
export const VOICE_HANDOFF_ACTION_TYPES = VoiceHandoffActionTypeZ.options;
export const VOICE_KNOWLEDGE_BASE_ITEM_TYPES = VoiceKnowledgeBaseItemTypeZ.options;
export const VOICE_APPOINTMENT_BOOKING_TYPES = VoiceAppointmentBookingTypeZ.options;
export const VOICE_APPOINTMENT_CONFLICT_POLICIES = VoiceAppointmentConflictPolicyZ.options;
export const VOICE_INTEGRATION_TYPES = VoiceIntegrationTypeZ.options;
export const VOICE_INTEGRATION_STATUSES = VoiceIntegrationStatusZ.options;
export const VOICE_NOTIFICATION_CHANNEL_TYPES = VoiceNotificationChannelTypeZ.options;
export const VOICE_NOTIFICATION_TRIGGERS = VoiceNotificationTriggerZ.options;
export const VOICE_PROVIDER_NAMES = VoiceProviderNameZ.options;
export const VOICE_TEST_RUN_STATUSES = VoiceTestRunStatusZ.options;
export const BUSINESS_CATEGORIES = BusinessCategoryZ.options;

// ---------------------------------------------------------------------------
// Common reusable primitives.
// ---------------------------------------------------------------------------

const slugZ = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i, "must be a slug");

const e164Z = z
  .string()
  .regex(/^\+[1-9]\d{6,14}$/, "must be E.164 (+CCXXXXXXXX)");

const emailZ = z.string().email().max(254);

const timezoneZ = z.string().min(2).max(64);

// ---------------------------------------------------------------------------
// CRUD input schemas.
// ---------------------------------------------------------------------------

export const CreateVoiceTenantZ = z.object({
  slug: slugZ,
  businessName: z.string().min(1).max(120),
  contactEmail: emailZ,
  contactPhone: e164Z.optional(),
  timezone: timezoneZ.optional(),
  locale: z.string().min(2).max(8).optional(),
  mode: VoiceTenantModeZ.optional(),
  businessCategory: BusinessCategoryZ.optional(),
  businessDescription: z.string().max(2000).optional(),
  businessAddress: z.string().max(500).optional(),
});
export type CreateVoiceTenantInput = z.infer<typeof CreateVoiceTenantZ>;

export const UpdateVoiceTenantZ = CreateVoiceTenantZ.partial().extend({
  status: VoiceTenantStatusZ.optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
});
export type UpdateVoiceTenantInput = z.infer<typeof UpdateVoiceTenantZ>;

export const CreateVoiceAgentZ = z.object({
  name: z.string().min(1).max(80),
  displayName: z.string().min(1).max(80),
  language: VoiceAgentLanguageZ.optional(),
  voiceId: z.string().min(1).max(120).optional(),
  promptTemplate: PromptTemplateKeyZ,
  systemPrompt: z.string().max(20000).optional(),
  maxDurationSeconds: z.number().int().min(60).max(7200).optional(),
  responseDelayMs: z.number().int().min(0).max(5000).optional(),
  interruptionSensitivity: z.number().min(0).max(1).optional(),
  endCallPhrases: z.array(z.string().min(1).max(120)).max(20).optional(),
  dtmfHandoffDigit: z
    .string()
    .regex(/^[0-9*#]$/, "must be a single DTMF digit")
    .optional(),
  ambientSoundEnabled: z.boolean().optional(),
  providerOverrides: z.record(z.string(), z.unknown()).optional(),
});
export type CreateVoiceAgentInput = z.infer<typeof CreateVoiceAgentZ>;

export const UpdateVoiceAgentZ = CreateVoiceAgentZ.partial().extend({
  status: VoiceAgentStatusZ.optional(),
  providerOverrides: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateVoiceAgentInput = z.infer<typeof UpdateVoiceAgentZ>;

export const CreateHandoffRuleZ = z.object({
  name: z.string().min(1).max(80),
  isActive: z.boolean().default(true),
  triggerType: VoiceHandoffTriggerTypeZ,
  triggerValue: z.string().max(500).optional(),
  actionType: VoiceHandoffActionTypeZ,
  actionConfig: z.record(z.string(), z.unknown()).optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});
export type CreateHandoffRuleInput = z.infer<typeof CreateHandoffRuleZ>;

export const CreateKnowledgeBaseItemZ = z.object({
  itemType: VoiceKnowledgeBaseItemTypeZ,
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});
export type CreateKnowledgeBaseItemInput = z.infer<typeof CreateKnowledgeBaseItemZ>;

export const CreatePhoneNumberZ = z.object({
  e164Number: e164Z,
  friendlyName: z.string().max(80).optional(),
  agentId: z.string().min(1).max(64).optional(),
  country: z
    .string()
    .regex(/^[A-Z]{2}$/, "must be ISO 3166-1 alpha-2")
    .optional(),
});
export type CreatePhoneNumberInput = z.infer<typeof CreatePhoneNumberZ>;

export const CreateBusinessHoursZ = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM"),
  isClosed: z.boolean().optional(),
  isOverride: z.boolean().optional(),
  overrideDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
    .optional(),
  overrideLabel: z.string().max(80).optional(),
  aiMode: VoiceBusinessHoursAiModeZ.optional(),
});
export type CreateBusinessHoursInput = z.infer<typeof CreateBusinessHoursZ>;

export const CreateAppointmentRuleZ = z.object({
  name: z.string().min(1).max(80),
  isActive: z.boolean().optional(),
  bookingType: VoiceAppointmentBookingTypeZ,
  calApiKey: z.string().max(200).optional(),
  calEventTypeId: z.number().int().positive().optional(),
  bookingUrl: z.string().url().max(500).optional(),
  bufferMinutes: z.number().int().min(0).max(720).optional(),
  minNoticeMinutes: z.number().int().min(0).max(43_200).optional(),
  maxDaysAhead: z.number().int().min(1).max(365).optional(),
  slotDurationMin: z.number().int().min(5).max(720).optional(),
  conflictPolicy: VoiceAppointmentConflictPolicyZ.optional(),
  confirmationMsg: z.string().max(2000).optional(),
  requireFields: z.array(z.string().min(1).max(40)).max(20).optional(),
});
export type CreateAppointmentRuleInput = z.infer<typeof CreateAppointmentRuleZ>;

export const CreateIntegrationZ = z.object({
  integrationType: VoiceIntegrationTypeZ,
  label: z.string().max(80).optional(),
  credentialsJson: z.record(z.string(), z.unknown()).optional(),
  configJson: z.record(z.string(), z.unknown()).optional(),
});
export type CreateIntegrationInput = z.infer<typeof CreateIntegrationZ>;

export const CreateNotificationConfigZ = z.object({
  channelType: VoiceNotificationChannelTypeZ,
  label: z.string().max(80).optional(),
  isActive: z.boolean().optional(),
  triggerOn: z.array(VoiceNotificationTriggerZ).min(1).max(10),
  config: z.record(z.string(), z.unknown()),
});
export type CreateNotificationConfigInput = z.infer<typeof CreateNotificationConfigZ>;
