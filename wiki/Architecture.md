# Architecture

[[Home]] · [[Developer Guide]] · [[API Integration]]

---

## High-level design

```
Browser (Client)
├── React UI (App.tsx)
├── Utils (grammar, language, enhancement)
├── localStorage (API key)
└── OpenAI SDK → OpenAI API (optional)
```

No backend server. All logic runs in the browser.

---

## Layers

### Presentation (`src/App.tsx`, `src/components/`)

| Component | Role |
|-----------|------|
| `App.tsx` | State, workflow, main UI |
| `ApiKeyModal` | OpenAI key management |
| `SpeechToTextButton` | Voice input |
| `LanguageIndicator` | Language display |
| `DownloadButtons` | TXT/DOCX export |

### Business logic (`src/utils/`)

| Module | Role |
|--------|------|
| `languageDetector.ts` | Language detection |
| `advancedGrammarCorrector.ts` | Rule engine |
| `enhancedGrammarCorrector.ts` | Multilingual wrapper |
| `enhanceMore.ts` | Classification + templates |
| `promptLanguageBuilder.ts` | Translation |
| `openaiService.ts` | OpenAI client |
| `speechRecognition.ts` | Web Speech API |

---

## Data flow: Enhance prompt

```
Input
  → correctGrammarMultilingual()
  → enhancePromptWithAI()
  → localizePrompt()
  → generateEnhancedOutput()
  → Display
```

---

## English-first strategy

1. Build prompt in English (templates)
2. Optional AI refinement (English)
3. Translate to target language (OpenAI)

---

## Graceful degradation

| Feature | No API key | With API key |
|---------|------------|--------------|
| English enhancement | ✅ Templates | ✅ Templates + AI |
| Non-English output | ❌ Blocked | ✅ Translated |
| Generate Output | ❌ | ✅ |
| Whisper Auto speech | ❌ | ✅ |

---

## Speech flow

```
Mic click
  → Auto + API key? → Whisper
  → Else → Web Speech API
  → Transcript → Grammar pipeline
```

See [[Developer Guide]] for extending domains and languages.
