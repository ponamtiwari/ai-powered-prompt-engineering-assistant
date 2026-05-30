# Developer Guide

Setup, development workflow, and contribution guidelines for **AI-Powered Prompt Engineering Assistant**.

**Author:** Poonam Tiwari

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| Git | Latest |
| Code editor | VS Code recommended |

Optional:

- OpenAI API key for testing AI features
- Chrome or Edge for Web Speech API testing

---

## Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Prompt

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on project files |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Single test run (CI-friendly) |
| `npm run test:ui` | Vitest UI dashboard |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:grammar` | Run grammar test suite only |
| `npm run test:grammar:watch` | Grammar tests in watch mode |

---

## Project Structure

```
Prompt/
├── docs/                    # Project documentation
├── src/
│   ├── App.tsx              # Main app component & state
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/          # React UI components
│   ├── utils/               # Business logic modules
│   └── test/                # Test files
├── index.html               # HTML shell
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Test configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── tsconfig.json            # TypeScript root config
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node/build TypeScript config
├── eslint.config.js         # ESLint flat config
└── package.json
```

---

## Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make changes

- UI changes → `src/App.tsx` or `src/components/`
- Grammar logic → `src/utils/advancedGrammarCorrector.ts`, `enhancedGrammarCorrector.ts`
- Prompt templates → `src/utils/enhanceMore.ts`, `localizedEnhancementTemplates.ts`
- OpenAI integration → `src/utils/openaiService.ts`
- Language support → `src/utils/languageDetector.ts`

### 3. Run tests

```bash
npm run test:run
npm run lint
```

### 4. Build verification

```bash
npm run build
```

### 5. Commit with clear messages

```bash
git add .
git commit -m "feat: describe your change"
```

---

## Key Modules for Developers

### Adding a new prompt domain

1. Add domain type in `enhanceMore.ts` → `PromptDomain` union
2. Add classification rule in `classifyPrompt()`
3. Create `createSimple*Prompt()` and `createEnhanced*Prompt()` functions
4. Add case in `enhancePromptSimple()` and `enhanceMore()` switch statements
5. Add sample generator in `generateEnhancedOutput()` if needed
6. Add tests for classification keywords

### Adding a new language

1. Add language entry in `supportedLanguages` (`languageDetector.ts`)
2. Include Unicode script patterns and common word patterns
3. Add spelling dictionary in `enhancedGrammarCorrector.ts` if needed
4. Add grammar rules in `advancedGrammarCorrector.ts` if applicable
5. Add speech language option in `SpeechToTextButton.tsx`
6. Add multilingual test cases

### Adding a new OpenAI capability

1. Add method to `OpenAIService` class in `openaiService.ts`
2. Handle errors via `toServiceError()` helper
3. Wire into `App.tsx` workflow
4. Mock service in tests

---

## Code Style

- **TypeScript** — Strict typing; avoid `any`
- **React** — Functional components, hooks (`useState`, `useCallback`, `useEffect`)
- **Naming** — camelCase for functions/variables, PascalCase for components
- **Imports** — Type imports with `import type`
- **Comments** — Only for non-obvious business logic
- **Linting** — ESLint 9 flat config; run before commit

---

## Environment Variables

This project does not use `.env` files by default. The OpenAI API key is entered via the UI and stored in `localStorage`.

For future backend integration, create `.env`:

```env
OPENAI_API_KEY=sk-your-key-here
```

Never commit `.env` files (already in `.gitignore`).

---

## Building for Production

```bash
npm run build
```

Output directory: `dist/`

Deploy `dist/` to:

- **Vercel** — Connect GitHub repo, set build command `npm run build`, output `dist`
- **Netlify** — Same as above
- **GitHub Pages** — Use `base` in vite.config if serving from subdirectory
- **XAMPP/Apache** — Copy `dist/` contents to web root

---

## Debugging Tips

| Issue | Where to look |
|-------|---------------|
| Enhancement not working | `enhanceMore.ts`, browser console |
| Grammar not detecting | `advancedGrammarCorrector.ts`, input language |
| OpenAI errors | `openaiService.ts`, Network tab |
| Speech not working | `speechRecognition.ts`, mic permissions |
| Translation blocked | `promptLanguageBuilder.ts`, API key state |

---

## Stub Components

These components return `null` and are reserved for future features:

```
src/components/PromptInput.tsx
src/components/TemplateSelector.tsx
src/components/HistoryPanel.tsx
src/components/ContextQuestions.tsx
src/components/PromptAnalysis.tsx
src/components/EnhancedOutput.tsx
src/components/CategoryCard.tsx
```

To activate: implement component logic and import into `App.tsx`.

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md)
- [API Integration](./API_INTEGRATION.md)
- [Testing Guide](./TESTING.md)
- [Features](./FEATURES.md)
