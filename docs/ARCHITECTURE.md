# Architecture

Technical architecture of **AI-Powered Prompt Engineering Assistant**.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   React UI  │  │    Utils     │  │  localStorage    │  │
│  │  (App.tsx)  │──│  (Business   │  │  (API Key)       │  │
│  │             │  │   Logic)     │  └──────────────────┘  │
│  └──────┬──────┘  └──────┬───────┘                        │
│         │                │                                  │
│         └────────┬───────┘                                  │
│                  ▼                                          │
│         ┌─────────────────┐                                 │
│         │  OpenAI SDK     │──────► OpenAI API (optional)     │
│         │  (Browser)      │        GPT-3.5 / Whisper         │
│         └─────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

There is **no backend server**. All processing runs in the browser except external OpenAI API calls.

---

## Application Layers

### 1. Presentation Layer (`src/App.tsx`, `src/components/`)

| Component | Responsibility |
|-----------|----------------|
| `App.tsx` | State management, workflow orchestration, all main UI sections |
| `ApiKeyModal.tsx` | OpenAI key input and save |
| `SpeechToTextButton.tsx` | Voice input, language selection, Web Speech / Whisper |
| `LanguageIndicator.tsx` | Display detected or output language |
| `DownloadButtons.tsx` | TXT and DOCX export triggers |

**State managed in App.tsx:**

- `inputPrompt` — User's raw input
- `grammarCorrection` — Correction result object
- `inputLanguage` — Detected language
- `enhancedPrompt` — Final enhanced prompt
- `output` — Template-based sample output
- `apiOutput` — Real OpenAI-generated content
- Loading flags, copy states, modal visibility, errors

### 2. Business Logic Layer (`src/utils/`)

| Module | Responsibility |
|--------|----------------|
| `languageDetector.ts` | Language definitions, pattern matching, detection |
| `advancedGrammarCorrector.ts` | Rule engine, suggestions, confidence scoring |
| `enhancedGrammarCorrector.ts` | Multilingual wrapper, dictionary corrections |
| `enhanceMore.ts` | Domain classification, templates, sample generation |
| `localizedEnhancementTemplates.ts` | Localized template strings by domain |
| `promptLanguageBuilder.ts` | Translation orchestration |
| `openaiService.ts` | OpenAI client, all API methods |
| `speechRecognition.ts` | Web Speech API wrapper |
| `fileDownloader.ts` | Client-side file download utilities |
| `grammarCorrector.ts` | Legacy grammar module (used in tests) |
| `departmentFramework.ts` | Department taxonomy (supporting module) |
| `multilingualEnhancer.ts` | Multilingual enhancement helpers |

### 3. Integration Layer (`openaiService.ts`)

Centralized OpenAI access with:

- `LocalStorageApiKeyStorage` — Key persistence abstraction
- `OpenAIService` — Singleton service instance
- Error normalization (401, 429, 500)
- JSON parsing helpers for structured responses

---

## Data Flow: Enhance Prompt

```
User Input
    │
    ▼
correctGrammarMultilingual()
    │  ├── detectInputLanguage()
    │  └── advancedGrammarCorrector.correctText()
    │
    ▼
enhancePromptWithAI()
    │  ├── enhancePromptSimple()        ← Template (always)
    │  └── openaiService.enhancePromptRequest()  ← AI (optional)
    │
    ▼
localizePrompt()
    │  └── openaiService.translateText()  ← If non-English
    │
    ▼
generateEnhancedOutput()                ← Mock sample output
    │
    ▼
Display Enhanced Prompt + Generated Output
```

---

## Data Flow: Generate Output

```
Enhanced Prompt
    │
    ▼
openaiService.generateOutput()
    │  ├── System prompt: execute task, don't echo prompt
    │  └── Language instruction if non-English
    │
    ▼
AI Generated Output (real content)
```

---

## Domain Classification

`classifyPrompt()` in `enhanceMore.ts` uses regex keyword matching with priority ordering:

1. Core categories (resume, email, design, code) — highest priority
2. Professional domains (HR, legal, finance, etc.)
3. Fallback: `generic`

Each domain maps to:

- Simple enhancement template (first pass)
- Enhanced template (Enhance More pass)
- Sample output generator

---

## Enhancement Strategy

### English-first, translate-later

```
Original (any language)
        │
        ▼
Build prompt in English (templates)
        │
        ▼
Optional AI refinement (English)
        │
        ▼
Translate to target language (OpenAI)
        │
        ▼
Final enhanced prompt
```

**Rationale:** Template maintenance in one language reduces complexity; translation handles localization.

### Graceful degradation

| API Key | Enhancement | Translation | Whisper | Generate Output |
|---------|-------------|-------------|---------|-----------------|
| No | Templates only | Blocked for non-English | Browser speech only | Blocked |
| Yes | Templates + AI | Available | Auto mode available | Available |

---

## Speech Architecture

```
User clicks microphone
        │
        ├── Language = Auto + API key?
        │       YES → MediaRecorder → Blob → Whisper API
        │       NO  → Web Speech API with selected lang
        │
        ▼
Transcript → handleInputChange() → Grammar pipeline
```

---

## File Structure

```
src/
├── App.tsx                 # Main application (824 lines)
├── main.tsx                # React bootstrap
├── index.css               # Global styles + Tailwind
├── components/             # UI components
├── utils/                  # Core business logic
└── test/                   # Vitest test suites
```

---

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React 18 | Component model, ecosystem, hiring relevance |
| Language | TypeScript | Type safety for complex NLP logic |
| Build | Vite | Fast dev server and optimized builds |
| Styling | Tailwind CSS | Rapid responsive UI development |
| State | React useState/useCallback | No external state library needed for SPA scope |
| AI client | OpenAI SDK (browser) | Direct integration for portfolio demo |
| Tests | Vitest | Vite-native, fast, Jest-compatible API |

---

## Security Architecture

| Aspect | Current approach | Production recommendation |
|--------|------------------|---------------------------|
| API keys | Browser localStorage | Backend proxy with env secrets |
| OpenAI calls | Direct from client | Server-side with rate limiting |
| User data | Not persisted | Encrypted storage if history added |
| HTTPS | Required for mic/API | Enforce in deployment |

---

## Future Architecture

Planned evolution:

1. **Backend API** — Node/Express or serverless functions for OpenAI proxy
2. **Supabase** — Auth + prompt history (dependency already in package.json)
3. **Component split** — Extract logic from App.tsx into custom hooks
4. **Stub activation** — Wire up HistoryPanel, TemplateSelector, etc.
