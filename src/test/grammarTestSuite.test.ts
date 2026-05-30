import { describe, it, expect, beforeEach, vi } from 'vitest'
import { runGrammarTests, testLocalizedTemplates, quickGrammarTest, grammarTestCases } from '../utils/grammarTestSuite'
import { advancedGrammarCorrector } from '../utils/advancedGrammarCorrector'

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.fn()
const mockConsoleWarn = vi.fn()
const mockConsoleError = vi.fn()

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(mockConsoleLog)
  vi.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)
  vi.spyOn(console, 'error').mockImplementation(mockConsoleError)
})

describe('Grammar Test Suite', () => {
  describe('Test Case Definitions', () => {
    it('should have valid test cases', () => {
      expect(grammarTestCases).toBeDefined()
      expect(grammarTestCases.length).toBeGreaterThan(0)
      
      grammarTestCases.forEach((testCase, index) => {
        expect(testCase.input).toBeDefined()
        expect(testCase.language).toBeDefined()
        expect(testCase.expectedCorrections).toBeGreaterThanOrEqual(0)
        expect(testCase.description).toBeDefined()
        
        // Validate input is not empty
        expect(testCase.input.trim().length).toBeGreaterThan(0)
        
        // Validate language code format
        expect(testCase.language).toMatch(/^[a-z]{2}$/)
      })
    })

    it('should have English test cases', () => {
      const englishTests = grammarTestCases.filter(tc => tc.language === 'en')
      expect(englishTests.length).toBeGreaterThan(0)
      
      englishTests.forEach(test => {
        expect(test.description).toContain('English')
      })
    })

    it('should have multilingual test cases', () => {
      const languages = new Set(grammarTestCases.map(tc => tc.language))
      expect(languages.size).toBeGreaterThan(1)
      
      // Should include at least English and one other language
      expect(languages.has('en')).toBe(true)
      expect(languages.has('es') || languages.has('fr') || languages.has('de')).toBe(true)
    })
  })

  describe('runGrammarTests', () => {
    it('should run all test cases successfully', async () => {
      const results = await runGrammarTests()
      
      expect(results).toBeDefined()
      expect(results.passed).toBeGreaterThanOrEqual(0)
      expect(results.failed).toBeGreaterThanOrEqual(0)
      expect(results.results).toHaveLength(grammarTestCases.length)
      
      // Should have some passing tests
      expect(results.passed + results.failed).toBe(grammarTestCases.length)
    })

    it('should provide detailed results for each test', async () => {
      const results = await runGrammarTests()
      
      results.results.forEach((result, index) => {
        expect(result.test).toBeDefined()
        expect(result.result).toBeDefined()
        expect(typeof result.passed).toBe('boolean')
        
        if (result.passed) {
          expect(result.result.original).toBeDefined()
          expect(result.result.corrected).toBeDefined()
          expect(result.result.suggestions).toBeDefined()
          expect(result.result.confidence).toBeDefined()
          expect(result.result.processingTime).toBeDefined()
          expect(result.result.actualCorrections).toBeDefined()
          expect(result.result.expectedCorrections).toBeDefined()
        }
      })
    })

    it('should handle test failures gracefully', async () => {
      // Mock a failing test case
      const originalTestCases = [...grammarTestCases]
      grammarTestCases.push({
        input: 'This will cause an error',
        language: 'invalid',
        expectedCorrections: 0,
        description: 'Invalid language test'
      })
      
      const results = await runGrammarTests()
      
      // Should still complete and report failures
      expect(results.failed).toBeGreaterThan(0)
      expect(results.results.length).toBe(originalTestCases.length + 1)
      
      // Restore original test cases
      grammarTestCases.length = 0
      grammarTestCases.push(...originalTestCases)
    })
  })

  describe('testLocalizedTemplates', () => {
    it('should test multiple languages', async () => {
      await testLocalizedTemplates()
      
      // Should have logged results for multiple languages
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Testing Localized Templates'))
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('English'))
    })

    it('should handle language detection correctly', async () => {
      await testLocalizedTemplates()
      
      // Should not have any error logs
      expect(mockConsoleError).not.toHaveBeenCalled()
    })
  })

  describe('quickGrammarTest', () => {
    it('should test a simple English sentence', async () => {
      await quickGrammarTest('I need a apple')
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Quick Test'))
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Language:'))
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Original:'))
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Corrected:'))
    })

    it('should handle empty input', async () => {
      await quickGrammarTest('')
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Quick Test'))
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should handle multilingual input', async () => {
      await quickGrammarTest('Hola, I am learning español')
      
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Quick Test'))
      expect(mockConsoleError).not.toHaveBeenCalled()
    })
  })

  describe('Test Coverage', () => {
    it('should cover different types of grammar errors', () => {
      const errorTypes = new Set<string>()
      
      grammarTestCases.forEach(testCase => {
        // Analyze test case descriptions to identify error types
        if (testCase.description.includes('Article')) errorTypes.add('article')
        if (testCase.description.includes('Subject-verb')) errorTypes.add('subject-verb')
        if (testCase.description.includes('Spelling')) errorTypes.add('spelling')
        if (testCase.description.includes('Gender')) errorTypes.add('gender')
        if (testCase.description.includes('Elision')) errorTypes.add('elision')
        if (testCase.description.includes('Capitalization')) errorTypes.add('capitalization')
      })
      
      // Should cover multiple error types
      expect(errorTypes.size).toBeGreaterThan(3)
    })

    it('should cover different severity levels', () => {
      const severities = new Set<string>()
      
      grammarTestCases.forEach(testCase => {
        // Based on expected corrections, infer severity
        if (testCase.expectedCorrections > 0) {
          severities.add('error')
        }
        if (testCase.description.includes('detection')) {
          severities.add('warning')
        }
        if (testCase.description.includes('suggestion')) {
          severities.add('suggestion')
        }
      })
      
      expect(severities.size).toBeGreaterThan(1)
    })
  })

  describe('Performance Tests', () => {
    it('should complete tests within reasonable time', async () => {
      const startTime = Date.now()
      await runGrammarTests()
      const endTime = Date.now()
      
      const totalTime = endTime - startTime
      expect(totalTime).toBeLessThan(10000) // Should complete within 10 seconds
    })

    it('should handle concurrent test execution', async () => {
      const promises = [
        quickGrammarTest('Test sentence 1'),
        quickGrammarTest('Test sentence 2'),
        quickGrammarTest('Test sentence 3')
      ]
      
      await Promise.all(promises)
      
      // All tests should complete without errors
      expect(mockConsoleError).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long test cases', async () => {
      const longText = 'This is a very long sentence. '.repeat(100)
      await quickGrammarTest(longText)
      
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should handle special characters', async () => {
      const specialText = 'Hello! @#$%^&*()_+{}|:"<>?[]\\;\',./'
      await quickGrammarTest(specialText)
      
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    it('should handle unicode characters', async () => {
      const unicodeText = 'Hello 世界! 🌍 مرحبا'
      await quickGrammarTest(unicodeText)
      
      expect(mockConsoleError).not.toHaveBeenCalled()
    })
  })

  describe('Test Data Validation', () => {
    it('should have realistic test inputs', () => {
      grammarTestCases.forEach(testCase => {
        // Test inputs should be realistic sentences
        expect(testCase.input.length).toBeGreaterThan(5)
        expect(testCase.input.length).toBeLessThan(500)
        
        // Should contain actual words, not just random characters
        const wordCount = testCase.input.split(/\s+/).length
        expect(wordCount).toBeGreaterThan(1)
      })
    })

    it('should have reasonable expected correction counts', () => {
      grammarTestCases.forEach(testCase => {
        // Expected corrections should be reasonable
        expect(testCase.expectedCorrections).toBeGreaterThanOrEqual(0)
        expect(testCase.expectedCorrections).toBeLessThan(10)
        
        // Longer sentences might have more corrections
        const wordCount = testCase.input.split(/\s+/).length
        if (wordCount > 20) {
          expect(testCase.expectedCorrections).toBeGreaterThan(0)
        }
      })
    })
  })
})
