// Prompt template registry — renders system prompts from per-template builders + tenant context.

import { renderGenericReceptionist } from "./generic-receptionist";
import { renderAppointmentBusiness } from "./appointment-business";
import { renderRestaurantReservation } from "./restaurant-reservation";
import { renderRestaurantOrder } from "./restaurant-order";
import { renderClinic } from "./clinic";
import { renderHotel } from "./hotel";

export type PromptTemplateKey =
  | "generic_receptionist"
  | "appointment_business"
  | "restaurant_reservation"
  | "restaurant_order"
  | "clinic"
  | "hotel";

export interface PromptContext {
  businessName: string;
  agentName?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessCategory?: string;
  timezone?: string;
  locale?: string;
  language?: string;
  contactEmail?: string;
  contactPhone?: string;
  tenantId?: string;
  knowledgeBaseItems?: Array<{
    itemType: string;
    title: string;
    content: string;
  }>;
  handoffRules?: Array<{
    name: string;
    triggerType: string;
    triggerValue?: string | null;
    actionType: string;
  }>;
}

const TEMPLATES: Record<
  PromptTemplateKey,
  (ctx: PromptContext) => string
> = {
  generic_receptionist: renderGenericReceptionist,
  appointment_business: renderAppointmentBusiness,
  restaurant_reservation: renderRestaurantReservation,
  restaurant_order: renderRestaurantOrder,
  clinic: renderClinic,
  hotel: renderHotel,
};

/**
 * Render the full system prompt for a given template + tenant context.
 * Template body comes first, followed by the rendered knowledge base and
 * handoff sections (so the AI sees its core role, then specifics).
 */
export function renderSystemPrompt(
  templateKey: PromptTemplateKey,
  context: PromptContext,
): string {
  const renderer = TEMPLATES[templateKey];
  if (!renderer) {
    throw new Error(`Unknown prompt template: ${templateKey}`);
  }

  const sections: string[] = [renderer(context).trim()];

  const kb = renderKnowledgeBaseSection(context.knowledgeBaseItems);
  if (kb) sections.push(kb);

  const handoff = renderHandoffSection(context.handoffRules);
  if (handoff) sections.push(handoff);

  return sections.join("\n\n");
}

export function renderKnowledgeBaseSection(
  items: PromptContext["knowledgeBaseItems"],
): string {
  if (!items || items.length === 0) return "";

  // Group by itemType so the AI can find e.g. all FAQs together.
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const arr = groups.get(item.itemType) ?? [];
    arr.push(item);
    groups.set(item.itemType, arr);
  }

  const blocks: string[] = ["## Wissensdatenbank"];
  for (const entry of Array.from(groups.entries())) {
    const [itemType, list] = entry;
    blocks.push(`### ${labelType(itemType)}`);
    for (const item of list) {
      blocks.push(`**${item.title}**\n${item.content.trim()}`);
    }
  }
  return blocks.join("\n\n");
}

export function renderHandoffSection(
  rules: PromptContext["handoffRules"],
): string {
  if (!rules || rules.length === 0) return "";

  const lines: string[] = ["## Eskalationsregeln"];
  lines.push(
    "Wenn eine der folgenden Bedingungen zutrifft, leite das Gespräch entsprechend ab:",
  );
  for (const rule of rules) {
    const trigger = rule.triggerValue
      ? `${triggerLabel(rule.triggerType)}: \"${rule.triggerValue}\"`
      : triggerLabel(rule.triggerType);
    lines.push(
      `- **${rule.name}** — Auslöser: ${trigger} → Aktion: ${actionLabel(rule.actionType)}`,
    );
  }
  return lines.join("\n");
}

function labelType(t: string): string {
  switch (t) {
    case "faq":
      return "Häufige Fragen";
    case "menu":
      return "Speisekarte";
    case "pricing":
      return "Preise";
    case "policy":
      return "Richtlinien";
    case "team":
      return "Team";
    case "location":
      return "Standort & Anfahrt";
    case "custom":
    default:
      return "Sonstiges";
  }
}

function triggerLabel(t: string): string {
  switch (t) {
    case "keyword":
      return "Schlüsselwort";
    case "sentiment":
      return "Stimmung";
    case "duration":
      return "Gesprächsdauer";
    case "dtmf":
      return "DTMF-Eingabe";
    case "topic":
      return "Thema";
    default:
      return t;
  }
}

function actionLabel(a: string): string {
  switch (a) {
    case "transfer_call":
      return "Anruf weiterleiten";
    case "send_sms":
      return "SMS an das Team senden";
    case "send_email":
      return "E-Mail an das Team senden";
    case "create_callback_task":
      return "Rückrufaufgabe anlegen";
    default:
      return a;
  }
}
