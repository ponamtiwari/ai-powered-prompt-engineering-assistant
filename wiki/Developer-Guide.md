# Developer Guide

[[Home]] · [[Architecture]] · [[Testing]]

**Author:** Poonam Tiwari — Senior Software Engineer

---

## Prerequisites

- Node.js 18+
- npm 9+
- Git

---

## Setup

```bash
git clone https://github.com/ponamtiwari/ai-powered-prompt-engineering-assistant.git
cd ai-powered-prompt-engineering-assistant
npm install
npm run dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest watch |
| `npm run test:run` | Single test run |
| `npm run test:coverage` | Coverage report |
| `npm run test:grammar` | Grammar tests only |

---

## Project structure

```
src/
├── App.tsx           # Main app
├── components/       # UI components
├── utils/            # Business logic
└── test/             # Vitest suites
docs/                 # Repository documentation
wiki/                 # GitHub Wiki source (this wiki)
```

---

## Extend the project

### Add a prompt domain

1. Add type in `enhanceMore.ts` → `PromptDomain`
2. Add rule in `classifyPrompt()`
3. Create simple + enhanced template functions
4. Wire into switch statements
5. Add tests

### Add a language

1. Add to `supportedLanguages` in `languageDetector.ts`
2. Add dictionary in `enhancedGrammarCorrector.ts`
3. Add speech option in `SpeechToTextButton.tsx`
4. Add multilingual tests

### Add OpenAI capability

1. Add method in `openaiService.ts`
2. Wire into `App.tsx`
3. Mock in tests

---

## Stub components (future)

These return `null` today:

- `PromptInput`, `TemplateSelector`, `HistoryPanel`
- `ContextQuestions`, `PromptAnalysis`, `EnhancedOutput`, `CategoryCard`

---

## Deploy

Build output: `dist/`

Deploy to Vercel, Netlify, or any static host.

See [[Architecture]] and [[API Integration]].
