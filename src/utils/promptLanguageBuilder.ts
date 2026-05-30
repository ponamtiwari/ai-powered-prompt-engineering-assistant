import type { Language } from './languageDetector';
import { openaiService } from './openaiService';

export function needsTranslation(language: Language): boolean {
  return language.code !== 'en';
}

export function requiresTranslationApiKey(language: Language): boolean {
  return needsTranslation(language) && !openaiService.hasApiKey();
}

/**
 * Translates a fully-built English prompt into the target language via OpenAI.
 * English prompts are returned unchanged.
 */
export async function localizePrompt(englishPrompt: string, language: Language): Promise<string> {
  if (!needsTranslation(language)) {
    return englishPrompt;
  }
  return openaiService.translateText(englishPrompt, language);
}
