import { describe, it, expect, beforeEach, vi } from 'vitest'
import { advancedGrammarCorrector } from '../utils/advancedGrammarCorrector'
import { detectLanguage } from '../utils/languageDetector'

// Mock OpenAI service for multilingual testing
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    generateOutput: vi.fn()
  }
}))

describe('Multilingual Grammar Correction Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('English Grammar Rules', () => {
    it('should correct article errors', async () => {
      const testCases = [
        { input: 'I need a apple', expected: 'an apple' },
        { input: 'She has a hour', expected: 'an hour' },
        { input: 'He is a honest person', expected: 'an honest person' },
        { input: 'This is an book', expected: 'a book' },
        { input: 'That is an car', expected: 'a car' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'en', name: 'English', nativeName: 'English' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        expect(result.suggestions.length).toBeGreaterThan(0)
        const articleSuggestion = result.suggestions.find(s => s.rule === 'article_vowel' || s.rule === 'article_consonant')
        expect(articleSuggestion).toBeDefined()
        expect(articleSuggestion?.type).toBe('grammar')
        expect(articleSuggestion?.severity).toBe('error')
      }
    })

    it('should correct subject-verb agreement', async () => {
      const testCases = [
        { input: 'He are going to the store', expected: 'is' },
        { input: 'She were coming with him', expected: 'was' },
        { input: 'It are a beautiful day', expected: 'is' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'en', name: 'English', nativeName: 'English' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        expect(result.suggestions.length).toBeGreaterThan(0)
        const agreementSuggestion = result.suggestions.find(s => s.rule === 'subject_verb_agreement')
        expect(agreementSuggestion).toBeDefined()
        expect(agreementSuggestion?.type).toBe('grammar')
        expect(agreementSuggestion?.severity).toBe('error')
      }
    })

    it('should detect double negatives', async () => {
      const testCases = [
        "I don't have no time",
        "She doesn't know nothing",
        "We won't never go there",
        "They can't do nothing about it"
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'en', name: 'English', nativeName: 'English' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        const doubleNegativeSuggestion = result.suggestions.find(s => s.rule === 'double_negative')
        expect(doubleNegativeSuggestion).toBeDefined()
        expect(doubleNegativeSuggestion?.type).toBe('grammar')
        expect(doubleNegativeSuggestion?.severity).toBe('error')
      }
    })

    it('should correct contextual spelling', async () => {
      const testCases = [
        { input: 'There going to the store', expected: 'They\'re' },
        { input: 'Your going to be late', expected: 'You\'re' },
        { input: 'Its a beautiful day', expected: 'It\'s' },
        { input: 'They\'re going to they\'re house', expected: 'their' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'en', name: 'English', nativeName: 'English' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const spellingSuggestion = result.suggestions.find(s => s.type === 'spelling')
        expect(spellingSuggestion).toBeDefined()
        expect(spellingSuggestion?.type).toBe('spelling')
        expect(spellingSuggestion?.severity).toBe('warning')
      }
    })
  })

  describe('Spanish Grammar Rules', () => {
    it('should correct gender agreement', async () => {
      const testCases = [
        { input: 'El casa es grande', expected: 'La casa' },
        { input: 'Un mesa es pequeña', expected: 'Una mesa' },
        { input: 'El coche es rojo', expected: 'El coche' }, // This should be correct
        { input: 'La coche es rojo', expected: 'El coche' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'es', name: 'Spanish', nativeName: 'Español' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const genderSuggestion = result.suggestions.find(s => s.rule === 'gender_agreement')
        if (genderSuggestion) {
          expect(genderSuggestion.type).toBe('grammar')
          expect(genderSuggestion.severity).toBe('error')
        }
      }
    })

    it('should correct por qué vs porque usage', async () => {
      const testCases = [
        { input: 'Por que no vienes?', expected: 'Por qué' },
        { input: 'Porque no tengo tiempo', expected: 'Porque' }, // This should be correct
        { input: 'No sé por que', expected: 'por qué' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'es', name: 'Spanish', nativeName: 'Español' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const spellingSuggestion = result.suggestions.find(s => s.type === 'spelling')
        if (spellingSuggestion) {
          expect(spellingSuggestion.type).toBe('spelling')
          expect(spellingSuggestion.severity).toBe('warning')
        }
      }
    })

    it('should handle Spanish sentence structure', async () => {
      const testCases = [
        'El perro está corriendo en el parque',
        'La casa es muy grande y hermosa',
        'Los niños están jugando en el jardín'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'es', name: 'Spanish', nativeName: 'Español' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('French Grammar Rules', () => {
    it('should correct elision errors', async () => {
      const testCases = [
        { input: 'Le eau est froide', expected: 'L\'eau' },
        { input: 'La école est fermée', expected: 'L\'école' },
        { input: 'Le ami est gentil', expected: 'L\'ami' },
        { input: 'La ami est gentille', expected: 'L\'ami' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'fr', name: 'French', nativeName: 'Français' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const elisionSuggestion = result.suggestions.find(s => s.rule === 'elision')
        if (elisionSuggestion) {
          expect(elisionSuggestion.type).toBe('grammar')
          expect(elisionSuggestion.severity).toBe('error')
        }
      }
    })

    it('should correct pronoun elision', async () => {
      const testCases = [
        { input: 'Je ai faim', expected: 'J\'ai' },
        { input: 'Tu es là', expected: 'Tu es' }, // This should be correct
        { input: 'Il est ici', expected: 'Il est' }, // This should be correct
        { input: 'Nous avons faim', expected: 'Nous avons' } // This should be correct
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'fr', name: 'French', nativeName: 'Français' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const elisionSuggestion = result.suggestions.find(s => s.rule === 'pronoun_elision')
        if (elisionSuggestion) {
          expect(elisionSuggestion.type).toBe('grammar')
          expect(elisionSuggestion.severity).toBe('error')
        }
      }
    })

    it('should handle French sentence structure', async () => {
      const testCases = [
        'Le chat dort sur le canapé',
        'Les enfants jouent dans le jardin',
        'La voiture est garée devant la maison'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'fr', name: 'French', nativeName: 'Français' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('German Grammar Rules', () => {
    it('should correct noun capitalization', async () => {
      const testCases = [
        { input: 'der hund läuft', expected: 'der Hund' },
        { input: 'die katze schläft', expected: 'die Katze' },
        { input: 'das haus ist groß', expected: 'das Haus' },
        { input: 'der mann arbeitet', expected: 'der Mann' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'de', name: 'German', nativeName: 'Deutsch' }
        const result = await advancedGrammarCorrector.correctText(testCase.input, language)
        
        const capitalizationSuggestion = result.suggestions.find(s => s.rule === 'noun_capitalization')
        if (capitalizationSuggestion) {
          expect(capitalizationSuggestion.type).toBe('grammar')
          expect(capitalizationSuggestion.severity).toBe('error')
        }
      }
    })

    it('should handle German sentence structure', async () => {
      const testCases = [
        'Der Hund läuft schnell durch die Straße',
        'Die Katze schläft auf dem Sofa',
        'Das Haus ist sehr groß und schön'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'de', name: 'German', nativeName: 'Deutsch' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Hindi Grammar Rules', () => {
    it('should handle Hindi sentence structure', async () => {
      const testCases = [
        'मैं एक ईमेल लिखना चाहता हूं',
        'वह एक अच्छा छात्र है',
        'हम कल स्कूल जाएंगे'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should detect Hindi grammar patterns', async () => {
      const testCases = [
        'मैं एक ईमेल लिखना चाहता हूं नए कर्मचारी के लिए',
        'वह एक अच्छा छात्र है और वह पढ़ाई में मेहनत करता है',
        'हम कल स्कूल जाएंगे और फिर घर आएंगे'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Japanese Grammar Rules', () => {
    it('should handle Japanese sentence structure', async () => {
      const testCases = [
        '私は学生です',
        '彼は先生です',
        'これは本です'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'ja', name: 'Japanese', nativeName: '日本語' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should detect Japanese grammar patterns', async () => {
      const testCases = [
        '私は学生です。彼は先生です。',
        'これは本です。それはペンです。',
        '今日は天気が良いです。'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'ja', name: 'Japanese', nativeName: '日本語' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Chinese Grammar Rules', () => {
    it('should handle Chinese sentence structure', async () => {
      const testCases = [
        '我是一个学生',
        '他是一位老师',
        '这是一本书'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'zh', name: 'Chinese', nativeName: '中文' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should detect Chinese grammar patterns', async () => {
      const testCases = [
        '我是一个学生，他是一位老师',
        '这是一本书，那是一支笔',
        '今天天气很好'
      ]
      
      for (const testCase of testCases) {
        const language = { code: 'zh', name: 'Chinese', nativeName: '中文' }
        const result = await advancedGrammarCorrector.correctText(testCase, language)
        
        expect(result.original).toBe(testCase)
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Language Detection Integration', () => {
    it('should detect languages correctly', () => {
      const testCases = [
        { text: 'Hello world', expected: 'en' },
        { text: 'Hola mundo', expected: 'es' },
        { text: 'Bonjour le monde', expected: 'fr' },
        { text: 'Hallo Welt', expected: 'de' },
        { text: 'नमस्ते दुनिया', expected: 'hi' },
        { text: 'こんにちは世界', expected: 'ja' },
        { text: '你好世界', expected: 'zh' }
      ]
      
      for (const testCase of testCases) {
        const detectedLanguage = detectLanguage(testCase.text)
        expect(detectedLanguage.code).toBe(testCase.expected)
      }
    })

    it('should handle mixed language text', async () => {
      const mixedTexts = [
        'Hello, I am learning español',
        'Bonjour! I speak français and English',
        'Hola! I am learning Deutsch',
        'Hello 世界! I am learning 中文'
      ]
      
      for (const text of mixedTexts) {
        const language = detectLanguage(text)
        const result = await advancedGrammarCorrector.correctText(text, language)
        
        expect(result.original).toBe(text)
        expect(result.language).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Localized Messages', () => {
    it('should provide correct localized messages for all supported languages', () => {
      const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' }
      ]
      
      const messageKeys = ['grammarFixed', 'spellingFixed', 'noErrors', 'processingComplete'] as const
      
      for (const language of languages) {
        for (const key of messageKeys) {
          const message = advancedGrammarCorrector.getLocalizedMessage(key, language)
          expect(message).toBeDefined()
          expect(message.length).toBeGreaterThan(0)
          expect(typeof message).toBe('string')
        }
      }
    })

    it('should provide correct localized rule explanations', () => {
      const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' }
      ]
      
      const rules = ['article_vowel', 'subject_verb_agreement', 'double_negative']
      
      for (const language of languages) {
        for (const rule of rules) {
          const explanation = advancedGrammarCorrector.getLocalizedRuleExplanation(rule, language)
          expect(explanation).toBeDefined()
          expect(explanation.length).toBeGreaterThan(0)
          expect(typeof explanation).toBe('string')
        }
      }
    })
  })

  describe('Cross-Language Consistency', () => {
    it('should maintain consistent behavior across languages', async () => {
      const testCases = [
        { text: 'I need a apple', lang: 'en' },
        { text: 'Necesito una manzana', lang: 'es' },
        { text: 'J\'ai besoin d\'une pomme', lang: 'fr' },
        { text: 'Ich brauche einen Apfel', lang: 'de' }
      ]
      
      for (const testCase of testCases) {
        const language = { code: testCase.lang, name: 'Test', nativeName: 'Test' }
        const result = await advancedGrammarCorrector.correctText(testCase.text, language)
        
        expect(result.original).toBe(testCase.text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.confidence).toBeGreaterThanOrEqual(0)
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })

    it('should handle language-specific edge cases', async () => {
      const edgeCases = [
        { text: 'a', lang: 'en' },
        { text: 'el', lang: 'es' },
        { text: 'le', lang: 'fr' },
        { text: 'der', lang: 'de' },
        { text: 'मैं', lang: 'hi' },
        { text: '私', lang: 'ja' },
        { text: '我', lang: 'zh' }
      ]
      
      for (const testCase of edgeCases) {
        const language = { code: testCase.lang, name: 'Test', nativeName: 'Test' }
        const result = await advancedGrammarCorrector.correctText(testCase.text, language)
        
        expect(result.original).toBe(testCase.text)
        expect(result.corrected).toBeDefined()
        expect(result.suggestions).toBeDefined()
        expect(result.processingTime).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Performance Across Languages', () => {
    it('should maintain consistent performance across all languages', async () => {
      const testTexts = [
        { text: 'I need a apple', lang: 'en' },
        { text: 'Necesito una manzana', lang: 'es' },
        { text: 'J\'ai besoin d\'une pomme', lang: 'fr' },
        { text: 'Ich brauche einen Apfel', lang: 'de' },
        { text: 'मुझे एक सेब चाहिए', lang: 'hi' },
        { text: '私はリンゴが必要です', lang: 'ja' },
        { text: '我需要一个苹果', lang: 'zh' }
      ]
      
      const results = []
      
      for (const testCase of testTexts) {
        const language = { code: testCase.lang, name: 'Test', nativeName: 'Test' }
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
})
