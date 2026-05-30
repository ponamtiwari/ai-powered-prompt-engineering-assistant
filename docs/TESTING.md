# Testing Guide

Testing documentation for **AI-Powered Prompt Engineering Assistant**.

---

## Test Framework

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner (Vite-native) |
| **@testing-library/react** | Component testing |
| **@testing-library/jest-dom** | DOM assertions |
| **@testing-library/user-event** | User interaction simulation |
| **jsdom** | Browser environment simulation |

**Config:** `vitest.config.ts`  
**Setup:** `src/test/setup.ts`

---

## Test File Structure

```
src/test/
├── setup.ts                      # Global test configuration
├── grammarCorrector.test.ts      # Core grammar unit tests
├── grammarIntegration.test.ts    # End-to-end grammar pipeline
├── grammarPerformance.test.ts    # Speed and load tests
├── grammarEdgeCases.test.ts      # Boundary and error cases
├── grammarMultilingual.test.ts   # Language-specific tests
├── grammarTestSuite.test.ts      # Test suite validation
├── speechRecognitionService.test.ts  # Speech service unit tests
├── speechToTextButton.test.tsx   # Speech component tests
├── speechIntegration.test.tsx    # Speech workflow tests
├── speechPerformance.test.tsx    # Speech performance tests
└── README.md                     # Grammar testing reference
```

---

## Running Tests

```bash
# All tests (watch mode)
npm run test

# Single run — use in CI
npm run test:run

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage

# Grammar tests only
npm run test:grammar

# Grammar watch mode
npm run test:grammar:watch
```

---

## Test Categories

### 1. Unit Tests (`grammarCorrector.test.ts`)

- Individual function behavior
- Rule application (articles, spelling, etc.)
- Confidence calculation
- Input/output validation

### 2. Integration Tests (`grammarIntegration.test.ts`)

- Full correction pipeline
- Language detection + correction flow
- Component interaction with grammar utils

### 3. Performance Tests (`grammarPerformance.test.ts`)

- Processing time under 1 second for typical input
- Concurrent request handling
- Memory stability over repeated runs

### 4. Edge Case Tests (`grammarEdgeCases.test.ts`)

- Empty input
- Very long text
- Special characters and Unicode
- Malformed input recovery

### 5. Multilingual Tests (`grammarMultilingual.test.ts`)

- Per-language correction accuracy
- Script detection (Devanagari, Arabic, CJK)
- Language-specific dictionaries

### 6. Speech Tests

- `speechRecognitionService.test.ts` — Service methods
- `speechToTextButton.test.tsx` — Component rendering and interaction
- `speechIntegration.test.tsx` — Full speech workflow
- `speechPerformance.test.tsx` — Speech processing benchmarks

---

## Coverage Targets

| Metric | Target |
|--------|--------|
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |
| Statements | 80% |

Generate report:

```bash
npm run test:coverage
# Open coverage/index.html in browser
```

---

## Mocking Patterns

### Mock OpenAI service

```typescript
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    setApiKey: vi.fn(),
    generateOutput: vi.fn(),
    enhancePromptRequest: vi.fn(),
    translateText: vi.fn(),
    transcribeAudio: vi.fn(),
    correctTextMultilingual: vi.fn(),
  }
}));
```

### Clear mocks between tests

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## Writing New Tests

### AAA pattern

```typescript
it('should correct article errors', async () => {
  // Arrange
  const input = 'I need a apple';
  const language = { code: 'en', name: 'English', nativeName: 'English', patterns: [] };

  // Act
  const result = await advancedGrammarCorrector.correctText(input, language);

  // Assert
  expect(result.corrected).toContain('an apple');
  expect(result.suggestions.length).toBeGreaterThan(0);
});
```

### Async tests

Always use `async/await` for grammar and API-related tests:

```typescript
it('should handle async correction', async () => {
  const result = await correctGrammarMultilingual('test input');
  expect(result).toBeDefined();
});
```

---

## CI Integration

Example GitHub Actions step:

```yaml
- name: Install dependencies
  run: npm ci

- name: Run linter
  run: npm run lint

- name: Run tests
  run: npm run test:run

- name: Build
  run: npm run build
```

---

## Debugging Failed Tests

```bash
# Run specific file
npx vitest run src/test/grammarCorrector.test.ts

# Verbose output
npm run test:grammar

# Run single test
npx vitest run -t "should correct article errors"
```

In VS Code: use Vitest extension for inline test running and debugging.

---

## Related Files

| File | Role |
|------|------|
| `src/utils/grammarTestSuite.ts` | Shared test cases and utilities |
| `src/utils/advancedGrammarCorrector.ts` | Primary grammar engine under test |
| `src/utils/enhancedGrammarCorrector.ts` | Multilingual wrapper under test |
| `vitest.config.ts` | Test environment configuration |
