import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { 
  AdvancedGrammarCorrector, 
  GrammarSuggestion, 
  AdvancedGrammarCorrection 
} from '../utils/advancedGrammarCorrector'
import { Language } from '../utils/languageDetector'

// Mock the OpenAI service
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    generateOutput: vi.fn()
  }
}))

describe('AdvancedGrammarCorrector', () => {
  let corrector: AdvancedGrammarCorrector

  beforeEach(() => {
    corrector = new AdvancedGrammarCorrector()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Grammar Correction', () => {
    it('should handle empty text', async () => {
      const result = await corrector.correctText('')
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
      expect(result.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('should handle whitespace-only text', async () => {
      const result = await corrector.correctText('   \n\t   ')
      
      expect(result.original).toBe('   \n\t   ')
      expect(result.corrected).toBe('   \n\t   ')
      expect(result.suggestions).toHaveLength(0)
      expect(result.confidence).toBe(1.0)
    })

    it('should detect article errors in English', async () => {
      const result = await corrector.correctText('I need a apple', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.suggestions).toHaveLength(1)
      expect(result.suggestions[0].type).toBe('grammar')
      expect(result.suggestions[0].severity).toBe('error')
      expect(result.suggestions[0].rule).toBe('article_vowel')
      expect(result.suggestions[0].original).toBe('a apple')
      expect(result.suggestions[0].corrected).toBe('an apple')
    })

    it('should detect subject-verb agreement errors', async () => {
      const result = await corrector.correctText('He are going to the store', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.suggestions.length).toBeGreaterThan(0)
      const agreementSuggestion = result.suggestions.find(s => s.rule === 'subject_verb_agreement')
      expect(agreementSuggestion).toBeDefined()
      expect(agreementSuggestion?.type).toBe('grammar')
      expect(agreementSuggestion?.severity).toBe('error')
    })

    it('should detect double negatives', async () => {
      const result = await corrector.correctText("I don't have no time", { code: 'en', name: 'English', nativeName: 'English' })
      
      const doubleNegativeSuggestion = result.suggestions.find(s => s.rule === 'double_negative')
      expect(doubleNegativeSuggestion).toBeDefined()
      expect(doubleNegativeSuggestion?.type).toBe('grammar')
      expect(doubleNegativeSuggestion?.severity).toBe('error')
    })
  })

  describe('Context-Aware Spelling', () => {
    it('should correct there/their/they\'re based on context', async () => {
      const result = await corrector.correctText('There going to they\'re house', { code: 'en', name: 'English', nativeName: 'English' })
      
      const spellingSuggestions = result.suggestions.filter(s => s.type === 'spelling')
      expect(spellingSuggestions.length).toBeGreaterThan(0)
      
      const thereSuggestion = spellingSuggestions.find(s => s.original === 'There')
      expect(thereSuggestion).toBeDefined()
      expect(thereSuggestion?.corrected).toBe('They\'re')
    })

    it('should correct your/you\'re based on context', async () => {
      const result = await corrector.correctText('Your going to be late', { code: 'en', name: 'English', nativeName: 'English' })
      
      const spellingSuggestions = result.suggestions.filter(s => s.type === 'spelling')
      expect(spellingSuggestions.length).toBeGreaterThan(0)
      
      const yourSuggestion = spellingSuggestions.find(s => s.original === 'Your')
      expect(yourSuggestion).toBeDefined()
      expect(yourSuggestion?.corrected).toBe('You\'re')
    })
  })

  describe('Multilingual Support', () => {
    it('should handle Spanish gender agreement', async () => {
      const result = await corrector.correctText('El casa es grande', { code: 'es', name: 'Spanish', nativeName: 'Español' })
      
      const genderSuggestion = result.suggestions.find(s => s.rule === 'gender_agreement')
      expect(genderSuggestion).toBeDefined()
      expect(genderSuggestion?.type).toBe('grammar')
      expect(genderSuggestion?.severity).toBe('error')
    })

    it('should handle French elision', async () => {
      const result = await corrector.correctText('Le eau est froide', { code: 'fr', name: 'French', nativeName: 'Français' })
      
      const elisionSuggestion = result.suggestions.find(s => s.rule === 'elision')
      expect(elisionSuggestion).toBeDefined()
      expect(elisionSuggestion?.type).toBe('grammar')
      expect(elisionSuggestion?.severity).toBe('error')
    })

    it('should handle German noun capitalization', async () => {
      const result = await corrector.correctText('der hund läuft', { code: 'de', name: 'German', nativeName: 'Deutsch' })
      
      const capitalizationSuggestion = result.suggestions.find(s => s.rule === 'noun_capitalization')
      expect(capitalizationSuggestion).toBeDefined()
      expect(capitalizationSuggestion?.type).toBe('grammar')
      expect(capitalizationSuggestion?.severity).toBe('error')
    })
  })

  describe('Sentence Structure Analysis', () => {
    it('should detect sentence fragments', async () => {
      const result = await corrector.correctText('The dog in the park.', { code: 'en', name: 'English', nativeName: 'English' })
      
      const fragmentSuggestion = result.suggestions.find(s => s.rule === 'sentence_fragment')
      expect(fragmentSuggestion).toBeDefined()
      expect(fragmentSuggestion?.type).toBe('grammar')
      expect(fragmentSuggestion?.severity).toBe('warning')
    })

    it('should detect run-on sentences', async () => {
      const longSentence = 'I went to the store, and I bought some milk, and then I went home, and I made dinner, and I watched TV.'
      const result = await corrector.correctText(longSentence, { code: 'en', name: 'English', nativeName: 'English' })
      
      const runOnSuggestion = result.suggestions.find(s => s.rule === 'run_on_sentence')
      expect(runOnSuggestion).toBeDefined()
      expect(runOnSuggestion?.type).toBe('style')
      expect(runOnSuggestion?.severity).toBe('suggestion')
    })
  })

  describe('Confidence Calculation', () => {
    it('should calculate high confidence for error-level suggestions', async () => {
      const result = await corrector.correctText('I need a apple', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.confidence).toBeGreaterThan(0.8)
    })

    it('should calculate medium confidence for warning-level suggestions', async () => {
      const result = await corrector.correctText('This is a very long sentence that goes on and on and on and on.', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.confidence).toBeGreaterThan(0.5)
      expect(result.confidence).toBeLessThanOrEqual(0.8)
    })

    it('should return perfect confidence for text with no errors', async () => {
      const result = await corrector.correctText('This is a perfectly correct sentence.', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.confidence).toBe(1.0)
    })
  })

  describe('Processing Time', () => {
    it('should track processing time', async () => {
      const result = await corrector.correctText('This is a test sentence.', { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.processingTime).toBeGreaterThan(0)
      expect(typeof result.processingTime).toBe('number')
    })

    it('should complete processing within reasonable time', async () => {
      const startTime = Date.now()
      await corrector.correctText('This is a test sentence with multiple words.', { code: 'en', name: 'English', nativeName: 'English' })
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Localized Messages', () => {
    it('should return English messages for English language', () => {
      const language: Language = { code: 'en', name: 'English', nativeName: 'English' }
      
      expect(corrector.getLocalizedMessage('grammarFixed', language)).toBe('Grammar corrected')
      expect(corrector.getLocalizedMessage('spellingFixed', language)).toBe('Spelling corrected')
      expect(corrector.getLocalizedMessage('noErrors', language)).toBe('No errors found')
    })

    it('should return Spanish messages for Spanish language', () => {
      const language: Language = { code: 'es', name: 'Spanish', nativeName: 'Español' }
      
      expect(corrector.getLocalizedMessage('grammarFixed', language)).toBe('Gramática corregida')
      expect(corrector.getLocalizedMessage('spellingFixed', language)).toBe('Ortografía corregida')
      expect(corrector.getLocalizedMessage('noErrors', language)).toBe('No se encontraron errores')
    })

    it('should fallback to English for unsupported languages', () => {
      const language: Language = { code: 'xx', name: 'Unknown', nativeName: 'Unknown' }
      
      expect(corrector.getLocalizedMessage('grammarFixed', language)).toBe('Grammar corrected')
    })
  })

  describe('Rule Explanations', () => {
    it('should return localized rule explanations', () => {
      const language: Language = { code: 'en', name: 'English', nativeName: 'English' }
      
      expect(corrector.getLocalizedRuleExplanation('article_vowel', language)).toBe('Use "an" before words starting with vowel sounds')
      expect(corrector.getLocalizedRuleExplanation('subject_verb_agreement', language)).toBe('Singular subjects require singular verbs')
    })

    it('should return rule name for unknown rules', () => {
      const language: Language = { code: 'en', name: 'English', nativeName: 'English' }
      
      expect(corrector.getLocalizedRuleExplanation('unknown_rule', language)).toBe('unknown_rule')
    })
  })

  describe('Context Enhancement', () => {
    it('should apply domain-specific enhancements', async () => {
      const result = await corrector.enhanceWithContext(
        'This is very good work',
        { code: 'en', name: 'English', nativeName: 'English' },
        { domain: 'business' }
      )
      
      expect(result.corrected).toContain('excellent')
    })

    it('should apply tone adjustments', async () => {
      const result = await corrector.enhanceWithContext(
        "I can't do this",
        { code: 'en', name: 'English', nativeName: 'English' },
        { tone: 'formal' }
      )
      
      expect(result.corrected).toContain('cannot')
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed input gracefully', async () => {
      const result = await corrector.correctText(null as any)
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
    })

    it('should handle undefined input gracefully', async () => {
      const result = await corrector.correctText(undefined as any)
      
      expect(result.original).toBe('')
      expect(result.corrected).toBe('')
      expect(result.suggestions).toHaveLength(0)
    })

    it('should handle very long text', async () => {
      const longText = 'This is a test sentence. '.repeat(1000)
      const result = await corrector.correctText(longText, { code: 'en', name: 'English', nativeName: 'English' })
      
      expect(result.original).toBe(longText)
      expect(result.processingTime).toBeLessThan(5000) // Should complete within 5 seconds
    })
  })

  describe('Duplicate Prevention', () => {
    it('should not apply duplicate corrections', async () => {
      const result = await corrector.correctText('a apple and a orange', { code: 'en', name: 'English', nativeName: 'English' })
      
      const articleSuggestions = result.suggestions.filter(s => s.rule === 'article_vowel')
      expect(articleSuggestions.length).toBe(2) // Should detect both instances
      
      // Check that corrections are applied correctly
      expect(result.corrected).toContain('an apple')
      expect(result.corrected).toContain('an orange')
    })
  })

  describe('Intent Preservation', () => {
    it('should preserve original intent when making corrections', async () => {
      const originalText = 'I am happy'
      const result = await corrector.correctText(originalText, { code: 'en', name: 'English', nativeName: 'English' })
      
      // The meaning should be preserved
      expect(result.corrected.toLowerCase()).toContain('happy')
      expect(result.corrected.toLowerCase()).toContain('i')
    })

    it('should not make overly aggressive corrections', async () => {
      const originalText = 'The quick brown fox jumps over the lazy dog'
      const result = await corrector.correctText(originalText, { code: 'en', name: 'English', nativeName: 'English' })
      
      // This is a well-known pangram, should not be heavily modified
      expect(result.corrected).toBe(originalText)
      expect(result.suggestions).toHaveLength(0)
    })
  })
})
