# AI-Powered Prompt Engineering Assistant

> **© 2026 Poonam Tiwari — All Rights Reserved**  
> This repository is public for **portfolio and interview review only**.  
> **Not open source.** Copying, redistribution, commercial use, and reuse as your own project are **not permitted** without written permission. See [LICENSE](./LICENSE).

**Author:** [Poonam Tiwari](https://github.com/ponamtiwari) — Senior Software Engineer

A full-stack-ready, client-side web application that transforms rough user inputs into clear, professional AI prompts. Built with React, TypeScript, and OpenAI integration, it demonstrates modern frontend architecture, multilingual NLP workflows, and production-minded testing practices.

---

## Project Overview

**AI-Powered Prompt Engineering Assistant** helps users write better prompts for AI tools such as ChatGPT, Gemini, and Claude. Users type or speak a rough idea; the app corrects grammar in real time, classifies the request by domain (email, resume, code, marketing, HR, and 25+ more), and produces a structured, professional prompt ready to copy or send to external AI platforms.

This project showcases skills relevant to **frontend development**, **AI integration**, **internationalization**, and **quality engineering**—ideal for portfolio review in software engineering and full-stack roles.

📚 **[Full documentation →](./docs/README.md)**

---

## Key Features

| Feature | Description |
|--------|-------------|
| **Real-time grammar correction** | Detects spelling, grammar, and style issues as the user types, with accept/dismiss suggestions |
| **Multilingual support** | 30+ languages including English, Hindi, Gujarati, Bengali, Tamil, Arabic, Japanese, and European languages |
| **Domain-aware prompt enhancement** | Automatically classifies prompts and applies industry-specific templates (email, resume, code, legal, finance, SEO, etc.) |
| **Speech-to-text input** | Browser Web Speech API plus OpenAI Whisper fallback for voice prompts |
| **AI-powered enhancement** | Optional OpenAI integration for smarter prompt rewriting, translation, and output generation |
| **Continue with AI** | One-click copy and launch to ChatGPT, Gemini, Bolt.new, DeepSeek, Lovable, or Cline |
| **Export options** | Download enhanced prompts as `.txt` or `.docx` |
| **Comprehensive test suite** | Vitest unit, integration, performance, edge-case, and multilingual tests for grammar and speech |

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Build tool** | Vite 5 |
| **AI / NLP** | OpenAI API (GPT-3.5-turbo, Whisper) |
| **Icons** | Lucide React |
| **Testing** | Vitest, Testing Library, jsdom |
| **Linting** | ESLint 9, TypeScript ESLint |

---

## Architecture

```
User Input (text / voice)
        │
        ▼
┌───────────────────┐
│ Language Detector │  ← Pattern & script-based detection
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Grammar Corrector │  ← Local rules + optional OpenAI
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Domain Classifier │  ← 30+ professional domains
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Prompt Templates  │  ← English structured prompts
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     ┌─────────────────┐
│ OpenAI (optional) │ ──► │ Translation     │  ← Non-English output
└─────────┬─────────┘     └─────────────────┘
          │
          ▼
   Enhanced Prompt → Copy / Export / External AI
```

### Design decisions

- **English-first prompt building, then translation** — Keeps template logic maintainable while supporting multilingual users via OpenAI translation.
- **Graceful degradation** — Core enhancement works without an API key; OpenAI unlocks AI enhancement, translation, Whisper, and live output generation.
- **Client-side storage** — API keys stored in `localStorage` only; no backend required for demo/portfolio deployment.
- **Separation of concerns** — UI in `App.tsx` and components; business logic in `utils/` (grammar, language, enhancement, OpenAI service).

---

## Project Structure

```
Prompt/
├── src/
│   ├── App.tsx                    # Main application & workflow
│   ├── main.tsx                   # React entry point
│   ├── components/
│   │   ├── ApiKeyModal.tsx        # OpenAI key management
│   │   ├── SpeechToTextButton.tsx # Voice input (Web Speech + Whisper)
│   │   ├── LanguageIndicator.tsx  # Detected language display
│   │   └── DownloadButtons.tsx    # TXT / DOCX export
│   ├── utils/
│   │   ├── enhanceMore.ts         # Domain classification & prompt templates
│   │   ├── openaiService.ts       # OpenAI API wrapper
│   │   ├── languageDetector.ts    # Multilingual detection
│   │   ├── enhancedGrammarCorrector.ts
│   │   ├── advancedGrammarCorrector.ts
│   │   └── promptLanguageBuilder.ts
│   └── test/                      # Grammar & speech test suites
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) OpenAI API key for AI enhancement, translation, Whisper, and output generation

### Installation

```bash
git clone <your-repo-url>
cd Prompt
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

### Run tests

```bash
npm run test              # Watch mode
npm run test:run          # Single run (CI)
npm run test:coverage     # With coverage report
npm run test:grammar      # Grammar tests only
```

---

## Usage

1. **Enter a prompt** — Type in the text area or use the microphone button for voice input.
2. **Review grammar suggestions** — Accept corrections or keep your original text.
3. **Click "Enhance Prompt"** — Receive a structured, professional prompt tailored to your domain.
4. **Enhance More** — Apply a second pass for deeper detail (uses AI when an API key is set).
5. **Continue with AI** — Copy the prompt and open your preferred AI platform.
6. **Generate Output** — With an API key, execute the enhanced prompt and get real AI-generated content.

---

## Technical Highlights (for recruiters)

- Built a **multilingual grammar engine** with rule-based correction, confidence scoring, and optional LLM fallback.
- Implemented **domain classification** across 30+ business categories with specialized prompt templates.
- Integrated **OpenAI Chat Completions and Whisper** with error handling, rate-limit awareness, and local API key management.
- Designed **dual speech-to-text paths**: browser-native recognition and cloud transcription.
- Authored **extensive automated tests** covering unit, integration, performance, edge cases, and multilingual scenarios.
- Delivered a **responsive, accessible UI** with Tailwind CSS and clear user feedback (loading states, errors, copy confirmations).

---

## Security Notes

- API keys are stored in the browser's `localStorage` and are never sent to any server other than OpenAI.
- This is a portfolio/demo architecture; production deployments should use a backend proxy for API keys.

---

## Future Enhancements

- Backend API proxy for secure OpenAI key handling
- User authentication and prompt history (Supabase-ready dependency)
- Activate stub components: template selector, history panel, context questions
- GitHub Pages / Vercel deployment pipeline

---

## Documentation

Detailed project documentation is available in the [`docs/`](./docs/) folder:

| Document | Description |
|----------|-------------|
| [Documentation Index](./docs/README.md) | Navigate all docs |
| [Project Overview](./docs/PROJECT_OVERVIEW.md) | Goals, scope, and portfolio context |
| [Features](./docs/FEATURES.md) | Complete feature reference |
| [Architecture](./docs/ARCHITECTURE.md) | System design and data flow |
| [User Guide](./docs/USER_GUIDE.md) | End-user instructions |
| [Developer Guide](./docs/DEVELOPER_GUIDE.md) | Setup and development workflow |
| [API Integration](./docs/API_INTEGRATION.md) | OpenAI integration details |
| [Testing Guide](./docs/TESTING.md) | Test suites and commands |
| [License & Usage](./docs/LICENSE_AND_USAGE.md) | Copyright and permitted use |

---

## License

**© 2026 Poonam Tiwari. All Rights Reserved.**

This project is **not open source**. The repository is public so recruiters and interviewers can review the author's work.

**Permitted:** viewing the code for portfolio, hiring, or interview evaluation.

**Not permitted without written permission:** copying, cloning for reuse, modifying, redistributing, commercial use, or presenting this code as your own work.

Full terms: [LICENSE](./LICENSE) · [License & Usage Policy](./docs/LICENSE_AND_USAGE.md)

---

## Contact

**Poonam Tiwari**  
Senior Software Engineer

*Built as a portfolio project demonstrating React, TypeScript, AI integration, and test-driven development.*
