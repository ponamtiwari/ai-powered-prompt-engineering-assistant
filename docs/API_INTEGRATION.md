# API Integration

OpenAI integration reference for **AI-Powered Prompt Engineering Assistant**.

---

## Overview

The application integrates with OpenAI through the official `openai` npm package (v5.x). All API calls originate from the browser using `dangerouslyAllowBrowser: true`.

**Service file:** `src/utils/openaiService.ts`

---

## API Key Management

### Storage

| Property | Value |
|----------|-------|
| Storage mechanism | `localStorage` |
| Key name | `openai_api_key` |
| Interface | `ApiKeyStorage` (abstracted for testability) |
| Implementation | `LocalStorageApiKeyStorage` |

### Methods

```typescript
openaiService.setApiKey(key: string)    // Save and initialize client
openaiService.hasApiKey(): boolean      // Check if key exists
openaiService.removeApiKey()            // Clear key and client
```

### UI flow

1. User clicks **Add API Key** → `ApiKeyModal` opens
2. User enters key → `handleApiKeySave()` → `openaiService.setApiKey()`
3. Header updates to **API Key Set**

---

## OpenAI Methods

### 1. `enhancePromptRequest(metaPrompt: string)`

**Model:** `gpt-3.5-turbo`  
**Temperature:** 0.5  
**Max tokens:** 2000

**Purpose:** Transform rough prompts into structured professional prompts.

**System prompt summary:**
> Expert prompt engineer. Use TASK-CONTEXT-REFERENCE-EVALUATION patterns. Return only the enhanced prompt.

**Used by:**
- `enhancePromptWithAI()` — First enhancement pass
- `handleEnhanceMore()` — Subsequent AI enhancement passes

---

### 2. `generateOutput(enhancedPrompt: string, language?: Language)`

**Model:** `gpt-3.5-turbo`  
**Temperature:** 0.7  
**Max tokens:** 2500

**Purpose:** Execute the enhanced prompt and return final deliverable content.

**System prompt summary:**
> Execute the task described in the prompt. Do NOT echo or rewrite the prompt. Return only completed output.

**Language handling:** Appends `getLanguageInstructions(language)` for non-English output.

**Used by:** `generateApiOutput()` in App.tsx

---

### 3. `translateText(text: string, language: Language)`

**Model:** `gpt-3.5-turbo`  
**Temperature:** 0.2  
**Max tokens:** 2500

**Purpose:** Translate English enhanced prompts to target language.

**Behavior:**
- Returns text unchanged if `language.code === 'en'`
- Preserves markdown, headers, bullet lists

**Used by:** `localizePrompt()` in `promptLanguageBuilder.ts`

---

### 4. `correctTextMultilingual(text: string, languageCode: string)`

**Model:** `gpt-3.5-turbo`  
**Temperature:** 0.2  
**Max tokens:** 800

**Purpose:** AI-based grammar correction returning strict JSON.

**Response format:**
```json
{
  "corrected": "corrected text",
  "suggestions": ["suggestion 1", "suggestion 2"]
}
```

**Used by:** Advanced grammar corrector as fallback for complex cases.

---

### 5. `transcribeAudio(audioBlob: Blob)`

**Model:** `whisper-1`  
**Response format:** `verbose_json`

**Purpose:** Convert recorded audio to text with optional language detection.

**Returns:**
```typescript
{ text: string; language?: string }
```

**Used by:** `SpeechToTextButton` in cloud/Auto mode

**Audio format:** WebM (opus codec preferred)

---

## Error Handling

All methods normalize OpenAI errors through `toServiceError()`:

| HTTP Status | User-facing message |
|-------------|---------------------|
| 401 | Invalid API key. Please check your OpenAI API key. |
| 429 | Rate limit exceeded. Please try again later. |
| 500 | OpenAI service error. Please try again later. |
| Other | `{prefix}: {original message}` |

### App-level error handling

```typescript
// App.tsx
setApiError(message);
if (message.includes('Invalid API key')) {
  setHasApiKey(false);
}
```

---

## When API Key Is Required

| Feature | Without key | With key |
|---------|-------------|----------|
| Grammar (English) | Local rules | Local rules |
| Grammar (complex) | Local rules | Optional AI fallback |
| Prompt enhancement | Templates only | Templates + AI |
| Non-English output | Blocked with modal | Translated |
| Speech Auto mode | Web Speech only | Whisper transcription |
| Generate Output | Blocked | Available |
| Enhance More (2nd+ pass) | Templates only | AI on 2nd+ click |

Check: `requiresTranslationApiKey()` in `promptLanguageBuilder.ts`

---

## Rate Limits & Costs

Users provide their own OpenAI API keys. Typical usage:

| Operation | Approx. tokens | Model |
|-----------|----------------|-------|
| Enhancement | 500–2000 | GPT-3.5-turbo |
| Translation | 500–2500 | GPT-3.5-turbo |
| Output generation | 500–2500 | GPT-3.5-turbo |
| Transcription | Per audio minute | Whisper |

Refer to [OpenAI pricing](https://openai.com/pricing) for current rates.

---

## Security Considerations

### Current (portfolio/demo)

- API key visible in browser DevTools → Application → localStorage
- Key sent directly to OpenAI from client
- Suitable for personal use and demos only

### Recommended (production)

```
Browser → Your Backend API → OpenAI
              │
              └── API key in server environment only
```

Implementation steps:

1. Create backend endpoint (e.g., `/api/enhance`, `/api/generate`)
2. Store `OPENAI_API_KEY` in server environment
3. Add authentication and rate limiting per user
4. Remove `dangerouslyAllowBrowser` from OpenAI client
5. Replace direct calls in `openaiService.ts` with fetch to your API

---

## Testing OpenAI Integration

### Mock in tests

```typescript
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    enhancePromptRequest: vi.fn(),
    generateOutput: vi.fn(),
    translateText: vi.fn(),
    transcribeAudio: vi.fn(),
  }
}));
```

### Manual testing

1. Set a valid API key in the UI
2. Test enhancement with English prompt
3. Test with Hindi/Gujarati prompt (translation)
4. Test Generate Output button
5. Test voice with Auto language selected
6. Test invalid key (should show error)

---

## External Platform Links

The app does not integrate via API with these platforms — it copies prompts and opens URLs:

| Platform | URL |
|----------|-----|
| ChatGPT | https://chat.openai.com/ |
| Gemini | https://gemini.google.com/app |
| Bolt.new | https://bolt.new/ |
| DeepSeek | https://chat.deepseek.com/ |
| Lovable | https://lovable.dev/ |
| Cline | VS Code extension (copy only) |
