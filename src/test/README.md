# Grammar Feature Testing Guide

## Overview

This document provides comprehensive testing guidelines for the grammar correction feature, following industry best practices for testing React/TypeScript applications.

## Testing Framework

- **Test Runner**: Vitest
- **Testing Library**: @testing-library/react, @testing-library/jest-dom
- **Coverage**: v8 provider with HTML, JSON, and text reports
- **Mocking**: Vitest built-in mocking capabilities

## Test Structure

### Test Files Organization

```
src/test/
├── setup.ts                    # Global test setup
├── grammarCorrector.test.ts     # Unit tests for core functionality
├── grammarIntegration.test.ts   # Integration tests
├── grammarPerformance.test.ts  # Performance tests
├── grammarEdgeCases.test.ts    # Edge case tests
├── grammarMultilingual.test.ts # Multilingual tests
└── grammarTestSuite.test.ts     # Test suite validation
```

### Test Categories

#### 1. Unit Tests (`grammarCorrector.test.ts`)
- **Purpose**: Test individual functions and methods in isolation
- **Coverage**: Core grammar correction logic, rule application, confidence calculation
- **Mocking**: OpenAI service, external dependencies
- **Focus**: Function behavior, input/output validation, error handling

#### 2. Integration Tests (`grammarIntegration.test.ts`)
- **Purpose**: Test complete workflows and component interactions
- **Coverage**: End-to-end grammar correction pipeline, language detection integration
- **Mocking**: Minimal mocking, focus on real interactions
- **Focus**: Data flow, component integration, API interactions

#### 3. Performance Tests (`grammarPerformance.test.ts`)
- **Purpose**: Ensure the feature meets performance requirements
- **Coverage**: Processing time, memory usage, concurrent requests
- **Mocking**: Disabled AI service for pure performance testing
- **Focus**: Speed, scalability, resource usage

#### 4. Edge Case Tests (`grammarEdgeCases.test.ts`)
- **Purpose**: Test boundary conditions and error scenarios
- **Coverage**: Invalid inputs, extreme values, error recovery
- **Mocking**: Error simulation, malformed data
- **Focus**: Robustness, error handling, graceful degradation

#### 5. Multilingual Tests (`grammarMultilingual.test.ts`)
- **Purpose**: Test language-specific functionality
- **Coverage**: All supported languages, localization, cultural considerations
- **Mocking**: Language-specific rules and patterns
- **Focus**: Language accuracy, cultural sensitivity, localization

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only grammar tests
npm run test:grammar

# Run grammar tests in watch mode
npm run test:grammar:watch
```

### Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Test Best Practices

### 1. Test Naming Convention

```typescript
describe('ComponentName', () => {
  describe('MethodName', () => {
    it('should do something when condition is met', () => {
      // test implementation
    })
  })
})
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should correct article errors', async () => {
  // Arrange
  const inputText = 'I need a apple'
  const language = { code: 'en', name: 'English', nativeName: 'English' }
  
  // Act
  const result = await advancedGrammarCorrector.correctText(inputText, language)
  
  // Assert
  expect(result.suggestions.length).toBeGreaterThan(0)
  expect(result.suggestions[0].rule).toBe('article_vowel')
})
```

### 3. Mocking Guidelines

```typescript
// Mock external services
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    generateOutput: vi.fn()
  }
}))

// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
```

### 4. Async Testing

```typescript
it('should handle async operations', async () => {
  const result = await advancedGrammarCorrector.correctText(text, language)
  expect(result).toBeDefined()
})
```

### 5. Error Testing

```typescript
it('should handle errors gracefully', async () => {
  vi.mocked(openaiService.generateOutput).mockRejectedValue(new Error('API Error'))
  
  const result = await advancedGrammarCorrector.correctText(text, language)
  
  expect(result.suggestions).toBeDefined()
  expect(result.confidence).toBeGreaterThan(0)
})
```

## Test Data Management

### 1. Test Cases

```typescript
const testCases = [
  {
    input: 'I need a apple',
    expected: 'an apple',
    language: 'en',
    description: 'English: Article correction'
  }
]
```

### 2. Fixtures

```typescript
const createTestLanguage = (code: string) => ({
  code,
  name: 'Test Language',
  nativeName: 'Test Language'
})
```

### 3. Test Data Validation

```typescript
it('should have valid test cases', () => {
  testCases.forEach(testCase => {
    expect(testCase.input).toBeDefined()
    expect(testCase.language).toMatch(/^[a-z]{2}$/)
    expect(testCase.expectedCorrections).toBeGreaterThanOrEqual(0)
  })
})
```

## Performance Testing Guidelines

### 1. Timing Tests

```typescript
it('should complete within reasonable time', async () => {
  const startTime = performance.now()
  await advancedGrammarCorrector.correctText(text, language)
  const endTime = performance.now()
  
  expect(endTime - startTime).toBeLessThan(1000) // 1 second
})
```

### 2. Load Testing

```typescript
it('should handle concurrent requests', async () => {
  const promises = Array(10).fill(null).map(() => 
    advancedGrammarCorrector.correctText(text, language)
  )
  
  const results = await Promise.all(promises)
  expect(results).toHaveLength(10)
})
```

### 3. Memory Testing

```typescript
it('should not leak memory', async () => {
  for (let i = 0; i < 100; i++) {
    await advancedGrammarCorrector.correctText(text, language)
  }
  // If we get here without memory issues, test passes
  expect(true).toBe(true)
})
```

## Multilingual Testing

### 1. Language Coverage

```typescript
const supportedLanguages = ['en', 'es', 'fr', 'de', 'hi', 'ja', 'zh']

supportedLanguages.forEach(lang => {
  it(`should handle ${lang} language`, async () => {
    const language = { code: lang, name: 'Test', nativeName: 'Test' }
    const result = await advancedGrammarCorrector.correctText(text, language)
    
    expect(result.language.code).toBe(lang)
  })
})
```

### 2. Localization Testing

```typescript
it('should provide localized messages', () => {
  const message = corrector.getLocalizedMessage('grammarFixed', language)
  expect(message).toBeDefined()
  expect(message.length).toBeGreaterThan(0)
})
```

## Continuous Integration

### 1. Pre-commit Hooks

```bash
# Run tests before commit
npm run test:run
npm run lint
```

### 2. CI Pipeline

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm run test:run
    npm run test:coverage
```

### 3. Coverage Reporting

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

## Debugging Tests

### 1. Test Debugging

```typescript
it('should debug test', async () => {
  console.log('Debug information:', debugData)
  debugger // Set breakpoint
  const result = await advancedGrammarCorrector.correctText(text, language)
  expect(result).toBeDefined()
})
```

### 2. Test Isolation

```typescript
describe.only('Specific Test', () => {
  // Only this test will run
})

it.only('Specific Test Case', () => {
  // Only this test case will run
})
```

### 3. Test Skipping

```typescript
it.skip('Skipped Test', () => {
  // This test will be skipped
})

it.todo('Todo Test', () => {
  // This test is marked as todo
})
```

## Maintenance Guidelines

### 1. Test Updates

- Update tests when adding new features
- Maintain test coverage above 80%
- Review and update test data regularly
- Remove obsolete tests

### 2. Test Documentation

- Document complex test scenarios
- Maintain test case descriptions
- Update this guide when adding new test patterns

### 3. Performance Monitoring

- Monitor test execution time
- Track coverage trends
- Identify slow tests
- Optimize test performance

## Common Issues and Solutions

### 1. Async Test Issues

```typescript
// Problem: Test completes before async operation
it('should handle async', () => {
  advancedGrammarCorrector.correctText(text, language) // Missing await
  expect(result).toBeDefined() // result is undefined
})

// Solution: Use async/await
it('should handle async', async () => {
  const result = await advancedGrammarCorrector.correctText(text, language)
  expect(result).toBeDefined()
})
```

### 2. Mock Issues

```typescript
// Problem: Mock not working
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: () => false // Not a mock function
  }
}))

// Solution: Use vi.fn()
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false)
  }
}))
```

### 3. Test Isolation

```typescript
// Problem: Tests affecting each other
beforeEach(() => {
  // Missing cleanup
})

// Solution: Proper cleanup
beforeEach(() => {
  vi.clearAllMocks()
  // Reset any global state
})
```

## Conclusion

This testing guide provides comprehensive coverage for the grammar correction feature. Follow these guidelines to ensure robust, maintainable, and reliable tests that catch bugs early and provide confidence in the codebase quality.

For questions or updates to this guide, please refer to the development team or update this document accordingly.
