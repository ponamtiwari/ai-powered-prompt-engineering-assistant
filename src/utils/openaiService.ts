import OpenAI from 'openai';
import type { Language } from './languageDetector';
import { getLanguageInstructions } from './languageDetector';

export interface ApiKeyStorage {
  getApiKey(): string | null;
  setApiKey(key: string): void;
  removeApiKey(): void;
}

export class LocalStorageApiKeyStorage implements ApiKeyStorage {
  private readonly storageKey = 'openai_api_key';

  getApiKey(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  setApiKey(key: string): void {
    localStorage.setItem(this.storageKey, key);
  }

  removeApiKey(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export class OpenAIService {
  private apiKeyStorage: ApiKeyStorage;
  private openai: OpenAI | null = null;

  constructor(apiKeyStorage: ApiKeyStorage) {
    this.apiKeyStorage = apiKeyStorage;
    this.initializeClient();
  }

  private initializeClient(): void {
    const apiKey = this.apiKeyStorage.getApiKey();
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKeyStorage.setApiKey(apiKey);
    this.initializeClient();
  }

  hasApiKey(): boolean {
    return !!this.apiKeyStorage.getApiKey();
  }

  async correctTextMultilingual(text: string, languageCode: string): Promise<{ corrected: string; suggestions: string[] }> {
    if (!this.openai) {
      throw new Error('API key not configured');
    }

    const systemPrompt = `You are a professional multilingual editor. Correct grammar, spelling, and style for the user's text in the specified language, preserving meaning and tone. Return STRICT JSON with keys: corrected (string), suggestions (array of concise strings in the same language). Do not include any extra text.`;
    const userPrompt = JSON.stringify({
      language: languageCode,
      text
    });

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 800
      });

      const content = completion.choices[0]?.message?.content || '';

      const parsed = this.parseStrictJson(content);
      const corrected = typeof parsed.corrected === 'string' ? parsed.corrected : text;
      const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.filter((s): s is string => typeof s === 'string') : [];
      return { corrected, suggestions };
    } catch (error: unknown) {
      const status = ((): number | undefined => {
        if (typeof error === 'object' && error && 'status' in error) {
          const s = (error as { status?: unknown }).status;
          return typeof s === 'number' ? s : undefined;
        }
        return undefined;
      })();
      if (status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 500) {
        throw new Error('OpenAI service error. Please try again later.');
      } else {
        const message = error instanceof Error
          ? error.message
          : (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
              ? (error as { message: string }).message
              : 'Unknown error occurred');
        throw new Error(`Grammar correction failed: ${message}`);
      }
    }
  }

