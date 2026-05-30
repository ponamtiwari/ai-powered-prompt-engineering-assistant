# Testing

[[Home]] · [[Developer Guide]]

---

## Framework

| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| Testing Library | Component tests |
| jsdom | Browser simulation |

**Config:** `vitest.config.ts`  
**Setup:** `src/test/setup.ts`

---

## Test files

```
src/test/
├── grammarCorrector.test.ts
├── grammarIntegration.test.ts
├── grammarPerformance.test.ts
├── grammarEdgeCases.test.ts
├── grammarMultilingual.test.ts
├── grammarTestSuite.test.ts
├── speechRecognitionService.test.ts
├── speechToTextButton.test.tsx
├── speechIntegration.test.tsx
└── speechPerformance.test.tsx
```

---

## Commands

```bash
npm run test              # Watch mode
npm run test:run          # CI single run
npm run test:coverage     # Coverage report
npm run test:grammar      # Grammar only
```

---

## Coverage targets

| Metric | Target |
|--------|--------|
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |
| Statements | 80% |

---

## Mock OpenAI in tests

```typescript
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    generateOutput: vi.fn(),
  }
}));
```

See `src/test/README.md` in the repository for full testing guide.
