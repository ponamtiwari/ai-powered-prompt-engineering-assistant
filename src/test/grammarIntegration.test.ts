import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { advancedGrammarCorrector } from '../utils/advancedGrammarCorrector'
import { detectLanguage } from '../utils/languageDetector'

// Mock the OpenAI service for integration tests
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => true),
    generateOutput: vi.fn().mockResolvedValue(JSON.stringify({
      correctedText: 'I need an apple for the recipe.',
      suggestions: [
        {
          type: 'grammar',
          severity: 'error',
          original: 'a apple',
          corrected: 'an apple',
          explanation: 'Use "an" before words starting with vowel sounds',
          rule: 'article_vowel',
          examples: ['an apple', 'an hour', 'an honest person']
        }
      ]
    }))
  }
}))

describe('Grammar Correction Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('End-to-End Grammar Correction Workflow', () => {
    it('should complete full grammar correction pipeline', async () => {
      const inputText = 'I need a apple and a orange for the recipe'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Verify the complete workflow
      expect(result.original).toBe(inputText)
      expect(result.corrected).not.toBe(inputText)
      expect(result.language).toBeDefined()
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.processingTime).toBeGreaterThan(0)
      
      // Verify corrections were applied
      expect(result.corrected).toContain('an apple')
      expect(result.corrected).toContain('an orange')
    })

    it('should handle complex multilingual text', async () => {
      const inputText = 'Hello, I am learning español. Je parle français aussi.'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      expect(result.original).toBe(inputText)
      expect(result.language).toBeDefined()
      expect(result.processingTime).toBeGreaterThan(0)
      
      // Should process without errors
      expect(result.suggestions).toBeDefined()
      expect(Array.isArray(result.suggestions)).toBe(true)
    })

    it('should integrate with AI service when available', async () => {
      const { openaiService } = await import('../utils/openaiService')
      
      const inputText = 'This is a test sentence with some errors.'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Should have used AI service
      expect(openaiService.generateOutput).toHaveBeenCalled()
      
      // Should have AI-generated suggestions
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions[0].explanation).toBeDefined()
    })

    it('should fallback gracefully when AI service fails', async () => {
      const { openaiService } = await import('../utils/openaiService')
      vi.mocked(openaiService.generateOutput).mockRejectedValue(new Error('API Error'))
      
      const inputText = 'I need a apple'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Should still provide rule-based corrections
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
      
      // Should not crash the application
      expect(result.original).toBe(inputText)
      expect(result.corrected).toBeDefined()
    })
  })

  describe('Language Detection Integration', () => {
    it('should detect language and apply appropriate rules', async () => {
      const testCases = [
        { text: 'I am learning English', expectedLang: 'en' },
        { text: 'Estoy aprendiendo español', expectedLang: 'es' },
        { text: 'J\'apprends le français', expectedLang: 'fr' },
        { text: 'Ich lerne Deutsch', expectedLang: 'de' }
      ]
      
      for (const testCase of testCases) {
        const language = detectLanguage(testCase.text)
        const result = await advancedGrammarCorrector.correctText(testCase.text, language)
        
        expect(result.language.code).toBe(testCase.expectedLang)
        expect(result.suggestions).toBeDefined()
      }
    })

    it('should handle mixed language text', async () => {
      const mixedText = 'Hello, I am learning español and français'
      const language = detectLanguage(mixedText)
      
      const result = await advancedGrammarCorrector.correctText(mixedText, language)
      
      expect(result.language).toBeDefined()
      expect(result.suggestions).toBeDefined()
      expect(result.processingTime).toBeGreaterThan(0)
    })
  })

  describe('Context Enhancement Integration', () => {
    it('should apply domain-specific enhancements', async () => {
      const businessText = 'This is very good work'
      const language = detectLanguage(businessText)
      
      const result = await advancedGrammarCorrector.enhanceWithContext(
        businessText,
        language,
        { domain: 'business' }
      )
      
      expect(result.corrected).toContain('excellent')
      expect(result.suggestions.length).toBeGreaterThan(0)
    })

    it('should apply tone adjustments', async () => {
      const casualText = "I can't do this right now"
      const language = detectLanguage(casualText)
      
      const result = await advancedGrammarCorrector.enhanceWithContext(
        casualText,
        language,
        { tone: 'formal' }
      )
      
      expect(result.corrected).toContain('cannot')
      expect(result.suggestions.length).toBeGreaterThan(0)
    })

    it('should combine multiple context enhancements', async () => {
      const text = 'This is very good work, I can\'t believe it'
      const language = detectLanguage(text)
      
      const result = await advancedGrammarCorrector.enhanceWithContext(
        text,
        language,
        { 
          domain: 'business',
          tone: 'formal',
          audience: 'executives'
        }
      )
      
      expect(result.corrected).toContain('excellent')
      expect(result.corrected).toContain('cannot')
      expect(result.suggestions.length).toBeGreaterThan(0)
    })
  })

  describe('Performance Integration', () => {
    it('should handle large text efficiently', async () => {
      const largeText = 'This is a test sentence. '.repeat(100)
      const language = detectLanguage(largeText)
      
      const startTime = Date.now()
      const result = await advancedGrammarCorrector.correctText(largeText, language)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(5000) // Should complete within 5 seconds
      expect(result.processingTime).toBeLessThan(5000)
      expect(result.original).toBe(largeText)
      expect(result.corrected).toBeDefined()
    })

    it('should handle multiple concurrent requests', async () => {
      const texts = [
        'I need a apple',
        'She are going to the store',
        'I don\'t have no time',
        'There going to they\'re house'
      ]
      
      const startTime = Date.now()
      const promises = texts.map(text => {
        const language = detectLanguage(text)
        return advancedGrammarCorrector.correctText(text, language)
      })
      
      const results = await Promise.all(promises)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(10000) // Should complete within 10 seconds
      expect(results).toHaveLength(4)
      
      results.forEach(result => {
        expect(result.original).toBeDefined()
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThan(0)
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle malformed input gracefully', async () => {
      const malformedInputs = [
        null,
        undefined,
        '',
        '   ',
        '!@#$%^&*()',
        '123456789'
      ]
      
      for (const input of malformedInputs) {
        const language = detectLanguage(input as string)
        const result = await advancedGrammarCorrector.correctText(input as string, language)
        
        expect(result.original).toBeDefined()
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.confidence).toBeGreaterThanOrEqual(0)
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle network errors gracefully', async () => {
      const { openaiService } = await import('../utils/openaiService')
      vi.mocked(openaiService.generateOutput).mockRejectedValue(new Error('Network Error'))
      
      const inputText = 'I need a apple'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Should still provide rule-based corrections
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.original).toBe(inputText)
      expect(result.corrected).toBeDefined()
    })

    it('should handle API rate limiting', async () => {
      const { openaiService } = await import('../utils/openaiService')
      vi.mocked(openaiService.generateOutput).mockRejectedValue(new Error('Rate limit exceeded'))
      
      const inputText = 'I need a apple'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Should fallback to rule-based corrections
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0)
    })
  })

  describe('Data Flow Integration', () => {
    it('should maintain data integrity through the pipeline', async () => {
      const inputText = 'I need a apple and a orange'
      const language = detectLanguage(inputText)
      
      const result = await advancedGrammarCorrector.correctText(inputText, language)
      
      // Verify data integrity
      expect(result.original).toBe(inputText)
      expect(result.language.code).toBe(language.code)
      expect(result.language.name).toBe(language.name)
      expect(result.language.nativeName).toBe(language.nativeName)
      
      // Verify suggestions are valid
      result.suggestions.forEach(suggestion => {
        expect(suggestion.type).toMatch(/^(grammar|spelling|style|punctuation|syntax)$/)
        expect(suggestion.severity).toMatch(/^(error|warning|suggestion)$/)
        expect(suggestion.original).toBeDefined()
        expect(suggestion.corrected).toBeDefined()
        expect(suggestion.explanation).toBeDefined()
        expect(suggestion.rule).toBeDefined()
      })
    })

    it('should preserve text structure and formatting', async () => {
      const formattedText = 'Hello,\n\nI need a apple.\n\nThank you!'
      const language = detectLanguage(formattedText)
      
      const result = await advancedGrammarCorrector.correctText(formattedText, language)
      
      // Should preserve line breaks and formatting
      expect(result.corrected).toContain('\n')
      expect(result.corrected).toContain('Hello,')
      expect(result.corrected).toContain('Thank you!')
    })
  })

  describe('Localization Integration', () => {
    it('should provide localized messages for different languages', async () => {
      const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' }
      ]
      
      for (const language of languages) {
        const message = advancedGrammarCorrector.getLocalizedMessage('grammarFixed', language)
        expect(message).toBeDefined()
        expect(message.length).toBeGreaterThan(0)
        
        // Should not be the same for all languages
        if (language.code !== 'en') {
          expect(message).not.toBe('Grammar corrected')
        }
      }
    })

    it('should provide localized rule explanations', async () => {
      const language = { code: 'es', name: 'Spanish', nativeName: 'Español' }
      const explanation = advancedGrammarCorrector.getLocalizedRuleExplanation('article_vowel', language)
      
      expect(explanation).toBeDefined()
      expect(explanation.length).toBeGreaterThan(0)
      expect(explanation).not.toBe('Use "an" before words starting with vowel sounds')
    })
  })
})