  private parseStrictJson(content: string): { corrected?: unknown; suggestions?: unknown[] } {
    // Try direct JSON first
    try {
      return JSON.parse(content);
    } catch {
      // fall through
    }
    // Try to extract from a code block or braces
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fall through
      }
    }
    return {};
  }

  async transcribeAudio(audioBlob: Blob): Promise<{ text: string; language?: string }> {
    if (!this.openai) {
      throw new Error('API key not configured');
    }

    try {
      const file = new File([audioBlob], 'speech.webm', { type: audioBlob.type || 'audio/webm' });
      // Prefer latest transcription-capable model; fall back to whisper-1
      const model = 'whisper-1';

      const resp: unknown = await this.openai.audio.transcriptions.create({
        file,
        model,
        // verbose_json includes detected language and segments when available
        response_format: 'verbose_json'
      });

      // Some SDK versions return resp.text directly; verbose_json returns { text, language }
      const text: string = (typeof resp === 'object' && resp && 'text' in resp && typeof (resp as { text?: unknown }).text === 'string')
        ? (resp as { text: string }).text
        : '';
      const language: string | undefined = (typeof resp === 'object' && resp && 'language' in resp && typeof (resp as { language?: unknown }).language === 'string')
        ? (resp as { language: string }).language
        : undefined;
      if (!text) {
        throw new Error('No transcription returned');
      }
      return { text, language };
    } catch (error: unknown) {
      const status = ((): number | undefined => {
        if (typeof error === 'object' && error && 'status' in error) {
          const s = (error as { status?: unknown }).status;
          return typeof s === 'number' ? s : undefined;
        }
        return undefined;
      })();
      if (status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 500) {
        throw new Error('OpenAI service error. Please try again later.');
      } else {
        const message = error instanceof Error
          ? error.message
          : (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
              ? (error as { message: string }).message
              : 'Unknown error occurred');
        throw new Error(`Transcription failed: ${message}`);
      }
    }
  }

  async translateText(text: string, language: Language): Promise<string> {
    if (!this.openai) {
      throw new Error('API key not configured');
    }
    if (language.code === 'en') {
      return text;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              `You are a professional translator. Translate the entire user message into ${language.name} (${language.nativeName}). ` +
              'Preserve markdown, section headers, bullet lists, and structure. ' +
              'Do not add explanations—output only the translated text.',
          },
          { role: 'user', content: text },
        ],
        max_tokens: 2500,
        temperature: 0.2,
      });

      return completion.choices[0]?.message?.content?.trim() || text;
    } catch (error: unknown) {
      throw this.toServiceError(error, 'Translation failed');
    }
  }

  async enhancePromptRequest(metaPrompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('API key not configured');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert prompt engineer. Transform rough user requests into professional, structured prompts ' +
              'using TASK-CONTEXT-REFERENCE-EVALUATION patterns. Return only the enhanced prompt—never execute the task or add commentary.',
          },
          { role: 'user', content: metaPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error: unknown) {
      throw this.toServiceError(error, 'Prompt enhancement failed');
    }
  }

  async generateOutput(enhancedPrompt: string, language?: Language): Promise<string> {
    if (!this.openai) {
      throw new Error('API key not configured');
    }

    const executionSystemPrompt =
      'You are a helpful AI assistant. The user message contains a detailed task prompt (role, context, requirements). ' +
      'Follow those instructions and produce the FINAL deliverable—email, document, plan, code, report, or other content. ' +
      'Do NOT repeat, rewrite, summarize, or enhance the prompt itself. ' +
      'Do NOT return template structures, meta-instructions, or section headers from the prompt. ' +
      'If the prompt says "return only the enhanced prompt", ignore that—execute the task instead. ' +
      'Return only the completed output ready to use.';

    const languageInstruction = language
      ? `${getLanguageInstructions(language)} Write your entire response only in ${language.name} (${language.nativeName}). Do not use English unless quoting the user's exact words.`
      : undefined;

    const userMessage =
      `Execute the prompt below and produce the final deliverable it describes. ` +
      `Do not echo or rewrite the prompt—only output the completed result.\n\n${enhancedPrompt}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system' as const,
            content: languageInstruction
              ? `${executionSystemPrompt}\n\n${languageInstruction}`
              : executionSystemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 2500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error: unknown) {
      throw this.toServiceError(error, 'API Error');
    }
  }

  private toServiceError(error: unknown, prefix: string): Error {
    const status = ((): number | undefined => {
      if (typeof error === 'object' && error && 'status' in error) {
        const s = (error as { status?: unknown }).status;
        return typeof s === 'number' ? s : undefined;
      }
      return undefined;
    })();
    if (status === 401) {
      return new Error('Invalid API key. Please check your OpenAI API key.');
    }
    if (status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    }
    if (status === 500) {
      return new Error('OpenAI service error. Please try again later.');
    }
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' &&
            error &&
            'message' in error &&
            typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : 'Unknown error occurred';
    return new Error(`${prefix}: ${message}`);
  }

  removeApiKey(): void {
    this.apiKeyStorage.removeApiKey();
    this.openai = null;
  }
}

export const openaiService = new OpenAIService(new LocalStorageApiKeyStorage());