# API Integration

[[Home]] · [[Architecture]] · [[Troubleshooting]]

---

## Overview

OpenAI integration via `src/utils/openaiService.ts` (official `openai` npm package v5.x).

API key stored in `localStorage` as `openai_api_key`.

---

## Methods

| Method | Model | Purpose |
|--------|-------|---------|
| `enhancePromptRequest()` | GPT-3.5-turbo | Improve prompts |
| `generateOutput()` | GPT-3.5-turbo | Execute prompt, return content |
| `translateText()` | GPT-3.5-turbo | Localize to target language |
| `correctTextMultilingual()` | GPT-3.5-turbo | AI grammar fallback |
| `transcribeAudio()` | whisper-1 | Voice-to-text |

---

## When API key is required

| Feature | Without key | With key |
|---------|-------------|----------|
| English enhancement | Templates | Templates + AI |
| Non-English output | Blocked | Translated |
| Generate Output | Blocked | Available |
| Whisper Auto speech | Web Speech only | Whisper |

---

## Error handling

| Status | Message |
|--------|---------|
| 401 | Invalid API key |
| 429 | Rate limit exceeded |
| 500 | OpenAI service error |

---

## Security (portfolio vs production)

**Current:** Key in browser localStorage, direct OpenAI calls.

**Production recommendation:**
```
Browser → Your backend → OpenAI
```
Never expose API keys in client-side production apps.

---

## External platforms

Copy + open (no API integration):

- ChatGPT, Gemini, Bolt.new, DeepSeek, Lovable, Cline

See [[User Guide]].
