import { describe, it, expect, beforeEach, vi } from 'vitest'
import { advancedGrammarCorrector } from '../utils/advancedGrammarCorrector'
import { detectLanguage } from '../utils/languageDetector'

// Mock OpenAI service for edge case testing
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    generateOutput: vi.fn()
  }
}))

describe('Grammar Correction Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input Validation Edge Cases', () => {
    it('should handle null input', async () => {
      const result = await advancedGrammarCorrector.correctText(null as any)
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle undefined input', async () => {
      const result = await advancedGrammarCorrector.correctText(undefined as any)
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty string', async () => {
      const result = await advancedGrammarCorrector.correctText('')
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle whitespace-only input', async () => {
      const whitespaceInputs = [' ', '\t', '\n', '\r\n', '   ', '\t\n\r   ']
      
      for (const input of whitespaceInputs) {
        const result = await advancedGrammarCorrector.correctText(input)
        
        expect(result.original).toBe(input)
        expect(result.corrected).toBe(input)
        expect(result.suggestions).toHaveLength(0)
        expect(result.confidence).toBe(1.0)
      }
    })

    it('should handle non-string input types', async () => {
      const nonStringInputs = [123, true, false, {}, [], Symbol('test')]
      
      for (const input of nonStringInputs) {
        const result = await advancedGrammarCorrector.correctText(input as any)
        
        expect(result.original).toBeDefined()
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.confidence).toBeGreaterThanOrEqual(0)
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Extreme Text Length Edge Cases', () => {
    it('should handle very short text', async () => {
      const shortTexts = ['a', 'I', 'Hi', 'OK', 'No']
      
      for (const text of shortTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle extremely long text', async () => {
      const longText = 'This is a test sentence. '.repeat(10000) // 100,000 characters
      const language = detectLanguage(longText)
      
      const result = await advancedGrammarCorrector.correctText(longText, language)
      
      expect(result.original).toBe(longText)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeLessThan(30000) // Should complete within 30 seconds
    })

    it('should handle single character input', async () => {
      const singleChars = ['a', 'A', '1', '!', '?', '.', ' ', '\n']
      
      for (const char of singleChars) {
        const language = detectLanguage(char)
        const result = await advancedGrammarCorrector.correctText(char, language)
        
        expect(result.original).toBe(char)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Special Character Edge Cases', () => {
    it('should handle unicode characters', async () => {
      const unicodeTexts = [
        'Hello 世界! 🌍',
        'مرحبا بالعالم',
        'Здравствуй мир',
        'こんにちは世界',
        'नमस्ते दुनिया',
        '你好世界',
        '안녕하세요 세계'
      ]
      
      for (const text of unicodeTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle special symbols and punctuation', async () => {
      const specialTexts = [
        '!@#$%^&*()_+{}|:"<>?[]\\;\',./',
        'Hello, world! How are you? I\'m fine.',
        'Price: $19.99 (20% off)',
        'Email: user@example.com',
        'URL: https://example.com/path?param=value',
        'Code: if (x > 0) { return true; }'
      ]
      
      for (const text of specialTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle mixed scripts and languages', async () => {
      const mixedTexts = [
        'Hello 世界! I am learning español.',
        'Bonjour! 你好! Hola!',
        'I speak English, 中文, and français.',
        'Price: $100 (¥10,000)',
        'Email: user@example.com (用户@例子.中国)'
      ]
      
      for (const text of mixedTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Language Detection Edge Cases', () => {
    it('should handle unknown language codes', async () => {
      const unknownLanguage = { code: 'xx', name: 'Unknown', nativeName: 'Unknown' }
      const result = await advancedGrammarCorrector.correctText('Hello world', unknownLanguage)
      
      expect(result.language.code).toBe('xx')
      expect(result.language.name).toBe('Unknown')
      expect(result.language.nativeName).toBe('Unknown')
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle malformed language objects', async () => {
      const malformedLanguages = [
        { code: '', name: 'English', nativeName: 'English' },
        { code: 'en', name: '', nativeName: 'English' },
        { code: 'en', name: 'English', nativeName: '' },
        { code: null, name: 'English', nativeName: 'English' },
        { code: 'en', name: null, nativeName: 'English' },
        { code: 'en', name: 'English', nativeName: null }
      ]
      
      for (const language of malformedLanguages) {
        const result = await advancedGrammarCorrector.correctText('Hello world', language as any)
        
        expect(result.language).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle very short language codes', async () => {
      const shortLanguageCodes = ['e', 'a', '1', '!']
      
      for (const code of shortLanguageCodes) {
        const language = { code, name: 'Test', nativeName: 'Test' }
        const result = await advancedGrammarCorrector.correctText('Hello world', language)
        
        expect(result.language.code).toBe(code)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Grammar Rule Edge Cases', () => {
    it('should handle text with no detectable grammar errors', async () => {
      const perfectTexts = [
        'This is a perfectly correct sentence.',
        'The quick brown fox jumps over the lazy dog.',
        'I am learning English grammar.',
        'She is going to the store with her friends.',
        'We have been working on this project for months.'
      ]
      
      for (const text of perfectTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.suggestions.length).toBe(0)
        expect(result.confidence).toBe(1.0)
      }
    })

    it('should handle text with ambiguous grammar', async () => {
      const ambiguousTexts = [
        'The fish was caught by the fisherman.',
        'The book was read by the student.',
        'The house was built by the contractor.',
        'The meal was cooked by the chef.',
        'The song was sung by the singer.'
      ]
      
      for (const text of ambiguousTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle text with multiple overlapping errors', async () => {
      const complexText = 'I need a apple, she are going to the store, and I don\'t have no time for this meeting with they\'re friends.'
      const language = detectLanguage(complexText)
      
      const result = await advancedGrammarCorrector.correctText(complexText, language)
      
      expect(result.original).toBe(complexText)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Context Enhancement Edge Cases', () => {
    it('should handle undefined context', async () => {
      const text = 'This is a test sentence'
      const language = detectLanguage(text)
      
      const result = await advancedGrammarCorrector.enhanceWithContext(text, language, undefined)
      
      expect(result.original).toBe(text)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty context object', async () => {
      const text = 'This is a test sentence'
      const language = detectLanguage(text)
      
      const result = await advancedGrammarCorrector.enhanceWithContext(text, language, {})
      
      expect(result.original).toBe(text)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle invalid context values', async () => {
      const text = 'This is a test sentence'
      const language = detectLanguage(text)
      const invalidContext = {
        domain: null,
        tone: undefined,
        audience: ''
      }
      
      const result = await advancedGrammarCorrector.enhanceWithContext(text, language, invalidContext as any)
      
      expect(result.original).toBe(text)
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Localization Edge Cases', () => {
    it('should handle unknown message keys', async () => {
      const language = { code: 'en', name: 'English', nativeName: 'English' }
      const unknownKey = 'unknownMessageKey' as any
      
      const message = advancedGrammarCorrector.getLocalizedMessage(unknownKey, language)
      
      expect(message).toBeDefined()
      expect(typeof message).toBe('string')
    })

    it('should handle unknown rule names', async () => {
      const language = { code: 'en', name: 'English', nativeName: 'English' }
      const unknownRule = 'unknownRuleName'
      
      const explanation = advancedGrammarCorrector.getLocalizedRuleExplanation(unknownRule, language)
      
      expect(explanation).toBe(unknownRule)
    })

    it('should handle malformed language objects in localization', async () => {
      const malformedLanguage = { code: null, name: undefined, nativeName: '' }
      
      const message = advancedGrammarCorrector.getLocalizedMessage('grammarFixed', malformedLanguage as any)
      const explanation = advancedGrammarCorrector.getLocalizedRuleExplanation('article_vowel', malformedLanguage as any)
      
      expect(message).toBeDefined()
      expect(explanation).toBeDefined()
    })
  })

  describe('Performance Edge Cases', () => {
    it('should handle rapid successive calls', async () => {
      const text = 'I need a apple'
      const language = detectLanguage(text)
      
      const promises = Array(50).fill(null).map(() => 
        advancedGrammarCorrector.correctText(text, language)
      )
      
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(50)
      results.forEach(result => {
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      })
    })

    it('should handle memory-intensive operations', async () => {
      const largeTexts = Array(10).fill(null).map(() => 
        'This is a test sentence. '.repeat(100)
      )
      
      const promises = largeTexts.map(text => {
        const language = detectLanguage(text)
        return advancedGrammarCorrector.correctText(text, language)
      })
      
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(10)
      results.forEach(result => {
        expect(result.original).toBeDefined()
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Error Recovery Edge Cases', () => {
    it('should recover from internal errors gracefully', async () => {
      // Mock an internal error by corrupting the grammar rules
      const originalRules = (advancedGrammarCorrector as any).advancedGrammarRules
      ;(advancedGrammarCorrector as any).advancedGrammarRules = null
      
      const result = await advancedGrammarCorrector.correctText('I need a apple')
      
      expect(result.original).toBe('I need a apple')
      expect(result.corrected).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
      
      // Restore original rules
      ;(advancedGrammarCorrector as any).advancedGrammarRules = originalRules
    })

    it('should handle regex compilation errors', async () => {
      const textWithProblematicPatterns = [
        'Text with [unclosed bracket',
        'Text with {unclosed brace',
        'Text with (unclosed parenthesis',
        'Text with *invalid regex*',
        'Text with +invalid regex+',
        'Text with ?invalid regex?'
      ]
      
      for (const text of textWithProblematicPatterns) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Boundary Value Edge Cases', () => {
    it('should handle confidence score boundaries', async () => {
      const testCases = [
        { text: 'Perfect sentence.', expectedConfidence: 1.0 },
        { text: 'I need a apple', expectedConfidence: 0.8 }, // Should be high confidence
        { text: 'This is a very long sentence that goes on and on and on and on and on and on.', expectedConfidence: 0.5 } // Should be medium confidence
      ]
      
      for (const testCase of testCases) {
        const language = detectLanguage(testCase.text)
        const result = await advancedGrammarCorrector.correctText(testCase.text, language)
        
        expect(result.confidence).toBeGreaterThanOrEqual(0)
        expect(result.confidence).toBeLessThanOrEqual(1.0)
      }
    })

    it('should handle processing time boundaries', async () => {
      const text = 'I need a apple'
      const language = detectLanguage(text)
      
      const result = await advancedGrammarCorrector.correctText(text, language)
      
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
      expect(result.processingTime).toBeLessThan(10000) // Should not take more than 10 seconds
    })

    it('should handle suggestion count boundaries', async () => {
      const textWithManyErrors = 'I need a apple, she are going to the store, I don\'t have no time, there going to they\'re house, its a beautiful day, your going to be late.'
      const language = detectLanguage(textWithManyErrors)
      
      const result = await advancedGrammarCorrector.correctText(textWithManyErrors, language)
      
      expect(result.suggestions.length).toBeGreaterThanOrEqual(0)
      expect(result.suggestions.length).toBeLessThan(50) // Should not generate excessive suggestions
    })
  })
})
