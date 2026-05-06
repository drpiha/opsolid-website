// Card Coach — provider-abstracted suggestion engine.
//
// MVP uses RuleBasedProvider (pure local computation, no external API calls).
// The AIProvider interface lets future code swap in OpenAI / Anthropic without
// touching the route or UI. Privacy rule: no card data leaves the server unless
// the user explicitly triggers an AI-backed provider.

import {
  calculateQualityScore,
  type CardOrderForScore,
  type QualitySuggestion,
} from "./card-quality";

export type { QualitySuggestion };

export interface AIProvider {
  analyze(card: CardOrderForScore): Promise<QualitySuggestion[]>;
}

export class RuleBasedProvider implements AIProvider {
  async analyze(card: CardOrderForScore): Promise<QualitySuggestion[]> {
    const result = calculateQualityScore(card);
    return result.suggestions;
  }
}

// Singleton — swap for a different provider at call sites if needed.
const defaultProvider: AIProvider = new RuleBasedProvider();

export async function getCoachSuggestions(
  card: CardOrderForScore,
  provider: AIProvider = defaultProvider,
): Promise<QualitySuggestion[]> {
  return provider.analyze(card);
}
