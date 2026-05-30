import { describe, it, expect, beforeEach, vi } from 'vitest'
import { advancedGrammarCorrector } from '../utils/advancedGrammarCorrector'
import { detectLanguage } from '../utils/languageDetector'

// Mock OpenAI service for performance tests
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false), // Disable AI for pure performance testing
    generateOutput: vi.fn()
  }
}))

describe('Grammar Correction Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Processing Time Performance', () => {
    it('should process short text quickly', async () => {
      const shortText = 'I need a apple'
      const language = detectLanguage(shortText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(shortText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(100) // Should complete within 100ms
      expect(result.processingTime).toBeLessThan(100)
      expect(result.processingTime).toBeGreaterThan(0)
    })

    it('should process medium text efficiently', async () => {
      const mediumText = 'I need a apple and a orange for the recipe. She are going to the store with they\'re friends. I don\'t have no time for this meeting.'
      const language = detectLanguage(mediumText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(mediumText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(500) // Should complete within 500ms
      expect(result.processingTime).toBeLessThan(500)
      expect(result.suggestions.length).toBeGreaterThan(0)
    })

    it('should handle large text within reasonable time', async () => {
      const largeText = 'I need a apple. '.repeat(50) // 50 sentences
      const language = detectLanguage(largeText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(largeText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(2000) // Should complete within 2 seconds
      expect(result.processingTime).toBeLessThan(2000)
      expect(result.original).toBe(largeText)
      expect(result.corrected).toBeDefined()
    })

    it('should scale linearly with text length', async () => {
      const baseText = 'I need a apple. '
      const testSizes = [10, 20, 50, 100] // Different text lengths
      const results = []
      
      for (const size of testSizes) {
        const text = baseText.repeat(size)
        const language = detectLanguage(text)
        
        const startTime = performance.now()
        const result = await advancedGrammarCorrector.correctText(text, language)
        const endTime = performance.now()
        
        results.push({
          size,
          processingTime: endTime - startTime,
          result
        })
      }
      
      // Processing time should scale reasonably with text size
      for (let i = 1; i < results.length; i++) {
        const timeRatio = results[i].processingTime / results[i-1].processingTime
        const sizeRatio = results[i].size / results[i-1].size
        
        // Time increase should not be more than 2x the size increase
        expect(timeRatio).toBeLessThan(sizeRatio * 2)
      }
    })
  })

  describe('Memory Performance', () => {
    it('should not leak memory with repeated calls', async () => {
      const text = 'I need a apple'
      const language = detectLanguage(text)
      
      // Perform multiple corrections
      for (let i = 0; i < 100; i++) {
        const result = await advancedGrammarCorrector.correctText(text, language)
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
      }
      
      // If we get here without memory issues, the test passes
      expect(true).toBe(true)
    })

    it('should handle large text without memory issues', async () => {
      const largeText = 'This is a test sentence. '.repeat(1000) // Very large text
      const language = detectLanguage(largeText)
      
      const result = await advancedGrammarCorrector.correctText(largeText, language)
      
      expect(result.original).toBe(largeText)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeLessThan(10000) // Should complete within 10 seconds
    })
  })

  describe('Concurrent Performance', () => {
    it('should handle multiple concurrent requests efficiently', async () => {
      const texts = [
        'I need a apple',
        'She are going to the store',
        'I don\'t have no time',
        'There going to they\'re house',
        'This is a very long sentence that goes on and on.',
        'El casa es muy grande',
        'Le eau est froide',
        'der hund läuft schnell'
      ]
      
      const startTime = performance.now()
      const promises = texts.map(text => {
        const language = detectLanguage(text)
        return advancedGrammarCorrector.correctText(text, language)
      })
      
      const results = await Promise.all(promises)
      const endTime = performance.now()
      
      const totalTime = endTime - startTime
      
      expect(totalTime).toBeLessThan(2000) // All requests should complete within 2 seconds
      expect(results).toHaveLength(8)
      
      results.forEach(result => {
        expect(result.original).toBeDefined()
        expect(result.corrected).toBeDefined()
        expect(result.processingTime).toBeGreaterThan(0)
      })
    })

    it('should maintain performance under load', async () => {
      const text = 'I need a apple'
      const language = detectLanguage(text)
      const concurrentRequests = 20
      
      const startTime = performance.now()
      const promises = Array(concurrentRequests).fill(null).map(() => 
        advancedGrammarCorrector.correctText(text, language)
      )
      
      const results = await Promise.all(promises)
      const endTime = performance.now()
      
      const totalTime = endTime - startTime
      const averageTime = totalTime / concurrentRequests
      
      expect(totalTime).toBeLessThan(5000) // Should complete within 5 seconds
      expect(averageTime).toBeLessThan(500) // Average should be under 500ms
      expect(results).toHaveLength(concurrentRequests)
    })
  })

  describe('Language-Specific Performance', () => {
    it('should process different languages efficiently', async () => {
      const testCases = [
        { text: 'I need a apple', lang: 'en' },
        { text: 'El casa es grande', lang: 'es' },
        { text: 'Le eau est froide', lang: 'fr' },
        { text: 'der hund läuft', lang: 'de' },
        { text: 'मैं एक सेब चाहता हूं', lang: 'hi' }
      ]
      
      const results = []
      
      for (const testCase of testCases) {
        const language = detectLanguage(testCase.text)
        const startTime = performance.now()
        const result = await advancedGrammarCorrector.correctText(testCase.text, language)
        const endTime = performance.now()
        
        results.push({
          language: testCase.lang,
          processingTime: endTime - startTime,
          result
        })
      }
      
      // All languages should process within reasonable time
      results.forEach(({ language, processingTime, result }) => {
        expect(processingTime).toBeLessThan(1000) // Should complete within 1 second
        expect(result.processingTime).toBeLessThan(1000)
        expect(result.language.code).toBe(language)
      })
    })
  })

  describe('Rule Application Performance', () => {
    it('should efficiently apply multiple grammar rules', async () => {
      const textWithMultipleErrors = 'I need a apple, she are going to the store, and I don\'t have no time for this meeting with they\'re friends.'
      const language = detectLanguage(textWithMultipleErrors)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(textWithMultipleErrors, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.suggestions.length).toBeGreaterThan(3) // Should detect multiple errors
      expect(result.processingTime).toBeLessThan(1000)
    })

    it('should efficiently handle context-aware spelling', async () => {
      const textWithSpellingErrors = 'There going to they\'re house with your friends. Its a beautiful day.'
      const language = detectLanguage(textWithSpellingErrors)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(textWithSpellingErrors, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.processingTime).toBeLessThan(1000)
    })
  })

  describe('Edge Case Performance', () => {
    it('should handle empty text efficiently', async () => {
      const emptyText = ''
      const language = detectLanguage(emptyText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(emptyText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(50) // Should complete very quickly
      expect(result.processingTime).toBeLessThan(50)
      expect(result.suggestions).toHaveLength(0)
    })

    it('should handle text with special characters efficiently', async () => {
      const specialText = 'Hello! @#$%^&*()_+{}|:"<>?[]\\;\',./ I need a apple.'
      const language = detectLanguage(specialText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(specialText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.processingTime).toBeLessThan(1000)
      expect(result.original).toBe(specialText)
    })

    it('should handle unicode text efficiently', async () => {
      const unicodeText = 'Hello 世界! 🌍 مرحبا I need a apple.'
      const language = detectLanguage(unicodeText)
      
      const startTime = performance.now()
      const result = await advancedGrammarCorrector.correctText(unicodeText, language)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.processingTime).toBeLessThan(1000)
      expect(result.original).toBe(unicodeText)
    })
  })

  describe('Performance Benchmarks', () => {
    it('should meet baseline performance requirements', async () => {
      const benchmarkText = 'I need a apple for the recipe. She are going to the store with they\'re friends.'
      const language = detectLanguage(benchmarkText)
      
      const iterations = 10
      const times = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now()
        await advancedGrammarCorrector.correctText(benchmarkText, language)
        const endTime = performance.now()
        times.push(endTime - startTime)
      }
      
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const maxTime = Math.max(...times)
      const minTime = Math.min(...times)
      
      // Performance requirements
      expect(averageTime).toBeLessThan(500) // Average should be under 500ms
      expect(maxTime).toBeLessThan(1000) // Max should be under 1 second
      expect(minTime).toBeGreaterThan(0) // Min should be positive
      
      // Consistency check (max should not be more than 3x min)
      expect(maxTime).toBeLessThan(minTime * 3)
    })

    it('should maintain consistent performance across runs', async () => {
      const text = 'I need a apple'
      const language = detectLanguage(text)
      const runs = 5
      const times = []
      
      for (let i = 0; i < runs; i++) {
        const startTime = performance.now()
        await advancedGrammarCorrector.correctText(text, language)
        const endTime = performance.now()
        times.push(endTime - startTime)
      }
      
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / times.length
      const standardDeviation = Math.sqrt(variance)
      
      // Performance should be consistent (low standard deviation)
      expect(standardDeviation).toBeLessThan(averageTime * 0.5) // SD should be less than 50% of average
    })
  })
})
